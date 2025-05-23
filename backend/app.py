from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import openai
import os
from dotenv import load_dotenv
import traceback  # <-- import traceback for detailed error info
import requests

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from your React frontend

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file)

        # Generate quiz questions using OpenAI
        questions = generate_quiz_from_text(pdf_text)

        return jsonify({"questions": questions})

    except Exception as e:
        traceback.print_exc()  # <-- print full error stacktrace in terminal
        return jsonify({"error": str(e)}), 500


def extract_text_from_pdf(file) -> str:
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def generate_quiz_from_text(text: str):
    prompt = f"""You are an educational assistant. Based on the following text, generate 10 multiple-choice quiz questions. Each question should have 4 options and specify the correct answer.

Text:
{text[:2000]}

Respond with a JSON array like:
[
  {{
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  }},
  ...
]
"""

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "openai/gpt-3.5-turbo",  # you can switch to other models like anthropic/claude-2
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", json=body, headers=headers)

    if response.status_code != 200:
        raise Exception(f"OpenRouter API Error: {response.status_code} {response.text}")

    content = response.json()["choices"][0]["message"]["content"]

    try:
        return eval(content)  # Make sure the response is valid JSON
    except Exception as e:
        return [{"question": "Could not parse questions. Try again.", "options": [], "answer": ""}]



if __name__ == '__main__':
    app.run(debug=True)
