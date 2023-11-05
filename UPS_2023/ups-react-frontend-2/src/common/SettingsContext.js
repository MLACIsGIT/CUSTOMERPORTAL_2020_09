import { createContext, useContext, useState } from "react";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [lang, setLang] = useState("en");

  return (
    <SettingsContext.Provider
      value={{
        lang,
        setLang,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default function useSettings() {
  return useContext(SettingsContext);
}
