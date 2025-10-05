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



TARGET_POLLUTANTS = {"co", "no", "no2", "o3", "pm10", "pm25", "so2"}

import  utils,random

@app.get("/pollutants")
def get_pollutants(city: str = Query(..., description="City name to fetch pollutant data")):
    random.seed(city.lower())
    pollution = {
        "pm2.5": round(random.uniform(0, 250), 1),
        "pm10": round(random.uniform(0, 300), 1),
        "CO": round(random.uniform(0, 15), 1),
        "NO2": round(random.uniform(0, 200), 1),
        "O3": round(random.uniform(0, 120), 1),
        "NO": round(random.uniform(0, 100), 1),
        "humidity": round(random.uniform(20, 100), 1),
        "temperature": round(random.uniform(-10, 45), 1),
    }

    total_pollutants = (
        pollution["pm2.5"] +
        pollution["pm10"] +
        pollution["CO"] +
        pollution["NO2"] +
        pollution["O3"] +
        pollution["NO"]
    )

    AQI = round(
        (pollution["pm2.5"] / 250 * 100) * 0.2 +
        (pollution["pm10"] / 300 * 100) * 0.2 +
        (pollution["CO"] / 15 * 100) * 0.15 +
        (pollution["NO2"] / 200 * 100) * 0.15 +
        (pollution["O3"] / 120 * 100) * 0.15 +
        (pollution["NO"] / 100 * 100) * 0.15,
        1
    )

    # Step 5 — Remark and advice
    if AQI <= 50:
        remark = "Excellent air quality 👍. Enjoy the outdoors."
        advice = "Outdoor activities recommended."
    elif AQI <= 100:
        remark = "Good air quality 🙂. Low health risk."
        advice = "Normal activity."
    elif AQI <= 150:
        remark = "Moderate air quality 😐. Sensitive people may feel discomfort."
        advice = "Limit intense outdoor activity."
    elif AQI <= 200:
        remark = "Poor air quality 😷. Risks for sensitive groups."
        advice = "Avoid intense outdoor activity."
    elif AQI <= 300:
        remark = "Very poor air quality ⚠️. Risks for everyone."
        advice = "Limit outdoor activities."
    else:
        remark = "Hazardous air quality 🚨. Serious health risks."
        advice = "Stay indoors, avoid outdoor activity."

    # Convert to percentages
    pollution_percent = {
        "pm2.5": round((pollution["pm2.5"] / total_pollutants) * 100, 1),
        "pm10": round((pollution["pm10"] / total_pollutants) * 100, 1),
        "CO": round((pollution["CO"] / total_pollutants) * 100, 1),
        "NO2": round((pollution["NO2"] / total_pollutants) * 100, 1),
        "O3": round((pollution["O3"] / total_pollutants) * 100, 1),
        "NO": round((pollution["NO"] / total_pollutants) * 100, 1),
    }

    return {
        "city": city,
        "AQI": AQI,
        "remark": remark,
        "advice": advice,
        "pollutants": pollution_percent,
        "humidity": pollution["humidity"],
        "temperature": pollution["temperature"]
    }



