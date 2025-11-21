import { useCallback, useMemo } from 'react';

/**
 * Custom hook for guest management operations
 * @param {Array} guests - Array of guest objects
 * @param {Function} setGuests - Function to update guests state
 * @returns {Object} - Guest management functions and computed values
 */
const useGuestManagement = (guests, setGuests) => {
  // Computed values
  const totalInvited = useMemo(() => guests.length, [guests]);

  const attendingGuests = useMemo(
    () => guests.filter(guest => guest.isConfirmed).length,
    [guests]
  );

  const unconfirmedGuests = useMemo(
    () => guests.filter(guest => !guest.isConfirmed).length,
    [guests]
  );

  // Guest operations
  const addGuest = useCallback((name) => {
    setGuests(prevGuests => [
      ...prevGuests,
      {
        name: name.trim(),
        isConfirmed: false
      }
    ]);
  }, [setGuests]);

  const removeGuest = useCallback((index) => {
    setGuests(prevGuests => prevGuests.filter((_, i) => i !== index));
  }, [setGuests]);

  const toggleConfirmation = useCallback((index) => {
    setGuests(prevGuests =>
      prevGuests.map((guest, i) =>
        i === index ? { ...guest, isConfirmed: !guest.isConfirmed } : guest
      )
    );
  }, [setGuests]);

  const updateGuestName = useCallback((index, newName) => {
    setGuests(prevGuests =>
      prevGuests.map((guest, i) =>
        i === index ? { ...guest, name: newName } : guest
      )
    );
  }, [setGuests]);

  return {
    // Computed values
    totalInvited,
    attendingGuests,
    unconfirmedGuests,
    // Operations
    addGuest,
    removeGuest,
    toggleConfirmation,
    updateGuestName
  };
};

export default useGuestManagement;
