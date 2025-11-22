import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import Avatar from './Avatar';
import './SwipeableGuestItem.css';

/**
 * SwipeableGuestItem component with touch swipe actions for mobile
 * @param {Object} props
 * @param {Object} props.guest - Guest object
 * @param {number} props.index - Guest index
 * @param {boolean} props.isEditing - Whether this guest is being edited
 * @param {Function} props.onToggleConfirmation - Handler for toggling confirmation
 * @param {Function} props.onStartEditing - Handler for starting edit mode
 * @param {Function} props.onStopEditing - Handler for stopping edit mode
 * @param {Function} props.onNameChange - Handler for name changes
 * @param {Function} props.onRemove - Handler for removing guest
 * @param {Function} props.onClick - Handler for clicking on guest
 */
const SwipeableGuestItem = ({
  guest,
  index,
  isEditing,
  onToggleConfirmation,
  onStartEditing,
  onStopEditing,
  onNameChange,
  onRemove,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);

  // Transform x position to action visibility
  const leftActionOpacity = useTransform(x, [0, 80], [0, 1]);
  const rightActionOpacity = useTransform(x, [-80, 0], [1, 0]);
  const leftActionScale = useTransform(x, [0, 80], [0.5, 1]);
  const rightActionScale = useTransform(x, [-80, 0], [1, 0.5]);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const threshold = 80;

    if (info.offset.x > threshold) {
      // Swiped right - confirm/unconfirm
      onToggleConfirmation(index);
    } else if (info.offset.x < -threshold) {
      // Swiped left - delete
      onRemove(index);
    }
  };

  const guestStatus = guest.isConfirmed ? 'confirmed' : 'pending';

  return (
    <div className="swipeable-container" ref={constraintsRef}>
      {/* Left action (confirm) */}
      <motion.div
        className="swipe-action left"
        style={{
          opacity: leftActionOpacity,
          scale: leftActionScale
        }}
      >
        <div className={`action-content ${guest.isConfirmed ? 'unconfirm' : 'confirm'}`}>
          {guest.isConfirmed ? <FiX size={24} /> : <FiCheck size={24} />}
          <span>{guest.isConfirmed ? 'Unconfirm' : 'Confirm'}</span>
        </div>
      </motion.div>

      {/* Right action (delete) */}
      <motion.div
        className="swipe-action right"
        style={{
          opacity: rightActionOpacity,
          scale: rightActionScale
        }}
      >
        <div className="action-content delete">
          <FiTrash2 size={24} />
          <span>Delete</span>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className={`swipeable-guest-item ${guestStatus} ${isDragging ? 'dragging' : ''}`}
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={() => !isDragging && onClick && onClick()}
        whileTap={{ scale: isDragging ? 1 : 0.98 }}
        aria-label={`${guest.name}, status: ${guestStatus}. Swipe right to ${guest.isConfirmed ? 'unconfirm' : 'confirm'}, swipe left to delete`}
      >
        <div className="guest-item-content">
          <Avatar name={guest.name} size={44} />
          <div className="guest-info">
            {isEditing ? (
              <input
                type="text"
                className="guest-name-input"
                value={guest.name}
                onChange={(e) => onNameChange(index, e.target.value)}
                onBlur={onStopEditing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    onStopEditing();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Edit name for ${guest.name}`}
                autoFocus
              />
            ) : (
              <span className="guest-name">{guest.name}</span>
            )}
            <span className={`guest-status-badge ${guestStatus}`}>
              {guest.isConfirmed ? 'Confirmed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Desktop buttons (hidden on mobile) */}
        <div className="desktop-actions">
          <button
            className="action-btn confirm-btn"
            onClick={(e) => { e.stopPropagation(); onToggleConfirmation(index); }}
            aria-label={`Mark ${guest.name} as ${guest.isConfirmed ? 'unconfirmed' : 'confirmed'}`}
          >
            <FiCheck size={18} />
          </button>
          <button
            className="action-btn edit-btn"
            onClick={(e) => { e.stopPropagation(); onStartEditing(index); }}
            aria-label={`Edit ${guest.name}`}
          >
            edit
          </button>
          <button
            className="action-btn delete-btn"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            aria-label={`Remove ${guest.name}`}
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        {/* Swipe indicator for mobile */}
        <div className="swipe-hint">
          <span className="hint-text">Swipe</span>
        </div>
      </motion.div>
    </div>
  );
};

SwipeableGuestItem.propTypes = {
  guest: PropTypes.shape({
    name: PropTypes.string.isRequired,
    isConfirmed: PropTypes.bool.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onToggleConfirmation: PropTypes.func.isRequired,
  onStartEditing: PropTypes.func.isRequired,
  onStopEditing: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func
};

export default SwipeableGuestItem;
