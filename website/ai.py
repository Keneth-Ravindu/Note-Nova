from flask import Blueprint, request, jsonify
from flask_login import login_required
import os
from openai import OpenAI

ai = Blueprint("ai", __name__)

@ai.route("/ai", methods=["POST"])
@login_required
def ai_help():
    api_key = os.environ.get("OPENAI_API_KEY")

    if not api_key:
        return jsonify({"error": "API key not found"}), 500

    client = OpenAI(api_key=api_key)

    data = request.get_json() or {}
    action = data.get("action", "summarize")
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if action == "summarize":
        instruction = "Summarize the note in 2 sentences."
    elif action == "rewrite":
        instruction = "Rewrite this note clearly and professionally."
    elif action == "title":
        instruction = "Generate a short title."
    else:
        return jsonify({"error": "Unknown action"}), 400

    response = client.responses.create(
        model="gpt-4o-mini",
        input=f"{instruction}\n\n{text}"
    )

    return jsonify({"result": response.output_text})
