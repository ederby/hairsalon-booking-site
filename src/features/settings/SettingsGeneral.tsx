import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useColorScheme } from "@/context/ColorSchemeProvider";
import { useEditGeneralSettings } from "./useEditGeneralSettings";

const colorSchemes = [
  { value: "red" },
  { value: "orange" },
  { value: "amber" },
  { value: "yellow" },
  { value: "lime" },
  { value: "green" },
  { value: "emerald" },
  { value: "teal" },
  { value: "cyan" },
  { value: "sky" },
  { value: "blue" },
  { value: "indigo" },
  { value: "violet" },
  { value: "purple" },
  { value: "fuchsia" },
  { value: "pink" },
  { value: "rose" },
];

export default function SettingsGeneral() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { onEditGeneralSettings } = useEditGeneralSettings();

  function onChangingColorScheme(color: string) {
    setColorScheme(color);
    onEditGeneralSettings({ colorScheme: color });
  }

  console.log(colorScheme);

  return (
    <Card className="p-4 space-y-3">
      <Label htmlFor="colorScheme">Färgtema</Label>

      <div className="flex items-center gap-2">
        {colorSchemes.map((color) => (
          <div
            key={color.value}
            onClick={() => onChangingColorScheme(color.value)}
            className={`h-5 w-5 rounded-full bg-${color.value}-600 ${
              colorScheme === color.value ? "h-7 w-7" : ""
            } transition-all cursor-pointer`}
          ></div>
        ))}
      </div>
    </Card>
  );
}
