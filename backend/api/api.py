from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

# -----------------------------
# CORS settings
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify allowed origins: ["https://example.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# API Config
# -----------------------------
OPENAI_API_KEY = "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"
CHATGPT_URL = "https://api.openai.com/v1/chat/completions"

@app.get("/chatgpt")
def chatgpt(message: str = Query(..., description="Message to send to ChatGPT")):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "Tu es un assistant."},
            {"role": "user", "content": message}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(CHATGPT_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error contacting ChatGPT API: {str(e)}")

    try:
        reply = response.json()["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=500, detail="Unexpected response format from ChatGPT API")

    return {"user_message": message, "chatgpt_reply": reply}
