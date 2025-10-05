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
OPENAI_API_KEY = ""
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
