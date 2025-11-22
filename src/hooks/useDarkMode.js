import { useState, useEffect } from 'react';

/**
 * Custom hook for managing dark mode
 * Respects system preferences and persists user choice
 * @returns {[boolean, Function]} - [isDark, toggleDarkMode]
 */
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('volutrack_dark_mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Fall back to system preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery ? mediaQuery.matches : false;
    }
    return false;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    // Persist to localStorage
    localStorage.setItem('volutrack_dark_mode', JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return [isDark, toggleDarkMode];
};

export default useDarkMode;
