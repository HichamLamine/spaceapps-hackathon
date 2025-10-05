from fastapi import APIRouter, Query
import requests
import os
from datetime import datetime, timedelta

router = APIRouter()

# -----------------------------
# Clés API (à mettre dans ton .env ou config)
# -----------------------------
OPENAQ_BASE_URL = "https://api.openaq.org/v2/latest"
OPENWEATHERMAP_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
OPENWEATHERMAP_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

OPENAI_API_KEY = os.getenv("       ")  # mets ta clé OpenAI
OPENWEATHER_API_KEY = os.getenv("           ")  # mets ta clé OpenWeatherMap
CHATGPT_URL = "https://api.openai.com/v1/chat/completions"

# -----------------------------
# 1. Pollution AQI (OpenAQ)
# -----------------------------
@router.get("/aqi")
def get_aqi(lat: float, lon: float):
    params = {"coordinates": f"{lat},{lon}", "radius": 10000, "limit": 1}
    r = requests.get(OPENAQ_BASE_URL, params=params)
    if r.status_code != 200:
        return {"error": "OpenAQ API error", "details": r.json()}
    data = r.json()

    if not data.get("results"):
        return {"city": "Unknown", "aqi": None, "level": "No data"}

    city = data["results"][0]["city"]
    measurements = data["results"][0]["measurements"]

    pm25 = next((m["value"] for m in measurements if m["parameter"] == "pm25"), None)
    aqi_level = "Good"
    if pm25:
        if pm25 > 150: aqi_level = "Very Unhealthy"
        elif pm25 > 100: aqi_level = "Unhealthy"
        elif pm25 > 50: aqi_level = "Moderate"

    return {"city": city, "aqi": pm25, "level": aqi_level}

# -----------------------------
# 2. Météo actuelle (OpenWeatherMap)
# -----------------------------
@router.get("/weather")
def get_weather(lat: float, lon: float):
    params = {"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric", "lang": "fr"}
    r = requests.get(OPENWEATHERMAP_BASE_URL, params=params)
    if r.status_code != 200:
        return {"error": "Weather API error", "details": r.json()}
    data = r.json()
    return {
        "city": data.get("name"),
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"]
    }

# -----------------------------
# 3. Historique AQI (simulation 7 jours)
# -----------------------------
@router.get("/history")
def get_history(lat: float, lon: float):
    # ⚠️ OpenAQ ne donne pas l’historique facilement → ici on simule avec données fictives
    today = datetime.now()
    history = []
    for i in range(7):
        day = today - timedelta(days=i)
        history.append({"date": day.strftime("%Y-%m-%d"), "aqi": 50 + i * 10})
    return {"history": history}

# -----------------------------
# 4. Alertes AQI (prévision OpenWeatherMap)
# -----------------------------
@router.get("/alerts")
def get_alerts(lat: float, lon: float):
    params = {"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"}
    r = requests.get(OPENWEATHERMAP_FORECAST_URL, params=params)
    if r.status_code != 200:
        return {"error": "Forecast API error", "details": r.json()}
    data = r.json()

    # Exemple : chercher si AQI/météo devient dangereux dans la prévision
    forecast_alerts = []
    for entry in data["list"][:8]:  # prochaines 24h (8x3h)
        dt = datetime.fromtimestamp(entry["dt"]).strftime("%Y-%m-%d %H:%M")
        if entry["main"]["pm2_5"] if "pm2_5" in entry["main"] else None:
            forecast_alerts.append({"time": dt, "alert": "Pollution élevée prévue"})

    return {"alerts": forecast_alerts or ["Pas d’alerte dans les prochaines 24h"]}

# -----------------------------
# 5. Chatbot santé (OpenAI)
# -----------------------------
@router.get("/chatbot")
def chatbot(message: str = Query(..., description="Message from frontend")):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "Tu es un assistant santé spécialisé dans la qualité de l'air."},
            {"role": "user", "content": message}
        ]
    }
    r = requests.post(CHATGPT_URL, headers=headers, json=payload)
    if r.status_code != 200:
        return {"error": "ChatGPT API error", "details": r.json()}
    reply = r.json()["choices"][0]["message"]["content"]
    return {"user_message": message, "chatgpt_reply": reply}
