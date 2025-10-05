import requests
import ast
from typing import Dict, Optional
import api


def load_city_dict(file_path: str) -> Dict[str, int]:
    """
    Loads a city → id mapping from a file.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            city_dict = ast.literal_eval(content)
            return city_dict
    except Exception as e:
        print(f"Failed to load dictionary: {e}")
        return {}


def get_city_data (city_name):
    city_map = load_city_dict("../city_ids.txt")

    if city_name not in city_map:
        print(f"City '{city_name}' not found in map")
        return

    city_id = city_map[city_name]

    url = f"https://api.openaq.org/v3/locations/{city_id}"
    headers = {
        "X-API-Key": "58af2e5da6bc52d5aba17b89dd95a88e6fad23f2c17085d662d5fb1cd4154338"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return

    data = response.json()
    print("Raw API Response:", data)
    print("-" * 40)

    try:
        openaq_response = api.parse_openaq_response(data)  # Your parser
    except Exception as e:
        print(f"Failed to parse OpenAQ response: {e}")
        return

    import random
    target_pollutants = {"co", "no", "no2", "o3", "pm10", "pm25", "so2", "pm1", "um003", "relativehumidity",
                         "temperature"}

    for sensor in openaq_response.results[0].sensors:
        param = sensor.parameter
        name = param.name.lower()


    # Print results
    for sensor in openaq_response.results[0].sensors:
        param = sensor.parameter
        print(f"{param.displayName}: {getattr(param, 'value', 'N/A')} {param.units}")
    return openaq_response


