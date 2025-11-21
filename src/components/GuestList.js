import React from 'react';
import PropTypes from 'prop-types';

/**
 * GuestList component displays a list of guests with edit, remove, and confirmation controls
 * @param {Object} props - Component props
 * @param {Array} props.guests - Array of guest objects with name and isConfirmed properties
 * @param {boolean} props.hideUnconfirmed - Whether to hide unconfirmed guests
 * @param {number|null} props.editingIndex - Index of guest currently being edited, or null
 * @param {Function} props.onToggleConfirmation - Handler for toggling guest confirmation status
 * @param {Function} props.onStartEditing - Handler for starting edit mode for a guest
 * @param {Function} props.onStopEditing - Handler for stopping edit mode
 * @param {Function} props.onNameChange - Handler for changing guest name during edit
 * @param {Function} props.onRemoveGuest - Handler for removing a guest
 */
const GuestList = ({
  guests,
  hideUnconfirmed,
  editingIndex,
  onToggleConfirmation,
  onStartEditing,
  onStopEditing,
  onNameChange,
  onRemoveGuest
}) => {
  const filteredGuests = guests.filter(guest => !hideUnconfirmed || guest.isConfirmed);

  if (filteredGuests.length === 0) {
    return (
      <p role="status" aria-live="polite">
        No guests to display. Add a guest using the form above.
      </p>
    );
  }

  return (
    <ul aria-label="Guest list">
      {filteredGuests.map((guest, index) => {
        const actualIndex = guests.indexOf(guest);
        const guestStatus = guest.isConfirmed ? "confirmed" : "pending";

        return (
          <li
            key={actualIndex}
            className={guest.isConfirmed ? "responded" : "pending"}
            aria-label={`${guest.name}, status: ${guestStatus}`}
          >
            {editingIndex === actualIndex ? (
              <input
                type="text"
                value={guest.name}
                onChange={(e) => onNameChange(actualIndex, e.target.value)}
                onBlur={onStopEditing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    onStopEditing();
                  }
                }}
                aria-label={`Edit name for ${guest.name}`}
                autoFocus
              />
            ) : (
              <span>{guest.name}</span>
            )}
            <label>
              <input
                type="checkbox"
                checked={guest.isConfirmed}
                onChange={() => onToggleConfirmation(actualIndex)}
                aria-label={`Mark ${guest.name} as ${guest.isConfirmed ? 'unconfirmed' : 'confirmed'}`}
              /> Confirmed
            </label>
            <button
              onClick={() => onStartEditing(actualIndex)}
              aria-label={`Edit ${guest.name}`}
            >
              edit
            </button>
            <button
              onClick={() => onRemoveGuest(actualIndex)}
              aria-label={`Remove ${guest.name}`}
            >
              remove
            </button>
          </li>
        );
      })}
    </ul>
  );
};

GuestList.propTypes = {
  guests: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    isConfirmed: PropTypes.bool.isRequired
  })).isRequired,
  hideUnconfirmed: PropTypes.bool.isRequired,
  editingIndex: PropTypes.number,
  onToggleConfirmation: PropTypes.func.isRequired,
  onStartEditing: PropTypes.func.isRequired,
  onStopEditing: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onRemoveGuest: PropTypes.func.isRequired
};

export default GuestList;
