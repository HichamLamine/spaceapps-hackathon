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
import {
  Droplet,
  Lightbulb,
  Megaphone,
  Scroll,
  ShieldCheck,
  Thermometer,
} from "lucide-react";

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
      <div className="max-w-[750px] w-full mx-auto">
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Temperature */}
        <div className="flex items-center gap-2 p-4 rounded-2xl border border-[#0087FD]/40 bg-[#0087FD]/5">
          <Thermometer className="w-6 h-6 text-[#0087FD]" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Temperature</span>
            <span className="text-lg font-semibold text-[#0087FD]">
              {data.temperature}°C
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2 p-4 rounded-2xl border border-[#0087FD]/40 bg-[#0087FD]/5">
          <Droplet className="w-6 h-6 text-[#0087FD]" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Humidity</span>
            <span className="text-lg font-semibold text-[#0087FD]">
              {data.humidity}%
            </span>
          </div>
        </div>

        {/* AQI */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#0087FD] text-[#0087FD] font-semibold bg-[#0087FD]/5">
          <ShieldCheck className="w-7 h-7 mb-1" />
          <span className="text-sm text-muted-foreground">
            Air Quality Index
          </span>
          <span className="text-2xl font-bold">{data.AQI}</span>
        </div>

        {/* Advice */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#0087FD]/40 text-[#0087FD] bg-[#0087FD]/5">
          <Scroll className="w-6 h-6 mb-1" />
          <span className="text-sm text-muted-foreground">Advice</span>
          <span className="text-lg font-medium text-center">{data.advice}</span>
        </div>

        {/* Remark */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#0087FD]/40 text-[#0087FD] bg-[#0087FD]/5 sm:col-span-2 lg:col-span-1">
          <Megaphone className="w-6 h-6 mb-1" />
          <span className="text-sm text-muted-foreground">Remark</span>
          <span className="text-lg font-medium text-center">{data.remark}</span>
        </div>
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
    <div className="w-full max-w-xs space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-[#0087FD] tracking-wide"
      >
        Choose your city
      </Label>
      <Select onValueChange={handleSelect} defaultValue={cities[0].value}>
        <SelectTrigger
          id={id}
          className="w-full bg-[#0b0b0b] border border-[#0087FD]/50 text-white placeholder:text-gray-400 hover:border-[#0087FD] focus:ring-2 focus:ring-[#0087FD] focus:border-[#0087FD] rounded-xl transition-all duration-150"
        >
          <SelectValue placeholder="Select your city" />
        </SelectTrigger>
        <SelectContent className="bg-[#101010] border border-[#0087FD]/30 text-white rounded-xl shadow-lg">
          <SelectGroup>
            {cities.map((city) => (
              <SelectItem
                key={city.value}
                value={city.value}
                className="cursor-pointer hover:bg-[#0087FD]/20 focus:bg-[#0087FD]/30 focus:text-[#0087FD] text-white rounded-md transition-all"
              >
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
