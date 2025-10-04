from fastapi import FastAPI,Query
import requests

app = FastAPI()

#--------------------------------------------
@app.get("/data/")
def get_data():
    return {"message": "Hello, FastAPI!"}

#---------------------------chat_bot----------------------

OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"
CHATGPT_URL = "https://api.openai.com/v1/chat/completions"


@app.get("/chatbot/")
def chatbot(message: str = Query(..., description="Message from frontend")):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful chatbot."},
            {"role": "user", "content": message}
        ],
        "temperature": 0.7
    }

    response = requests.post(CHATGPT_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return {"error": "ChatGPT API failed", "details": response.json()}

    data = response.json()
    reply = data["choices"][0]["message"]["content"]

    return {"user_message": message, "chatgpt_reply": reply}
