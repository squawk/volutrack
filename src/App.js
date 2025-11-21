import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Statistics from './components/Statistics';
import GuestList from './components/GuestList';
import useLocalStorage from './hooks/useLocalStorage';
import useGuestManagement from './hooks/useGuestManagement';
import { STORAGE_KEYS, APP_CONSTANTS, GUEST_NAME_VALIDATION, VALIDATION_ERRORS } from './constants/validation';

const INITIAL_GUESTS = [
  {
    name: 'Treasure',
    isConfirmed: false
  },
  {
    name: 'Nic',
    isConfirmed: true
  }
];

const App = () => {
  const [guests, setGuests] = useLocalStorage(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
  const [value, setValue] = useState('');
  const [hideUnconfirmed, setHideUnconfirmed] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');

  const {
    totalInvited,
    attendingGuests,
    unconfirmedGuests,
    addGuest,
    removeGuest,
    toggleConfirmation,
    updateGuestName
  } = useGuestManagement(guests, setGuests);

  const validateGuestName = useCallback((name) => {
    if (!name || name.trim().length === 0) {
      return VALIDATION_ERRORS.EMPTY;
    }
    if (name.trim().length < GUEST_NAME_VALIDATION.MIN_LENGTH) {
      return VALIDATION_ERRORS.TOO_SHORT;
    }
    if (name.trim().length > GUEST_NAME_VALIDATION.MAX_LENGTH) {
      return VALIDATION_ERRORS.TOO_LONG;
    }
    if (!GUEST_NAME_VALIDATION.PATTERN.test(name.trim())) {
      return VALIDATION_ERRORS.INVALID_CHARACTERS;
    }
    const isDuplicate = guests.some(
      guest => guest.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      return VALIDATION_ERRORS.DUPLICATE;
    }
    return '';
  }, [guests]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const name = value.trim();

    const validationError = validateGuestName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    addGuest(name);
    setValue('');
    setError('');
  }, [value, validateGuestName, addGuest]);

  const handleInputChange = useCallback((e) => {
    setValue(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  const toggleHideUnconfirmed = useCallback(() => {
    setHideUnconfirmed(prev => !prev);
  }, []);

  const startEditing = useCallback((index) => {
    setEditingIndex(index);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingIndex(null);
  }, []);

  const handleNameChange = useCallback((index, newName) => {
    updateGuestName(index, newName);
  }, [updateGuestName]);

  return (
    <div className="App">
      <Header
        title={APP_CONSTANTS.TITLE}
        subtitle={APP_CONSTANTS.SUBTITLE}
        formValue={value}
        onFormSubmit={handleSubmit}
        onFormChange={handleInputChange}
        formError={error}
      />
      <div className="main">
        <div>
          <h2>Volunteers/Visitors</h2>
          <label>
            <input
              type="checkbox"
              checked={hideUnconfirmed}
              onChange={toggleHideUnconfirmed}
              aria-label="Hide unconfirmed guests"
            /> Hide those who haven't responded
          </label>
        </div>
        <Statistics
          attending={attendingGuests}
          unconfirmed={unconfirmedGuests}
          total={totalInvited}
        />
        <GuestList
          guests={guests}
          hideUnconfirmed={hideUnconfirmed}
          editingIndex={editingIndex}
          onToggleConfirmation={toggleConfirmation}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
          onNameChange={handleNameChange}
          onRemoveGuest={removeGuest}
        />
      </div>
    </div>
  );
};

export default App;
