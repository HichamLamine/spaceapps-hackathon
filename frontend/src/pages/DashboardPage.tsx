import Sidemenu from "@/components/sidemenu";
import { VictoryPie, VictoryTheme } from "victory";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb } from "lucide-react";

const cities = [
  {
    value: "1",
    label: "Agadir(Morocco)",
  },
  {
    value: "2",
    label: "Marrakech(Morocco)",
  },
  {
    value: "3",
    label: "Casablanca(Morocco)",
  },
  {
    value: "4",
    label: "Paris(France)",
  },
  {
    value: "5",
    label: "Washington DC (USA)",
  },
  {
    value: "6",
    label: "Moscow (Russia)",
  },
  {
    value: "7",
    label: "Madrid (Spain)",
  },
  {
    value: "8",
    label: "Berlin (Germany)",
  },
];

const SelectCities = () => {
  const id = useId();

  return (
    <div className="w-full max-w-xs space-y-2 ">
      <Label htmlFor={id}>Cities</Label>
      <Select defaultValue={cities[0].label}>
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
};

export default function DashboardPage() {
  return (
    <div className="flex w-full">
      <Sidemenu />
      <div className="flex flex-col w-full gap-5 p-4">
        <div className="bg-green-300 p-2 rounded-2xl px-4 flex gap-2">
          <Lightbulb />
          <p>
            The air quality in this area is determined by measuring key
            polluants (PM2.5;PM10;NO2...).
            <br />
            Air quality indexed (AQI) reflects how clean or polluted the air is.
          </p>
        </div>
        <div className="flex justify-center">
          <SelectCities />
        </div>

        <VictoryPie
          data={[
            { x: "Cats", y: 35 },
            { x: "Dogs", y: 40 },
            { x: "Birds", y: 55 },
          ]}
          theme={VictoryTheme.clean}
        />
      </div>
    </div>
  );
}
