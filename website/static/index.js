let pendingDelete = null;

function qs(id) { return document.getElementById(id); }

function openConfirmModal(onConfirm) {
  const overlay = qs("confirmOverlay");
  const backdrop = qs("confirmBackdrop");
  const modal = qs("confirmModal");
  const btnCancel = qs("confirmCancel");
  const btnDelete = qs("confirmDelete");

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");

  requestAnimationFrame(() => {
    backdrop.classList.remove("opacity-0");
    backdrop.classList.add("opacity-100");
    modal.classList.remove("opacity-0", "translate-y-2", "scale-[0.98]");
    modal.classList.add("opacity-100", "translate-y-0", "scale-100");
  });

  const close = () => {
    modal.classList.remove("opacity-100", "translate-y-0", "scale-100");
    modal.classList.add("opacity-0", "translate-y-2", "scale-[0.98]");
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    setTimeout(() => {
      overlay.classList.add("hidden");
      overlay.classList.remove("flex");
      cleanup();
    }, 180);
  };

  const confirm = () => {
    close();
    onConfirm();
  };

  const onKey = (e) => {
    if (e.key === "Escape") close();
  };

  function cleanup() {
    btnCancel.removeEventListener("click", close);
    btnDelete.removeEventListener("click", confirm);
    backdrop.removeEventListener("click", close);
    document.removeEventListener("keydown", onKey);
  }

  btnCancel.addEventListener("click", close);
  btnDelete.addEventListener("click", confirm);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", onKey);
}

function showUndoToast(onUndo) {
  const wrap = qs("undoToastWrap");
  const toast = qs("undoToast");
  const undoBtn = qs("undoBtn");
  const closeBtn = qs("undoClose");

  wrap.classList.remove("hidden");

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
    toast.classList.add("opacity-100", "translate-y-0");
  });

  const hide = () => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => wrap.classList.add("hidden"), 180);
    cleanup();
  };

  const undo = () => {
    onUndo();
    hide();
  };

  function cleanup() {
    undoBtn.removeEventListener("click", undo);
    closeBtn.removeEventListener("click", hide);
  }

  undoBtn.addEventListener("click", undo);
  closeBtn.addEventListener("click", hide);

  return hide;
}

function removeNoteWithAnimation(el) {
  el.style.transition = "opacity 180ms ease, transform 180ms ease";
  el.style.opacity = "0";
  el.style.transform = "translateY(-6px)";
}

function restoreNote(el) {
  el.style.transition = "none";
  el.style.opacity = "0";
  el.style.transform = "translateY(-6px)";
  requestAnimationFrame(() => {
    el.style.transition = "opacity 180ms ease, transform 180ms ease";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
}

async function commitDeleteToServer(noteId) {
  const res = await fetch("/delete-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ noteId }),
  });
  if (!res.ok) throw new Error("Delete failed: " + res.status);
}

// Called from onclick="deleteNote({{ note.id }})"
function deleteNote(noteId) {

  if (pendingDelete && !pendingDelete.committed) {
    clearTimeout(pendingDelete.timer);
    pendingDelete.committed = true;
    commitDeleteToServer(pendingDelete.noteId).catch(console.error);
    pendingDelete = null;
  }

  const el = document.querySelector(`[data-note-id="${noteId}"]`);
  if (!el) {
    // fallback
    fetch("/delete-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    }).then(() => (window.location.href = "/"));
    return;
  }

  openConfirmModal(() => {
    const parent = el.parentElement;
    const nextSibling = el.nextElementSibling;

    removeNoteWithAnimation(el);

    setTimeout(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    }, 180);

    pendingDelete = {
      noteId,
      el,
      parent,
      nextSibling,
      committed: false,
      timer: null,
    };

    const undo = () => {
      if (!pendingDelete || pendingDelete.noteId !== noteId) return;
      clearTimeout(pendingDelete.timer);

      if (pendingDelete.nextSibling) {
        pendingDelete.parent.insertBefore(pendingDelete.el, pendingDelete.nextSibling);
      } else {
        pendingDelete.parent.appendChild(pendingDelete.el);
      }
      restoreNote(pendingDelete.el);
      pendingDelete = null;
    };

    const hideToast = showUndoToast(undo);

    pendingDelete.timer = setTimeout(async () => {
      try {
        pendingDelete.committed = true;
        hideToast();
        await commitDeleteToServer(noteId);
        pendingDelete = null;
      } catch (e) {
        console.error(e);
        undo();
      }
    }, 4000);
  });
}

async function runAI(action) {
  const noteEl = document.getElementById("note");
  const out = document.getElementById("aiOutput");
  if (!noteEl || !out) return;

  const text = noteEl.value || "";
  out.textContent = "Thinking…";

  try {
    const res = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, text }),
    });

    // Read raw text first (works even if server returns HTML error page)
    const raw = await res.text();

    // If not OK, show status + body
    if (!res.ok) {
      out.textContent = `Request failed (${res.status})\n\n${raw}`;
      return;
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      out.textContent = `Server returned non-JSON:\n\n${raw}`;
      return;
    }

    out.textContent = data.result || "(No result)";
  } catch (e) {
    out.textContent = `Network/Fetch error:\n${String(e)}`;
  }
}


