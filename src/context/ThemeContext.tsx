import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { api } from '../services/mockApi';
import { SiteSettings } from '../types';

interface ThemeContextType {
  theme: SiteSettings['appearance'];
  updateThemePreview: (preview: Partial<SiteSettings['appearance']>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<SiteSettings['appearance']>({
    theme: 'dark',
    accentColor: '#dc2626', // Red-600
    fontFamily: 'Inter',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Initial load
  useEffect(() => {
    const loadSettings = async () => {
      const data = await api.settings.get();
      setSettings(data);
      setTheme(data.appearance);
    };
    loadSettings();
  }, []);

  // Sync settings when they change (e.g. from Admin save)
  useEffect(() => {
    if (settings) {
       setTheme(settings.appearance);
    }
  }, [settings]);

  // Apply styles to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set Accent Color Variable
    root.style.setProperty('--color-primary', theme.accentColor);
    
    // Set Font
    root.style.setProperty('--font-main', theme.fontFamily);

    // Theme Mode Logic
    if (theme.theme === 'light') {
       root.style.setProperty('--bg-main', '#f4f4f5'); // zinc-100
       root.style.setProperty('--bg-card', '#ffffff');
       root.style.setProperty('--text-main', '#18181b'); // zinc-950
       root.style.setProperty('--text-muted', '#71717a'); // zinc-500
       root.style.setProperty('--border-color', '#e4e4e7'); // zinc-200
       
       // Specific overrides for inputs in light mode
       root.style.setProperty('--input-bg', '#ffffff');
       root.style.setProperty('--input-border', '#d4d4d8');
       root.style.setProperty('--input-text', '#18181b');
    } else {
       root.style.setProperty('--bg-main', '#09090b'); // zinc-950
       root.style.setProperty('--bg-card', '#18181b'); // zinc-900
       root.style.setProperty('--text-main', '#ffffff');
       root.style.setProperty('--text-muted', '#a1a1aa'); // zinc-400
       root.style.setProperty('--border-color', '#27272a'); // zinc-800

       // Specific overrides for inputs in dark mode
       root.style.setProperty('--input-bg', 'rgba(0,0,0,0.3)');
       root.style.setProperty('--input-border', '#3f3f46');
       root.style.setProperty('--input-text', '#ffffff');
    }
  }, [theme]);

  const updateThemePreview = (preview: Partial<SiteSettings['appearance']>) => {
    setTheme(prev => ({ ...prev, ...preview }));
  };

  const resetTheme = async () => {
     if (settings) setTheme(settings.appearance);
     else {
       const data = await api.settings.get();
       setTheme(data.appearance);
     }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateThemePreview, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};