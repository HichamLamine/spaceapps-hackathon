from dataclasses import dataclass
from typing import List, Optional, Dict
import json

# ---------------- Data Structures ----------------
@dataclass
class Parameter:
    id: int
    name: str
    units: str
    displayName: str

@dataclass
class Sensor:
    id: int
    name: str
    parameter: Parameter

@dataclass
class Instrument:
    id: int
    name: str

@dataclass
class Country:
    id: int
    code: str
    name: str

@dataclass
class Owner:
    id: int
    name: str

@dataclass
class Provider:
    id: int
    name: str

@dataclass
class Coordinates:
    latitude: float
    longitude: float

@dataclass
class DateTimeInfo:
    utc: str
    local: str

@dataclass
class LocationData:
    id: int
    name: str
    locality: Optional[str]
    timezone: str
    country: Country
    owner: Owner
    provider: Provider
    isMobile: bool
    isMonitor: bool
    instruments: List[Instrument]
    sensors: List[Sensor]
    coordinates: Coordinates
    licenses: Optional[List[Dict]]
    bounds: List[float]
    distance: Optional[float]
    datetimeFirst: DateTimeInfo
    datetimeLast: DateTimeInfo

@dataclass
class Meta:
    name: str
    website: str
    page: int
    limit: int
    found: int

@dataclass
class OpenAQResponse:
    meta: Meta
    results: List[LocationData]

# ---------------- Parsing JSON ----------------
def parse_openaq_response(data: dict) -> OpenAQResponse:
    meta = Meta(**data["meta"])
    results = []
    for r in data["results"]:
        country = Country(**r["country"])
        owner = Owner(**r["owner"])
        provider = Provider(**r["provider"])
        instruments = [Instrument(**ins) for ins in r.get("instruments", [])]
        sensors = [Sensor(parameter=Parameter(**s["parameter"]), id=s["id"], name=s["name"]) for s in r.get("sensors", [])]
        coordinates = Coordinates(**r["coordinates"])
        datetimeFirst = DateTimeInfo(**r["datetimeFirst"])
        datetimeLast = DateTimeInfo(**r["datetimeLast"])

        loc_data = LocationData(
            id=r["id"],
            name=r["name"],
            locality=r.get("locality"),
            timezone=r["timezone"],
            country=country,
            owner=owner,
            provider=provider,
            isMobile=r["isMobile"],
            isMonitor=r["isMonitor"],
            instruments=instruments,
            sensors=sensors,
            coordinates=coordinates,
            licenses=r.get("licenses"),
            bounds=r.get("bounds"),
            distance=r.get("distance"),
            datetimeFirst=datetimeFirst,
            datetimeLast=datetimeLast
        )
        results.append(loc_data)
    return OpenAQResponse(meta=meta, results=results)


