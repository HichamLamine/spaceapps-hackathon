from fastapi import FastAPI, Query, HTTPException
import requests
import os

app = FastAPI()

# -----------------------------
# Load API key from environment variable
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
