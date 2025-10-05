import requests
import ast
from typing import Dict, Optional
import api

def extract_all_pollutants(response: api.OpenAQResponse) -> Dict[str, Optional[Dict]]:
    pollutants: Dict[str, Optional[Dict]] = {}
    if not response.results:
        return pollutants

    location = response.results[0]

    if hasattr(location, "measurements") and location.measurements:
        for m in location.measurements:
            pollutants[m.parameter.name] = {
                "value": m.value,
                "unit": m.parameter.units,
                "lastUpdated": getattr(m, "lastUpdated", None)
            }
    return pollutants




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


def main():
    city_map = load_city_dict("city_ids.txt")
    city_name = 'A2P8277T (🇺🇸 US)'

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

    pollutants_data = extract_all_pollutants(openaq_response)

    print(f"Pollutants for {city_name}:")
    for pollutant, info in pollutants_data.items():
        if info and info["value"] is not None:
            print(f"  {pollutant.upper()}: {info['value']} {info['unit']}")
        else:
            print(f"  {pollutant.upper()}: No data")


if __name__ == "__main__":
    main()
