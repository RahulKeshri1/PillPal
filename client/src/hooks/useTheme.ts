import { useState, useEffect } from 'react';
import { saveThemeToLS, getThemeFromLS } from '../utils/localStorage';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = getThemeFromLS();
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedTheme.isDarkMode ?? prefersDarkMode;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    saveThemeToLS(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
};

export default useTheme;
