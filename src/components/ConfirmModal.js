import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmModal.css';

/**
 * Confirmation modal for destructive actions
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {Function} props.onConfirm - Confirm callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 */
const ConfirmModal = React.memo(({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-content">
              <h2 id="modal-title" className="modal-title">{title}</h2>
              <p className="modal-message">{message}</p>
              <div className="modal-actions">
                <button
                  className="modal-button modal-button-cancel"
                  onClick={onCancel}
                  autoFocus
                >
                  {cancelText}
                </button>
                <button
                  className="modal-button modal-button-confirm"
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
};

export default ConfirmModal;
