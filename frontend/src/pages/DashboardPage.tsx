import Sidemenu from "@/components/sidemenu";
import { VictoryPie, VictoryTheme } from "victory";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droplet, Lightbulb, ShieldCheck, Thermometer } from "lucide-react";

import { useState, useEffect } from "react";

interface Pollutants {
  "pm2.5": number;
  pm10: number;
  CO: number;
  NO2: number;
  O3: number;
  NO: number;
}

interface CityData {
  city: string;
  AQI: number;
  remark: string;
  advice: string;
  pollutants: Pollutants;
  humidity: number;
  temperature: number;
}

interface Props {
  cityName: string;
}

const PollutantInfo = ({ cityName }: Props) => {
  const [data, setData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/pollutants?city=${encodeURIComponent(cityName)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result: CityData = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-2">
      <VictoryPie
        innerRadius={50}
        padAngle={5}
        data={[
          { x: "pm2.5", y: data.pollutants["pm2.5"] },
          { x: "pm10", y: data.pollutants.pm10 },
          { x: "CO", y: data.pollutants.CO },
          { x: "NO2", y: data.pollutants.NO2 },
          { x: "O3", y: data.pollutants.O3 },
          { x: "NO", y: data.pollutants.NO },
        ]}
        theme={VictoryTheme.clean}
      />

      <div className="flex gap-1">
        <Thermometer color="#0087FD" />
        <span>Temperature: {data.temperature}</span>
      </div>
      <div className="flex gap-1">
        <Droplet color="#0087FD" />
        <span>Humidity: {data.humidity}</span>
      </div>
      <div className="flex items-center justify-center gap-2 border border-[#0087FD] text-[#0087FD] font-semibold rounded-xl px-4 py-2 w-fit mx-auto mt-4">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-xl">Air Quality Index: {data.AQI}</span>
      </div>
    </div>
  );
};

const cities = [
  {
    value: "1",
    name: "Agadir",
    label: "Agadir(Morocco)",
  },
  {
    value: "2",
    name: "Marrakech",
    label: "Marrakech(Morocco)",
  },
  {
    value: "3",
    name: "Casablanca",
    label: "Casablanca(Morocco)",
  },
  {
    value: "4",
    name: "Paris",
    label: "Paris(France)",
  },
  {
    value: "5",
    name: "Washington D.C.",
    label: "Washington DC (USA)",
  },
  {
    value: "6",
    name: "Moscow",
    label: "Moscow (Russia)",
  },
  {
    value: "7",
    name: "Madrid",
    label: "Madrid (Spain)",
  },
  {
    value: "8",
    name: "Berlin",
    label: "Berlin (Germany)",
  },
];

interface SelectProps {
  city: string;
  onCityChange: any;
}

function SelectCities({ city, onCityChange }: SelectProps) {
  const id = useId();

  const handleSelect = (value: string) => {
    onCityChange(value);
  };

  return (
    <div className="w-full max-w-xs space-y-2 ">
      <Label htmlFor={id}>Choose your city</Label>
      <Select onValueChange={handleSelect} defaultValue={cities[0].label}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select your city" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function DashboardPage() {
  const [city, setCity] = useState<string>("");

  return (
    <div className="flex w-full">
      <Sidemenu />
      <div className="flex flex-col w-full gap-5 p-4">
        <div className="bg-[#0087FD] p-2 rounded-2xl px-4 flex gap-2">
          <Lightbulb />
          <p>
            The air quality in this area is determined by measuring key
            polluants (PM2.5;PM10;NO2...). Air quality index (AQI) reflects how
            clean or polluted the air is.
          </p>
        </div>
        <div className="flex justify-center">
          <SelectCities city={city} onCityChange={setCity} />
        </div>

        <PollutantInfo cityName={city} />
      </div>
    </div>
  );
}
