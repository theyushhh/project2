
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'midnight' | 'neon' | 'solar' | 'pastel';

type Settings = {
  apiKey: string;
  theme: Theme;
  pitch: number; // 0 to 2
  voiceURI?: string;
};

type SettingsContextType = {
  settings: Settings;
  setSettings: (s: Settings) => void;
};

const defaultSettings: Settings = {
  apiKey: '',
  theme: 'midnight',
  pitch: 1,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('chatapp_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('chatapp_settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
