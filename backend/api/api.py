from fastapi import FastAPI, Query, HTTPException
import requests
import os

app = FastAPI()

# -----------------------------
# Load API key from environment variable
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
