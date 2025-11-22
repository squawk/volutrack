import { useEffect, useState } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to callbacks
 * @returns {[boolean, Function]} - [showHelp, toggleHelp]
 */
const useKeyboardShortcuts = (shortcuts) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show help on '?' key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Close help on Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
        return;
      }

      // Check for shortcuts
      for (const [key, callback] of Object.entries(shortcuts)) {
        const parts = key.toLowerCase().split('+');
        const requiresCtrl = parts.includes('ctrl') || parts.includes('cmd');
        const requiresShift = parts.includes('shift');
        const requiresAlt = parts.includes('alt');
        const mainKey = parts[parts.length - 1];

        const matchesModifiers =
          (requiresCtrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey) &&
          (requiresShift ? e.shiftKey : !e.shiftKey) &&
          (requiresAlt ? e.altKey : !e.altKey);

        if (matchesModifiers && e.key.toLowerCase() === mainKey) {
          e.preventDefault();
          callback();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, showHelp]);

  const toggleHelp = () => setShowHelp(prev => !prev);

  return [showHelp, toggleHelp];
};

export default useKeyboardShortcuts;
