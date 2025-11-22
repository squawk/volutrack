import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './KeyboardShortcutsHelp.css';

/**
 * Keyboard shortcuts help overlay
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether help is visible
 * @param {Function} props.onClose - Close handler
 */
const KeyboardShortcutsHelp = React.memo(({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ['Ctrl', 'N'], description: 'Focus guest name input' },
    { keys: ['Ctrl', 'F'], description: 'Focus search' },
    { keys: ['Ctrl', 'E'], description: 'Export to CSV' },
    { keys: ['Ctrl', 'P'], description: 'Print guest list' },
    { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
    { keys: ['Ctrl', 'Z'], description: 'Undo last deletion' },
    { keys: ['?'], description: 'Show/hide keyboard shortcuts' },
    { keys: ['Esc'], description: 'Close modals and cancel editing' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="shortcuts-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="shortcuts-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            <div className="shortcuts-header">
              <h2>Keyboard Shortcuts</h2>
              <button
                className="shortcuts-close"
                onClick={onClose}
                aria-label="Close shortcuts"
              >
                <FiX />
              </button>
            </div>
            <div className="shortcuts-list">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd className="key">{key}</kbd>
                        {i < shortcut.keys.length - 1 && <span className="key-plus">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="shortcut-description">{shortcut.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

KeyboardShortcutsHelp.displayName = 'KeyboardShortcutsHelp';

KeyboardShortcutsHelp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default KeyboardShortcutsHelp;
