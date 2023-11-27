import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('color-theme') || 'dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('color-theme');
    if ( storedTheme ) {
      setTheme(storedTheme);
    } else if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('color-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, setTheme };
};