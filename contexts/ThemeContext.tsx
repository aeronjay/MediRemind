import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '../types';

type ThemeContextType = {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  colorScheme: 'light',
  setTheme: () => {},
  isDark: false,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const systemColorScheme = useColorScheme();
  
  const colorScheme = theme === 'auto' ? (systemColorScheme || 'light') : theme;
  const isDark = colorScheme === 'dark';

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
