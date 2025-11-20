import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Statistics from './components/Statistics';
import GuestList from './components/GuestList';

const STORAGE_KEY = 'volutrack_guests';

const App = () => {
  const [guests, setGuests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      {
        name: 'Treasure',
        isConfirmed: false
      },
      {
        name: 'Nic',
        isConfirmed: true
      }
    ];
  });
  const [value, setValue] = useState('');
  const [hideUnconfirmed, setHideUnconfirmed] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');

  // Persist guests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  }, [guests]);

  const getTotalInvited = useCallback(() => guests.length, [guests]);

  const getAttendingGuests = useCallback(() =>
    guests.filter(guest => guest.isConfirmed).length,
    [guests]
  );

  const getUnconfirmedGuests = useCallback(() =>
    guests.filter(guest => !guest.isConfirmed).length,
    [guests]
  );

  const validateGuestName = useCallback((name) => {
    if (!name || name.trim().length === 0) {
      return 'Guest name cannot be empty';
    }
    if (name.trim().length < 2) {
      return 'Guest name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Guest name must be less than 50 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return 'Guest name can only contain letters, spaces, hyphens, and apostrophes';
    }
    const isDuplicate = guests.some(
      guest => guest.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      return 'This guest name already exists';
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

    setGuests(prevGuests => [
      ...prevGuests,
      {
        name: name,
        isConfirmed: false
      }
    ]);
    setValue('');
    setError('');
  }, [value, validateGuestName]);

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

  const toggleConfirmation = useCallback((index) => {
    setGuests(prevGuests =>
      prevGuests.map((guest, i) =>
        i === index ? { ...guest, isConfirmed: !guest.isConfirmed } : guest
      )
    );
  }, []);

  const removeGuest = useCallback((index) => {
    setGuests(prevGuests => prevGuests.filter((guest, i) => i !== index));
  }, []);

  const updateGuestName = useCallback((index, newName) => {
    setGuests(prevGuests =>
      prevGuests.map((guest, i) =>
        i === index ? { ...guest, name: newName } : guest
      )
    );
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
        title="Volutrack"
        subtitle="Rosamond Elementary"
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
          attending={getAttendingGuests()}
          unconfirmed={getUnconfirmedGuests()}
          total={getTotalInvited()}
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
