import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck, FiClock } from 'react-icons/fi';
import Avatar from './Avatar';
import './GuestDetailModal.css';

/**
 * GuestDetailModal component for viewing and editing guest details
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Object} props.guest - The guest object
 * @param {number} props.guestIndex - Index of the guest in the list
 * @param {Function} props.onClose - Handler for closing the modal
 * @param {Function} props.onSave - Handler for saving guest details
 * @param {Function} props.onToggleConfirmation - Handler for toggling confirmation
 */
const GuestDetailModal = ({
  isOpen,
  guest,
  guestIndex,
  onClose,
  onSave,
  onToggleConfirmation
}) => {
  const [editedGuest, setEditedGuest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (guest) {
      setEditedGuest({
        ...guest,
        email: guest.email || '',
        phone: guest.phone || '',
        notes: guest.notes || ''
      });
    }
  }, [guest]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!guest || !editedGuest) return null;

  const handleInputChange = (field, value) => {
    setEditedGuest(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(guestIndex, editedGuest);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedGuest({
      ...guest,
      email: guest.email || '',
      phone: guest.phone || '',
      notes: guest.notes || ''
    });
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="guest-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="guest-detail-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              className="guest-detail-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>

            <div className="guest-detail-header">
              <Avatar name={editedGuest.name} size={80} />
              <div className="guest-detail-title">
                {isEditing ? (
                  <input
                    type="text"
                    className="guest-detail-name-input"
                    value={editedGuest.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    aria-label="Guest name"
                  />
                ) : (
                  <h2>{editedGuest.name}</h2>
                )}
                <span className={`guest-detail-status ${editedGuest.isConfirmed ? 'confirmed' : 'pending'}`}>
                  {editedGuest.isConfirmed ? (
                    <><FiCheck /> Confirmed</>
                  ) : (
                    <><FiClock /> Pending</>
                  )}
                </span>
              </div>
            </div>

            <div className="guest-detail-body">
              <div className="guest-detail-field">
                <label>
                  <FiMail className="field-icon" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedGuest.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Add email address"
                  />
                ) : (
                  <span className={!editedGuest.email ? 'empty' : ''}>
                    {editedGuest.email || 'No email provided'}
                  </span>
                )}
              </div>

              <div className="guest-detail-field">
                <label>
                  <FiPhone className="field-icon" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedGuest.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Add phone number"
                  />
                ) : (
                  <span className={!editedGuest.phone ? 'empty' : ''}>
                    {editedGuest.phone || 'No phone provided'}
                  </span>
                )}
              </div>

              <div className="guest-detail-field">
                <label>
                  <FiMessageSquare className="field-icon" />
                  Notes
                </label>
                {isEditing ? (
                  <textarea
                    value={editedGuest.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add notes about this guest"
                    rows={3}
                  />
                ) : (
                  <span className={!editedGuest.notes ? 'empty' : ''}>
                    {editedGuest.notes || 'No notes'}
                  </span>
                )}
              </div>
            </div>

            <div className="guest-detail-actions">
              {isEditing ? (
                <>
                  <button className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`btn-status ${editedGuest.isConfirmed ? 'confirmed' : 'pending'}`}
                    onClick={() => onToggleConfirmation(guestIndex)}
                  >
                    {editedGuest.isConfirmed ? 'Mark as Pending' : 'Mark as Confirmed'}
                  </button>
                  <button className="btn-primary" onClick={() => setIsEditing(true)}>
                    <FiUser /> Edit Details
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

GuestDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  guest: PropTypes.shape({
    name: PropTypes.string.isRequired,
    isConfirmed: PropTypes.bool.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    notes: PropTypes.string
  }),
  guestIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onToggleConfirmation: PropTypes.func.isRequired
};

export default GuestDetailModal;
