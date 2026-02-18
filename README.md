# 🚀 NoteNova

**AI-Powered Notes App built with Flask**

NoteNova is a modern, full-stack note-taking web application that combines secure user authentication, persistent storage, and AI assistance to help you write, organize, and refine ideas faster.


<img width="1909" height="908" alt="1" src="https://github.com/user-attachments/assets/a3aa0bc5-c623-40c9-9ace-799ea2e27218" />
<img width="1920" height="906" alt="2" src="https://github.com/user-attachments/assets/3f67c890-751c-4d9a-bfe3-2cf66e312941" />
<img width="1920" height="910" alt="3" src="https://github.com/user-attachments/assets/78dcc821-7bec-468a-838c-99ece42230ad" />
<img width="1920" height="906" alt="4" src="https://github.com/user-attachments/assets/40287a96-eb55-4a08-bfb2-691b1cc6dd22" />

---

## ✨ Features

* 🔐 User Authentication (Sign Up / Login / Logout)
* 📝 Create, view, and delete personal notes
* 💾 SQLite database with SQLAlchemy ORM
* 🎨 Modern responsive UI (TailwindCSS)
* 🗑️ Animated delete confirmation + undo support
* 🤖 AI Tools:

  * Summarize notes
  * Rewrite notes for clarity
  * Generate titles instantly
* 🔒 Secure API key handling using environment variables (`.env`)
* 🖼️ Custom NoteNova logo + favicon branding

---

## 🛠️ Tech Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Backend          | Flask (Python)                 |
| Database         | SQLite + SQLAlchemy            |
| Authentication   | Flask-Login                    |
| Frontend         | Jinja2 Templates + TailwindCSS |
| AI Integration   | OpenAI API                     |
| Environment Mgmt | python-dotenv                  |

---

## 📦 Installation Guide

Follow these steps to run NoteNova locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/notenova.git
cd notenova
```

---

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

---

### 3️⃣ Install Required Packages (pip installation)

Install dependencies using pip:

```bash
pip install Flask Flask-Login Flask-SQLAlchemy openai python-dotenv Werkzeug
```

---

### 4️⃣ Create Environment File

Create a `.env` file in the root directory:

```
OPENAI_API_KEY=your_api_key_here
```

⚠️ Do **NOT** upload this file to GitHub.

---

### 5️⃣ Run the Application

```bash
python main.py
```

Open your browser and go to:

```
http://127.0.0.1:5000
```

---

## 🤖 AI Setup (One-Time Configuration)

To use AI features, your OpenAI account must have billing enabled.

If you see this error:

```
429 insufficient_quota
```

Go to:
https://platform.openai.com/settings/billing

Add a payment method and restart the app.

---

## 📁 Project Structure

```
notenova/
│
├── main.py
├── .env                # API key (ignored by Git)
├── .gitignore
│
└── website/
    ├── __init__.py
    ├── models.py
    ├── views.py
    ├── auth.py
    ├── ai.py
    │
    ├── templates/
    │   ├── base.html
    │   ├── home.html
    │   ├── login.html
    │   └── sign_up.html
    │
    └── static/
        └── index.js
     
```

---

## 🔐 Security Notes

* API keys are stored only in `.env`
* `.env` is excluded via `.gitignore`
* AI requests are processed server-side (never exposed to browser)

---

## 🧯 Troubleshooting

| Problem              | Fix                                |
| -------------------- | ---------------------------------- |
| AI not responding    | Restart Flask after editing `.env` |
| Database not created | Delete `database.db` and rerun app |
| Invalid API key      | Verify key in `.env`               |
| Quota exceeded       | Enable billing in OpenAI dashboard |

---

## 🚀 Future Improvements

* AI chat with your notes
* Semantic search
* Tag generation
* Export notes as PDF
* Cloud deployment (Render / Docker)
* Collaborative sharing

---

## 📄 License

MIT License — free to use, modify, and learn from.

---

## 👨‍💻 Author

Developed as a Final Year Computer Science project exploring Flask architecture and AI integration.

---

⭐ If you like this project, consider giving it a star!
