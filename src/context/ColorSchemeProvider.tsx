import { useGeneralSettings } from "@/features/settings/useGeneralSettings";
import React, { createContext, useContext, useState, useEffect } from "react";

interface ColorSchemeContextType {
  colorScheme: string;
  setColorScheme: (scheme: string) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: "teal",
  setColorScheme: () => {},
});

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { generalSettings } = useGeneralSettings();
  const [colorScheme, setColorScheme] = useState<string>(
    generalSettings?.colorScheme || "teal"
  );

  useEffect(() => {
    document.documentElement.className = `theme-${colorScheme}`;
  }, [colorScheme]);
  useEffect(() => {
    if (generalSettings) {
      setColorScheme(generalSettings.colorScheme);
    }
  }, [generalSettings]);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export const useColorScheme = () => useContext(ColorSchemeContext);
