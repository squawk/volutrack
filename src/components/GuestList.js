import React from 'react';
import PropTypes from 'prop-types';

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

  return (
    <ul>
      {filteredGuests.map((guest, index) => {
        const actualIndex = guests.indexOf(guest);
        return (
          <li key={actualIndex} className={guest.isConfirmed ? "responded" : "pending"}>
            {editingIndex === actualIndex ? (
              <input
                type="text"
                value={guest.name}
                onChange={(e) => onNameChange(actualIndex, e.target.value)}
                onBlur={onStopEditing}
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
              /> Confirmed
            </label>
            <button onClick={() => onStartEditing(actualIndex)}>edit</button>
            <button onClick={() => onRemoveGuest(actualIndex)}>remove</button>
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
