import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FiMoon, FiSun, FiBarChart2 } from 'react-icons/fi';
import Header from './components/Header';
import Statistics from './components/Statistics';
import GuestList from './components/GuestList';
import SearchSort from './components/SearchSort';
import ConfirmModal from './components/ConfirmModal';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import GuestDetailModal from './components/GuestDetailModal';
import StatisticsChart from './components/StatisticsChart';
import EmptyState from './components/EmptyState';
import useLocalStorage from './hooks/useLocalStorage';
import useGuestManagement from './hooks/useGuestManagement';
import useDarkMode from './hooks/useDarkMode';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { exportToCSV, printGuestList } from './utils/exportUtils';
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
  // Core state
  const [guests, setGuests] = useLocalStorage(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
  const [value, setValue] = useState('');
  const [hideUnconfirmed, setHideUnconfirmed] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, guestIndex: null, guestName: '' });
  const [undoHistory, setUndoHistory] = useState([]);
  const [guestDetailModal, setGuestDetailModal] = useState({ isOpen: false, guest: null, guestIndex: null });
  const [showStats, setShowStats] = useState(false);

  // Hooks
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const guestNameInputRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Search and filter guests
  const filteredAndSortedGuests = useMemo(() => {
    let filtered = guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !hideUnconfirmed || guest.isConfirmed;
      return matchesSearch && matchesFilter;
    });

    // Sort guests
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'status-confirmed':
        filtered.sort((a, b) => (b.isConfirmed ? 1 : 0) - (a.isConfirmed ? 1 : 0));
        break;
      case 'status-pending':
        filtered.sort((a, b) => (a.isConfirmed ? 1 : 0) - (b.isConfirmed ? 1 : 0));
        break;
      case 'recent':
      default:
        // Keep original order (most recent at bottom)
        break;
    }

    return filtered;
  }, [guests, searchQuery, hideUnconfirmed, sortBy]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const name = value.trim();

    const validationError = validateGuestName(name);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    addGuest(name);
    setValue('');
    setError('');
    toast.success(`${name} added to guest list`);
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

  // Enhanced remove with confirmation and undo
  const handleRemoveRequest = useCallback((index) => {
    const guest = guests[index];
    setConfirmModal({
      isOpen: true,
      guestIndex: index,
      guestName: guest.name
    });
  }, [guests]);

  const handleRemoveConfirmed = useCallback(() => {
    const { guestIndex, guestName } = confirmModal;
    const removedGuest = { ...guests[guestIndex], index: guestIndex };

    removeGuest(guestIndex);
    setConfirmModal({ isOpen: false, guestIndex: null, guestName: '' });

    // Add to undo history
    setUndoHistory(prev => [...prev, removedGuest]);

    // Show toast with undo action
    toast.success(
      (t) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{guestName} removed</span>
          <button
            onClick={() => {
              handleUndo(removedGuest);
              toast.dismiss(t.id);
            }}
            style={{
              background: '#58b7cd',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    );
  }, [confirmModal, guests, removeGuest]);

  const handleUndo = useCallback((removedGuest) => {
    if (!removedGuest) {
      // Get last item from history
      if (undoHistory.length === 0) {
        toast.error('Nothing to undo');
        return;
      }
      removedGuest = undoHistory[undoHistory.length - 1];
      setUndoHistory(prev => prev.slice(0, -1));
    }

    // Re-insert the guest at the original position
    setGuests(prev => {
      const newGuests = [...prev];
      newGuests.splice(removedGuest.index, 0, {
        name: removedGuest.name,
        isConfirmed: removedGuest.isConfirmed
      });
      return newGuests;
    });

    toast.success(`${removedGuest.name} restored`);
  }, [undoHistory, setGuests]);

  const handleToggleConfirmation = useCallback((index) => {
    const guest = guests[index];
    toggleConfirmation(index);
    const newStatus = !guest.isConfirmed;
    toast.success(
      `${guest.name} marked as ${newStatus ? 'confirmed' : 'pending'}`,
      { duration: 2000 }
    );
  }, [guests, toggleConfirmation]);

  // Guest detail modal handlers
  const openGuestDetail = useCallback((index) => {
    const guest = guests[index];
    setGuestDetailModal({ isOpen: true, guest, guestIndex: index });
  }, [guests]);

  const closeGuestDetail = useCallback(() => {
    setGuestDetailModal({ isOpen: false, guest: null, guestIndex: null });
  }, []);

  const handleSaveGuestDetails = useCallback((index, updatedGuest) => {
    setGuests(prev => {
      const newGuests = [...prev];
      newGuests[index] = updatedGuest;
      return newGuests;
    });
    setGuestDetailModal(prev => ({ ...prev, guest: updatedGuest }));
    toast.success('Guest details saved');
  }, [setGuests]);

  // Export handlers
  const handleExportCSV = useCallback(() => {
    exportToCSV(guests);
    toast.success('Guest list exported to CSV');
  }, [guests]);

  const handlePrint = useCallback(() => {
    const stats = {
      attending: attendingGuests,
      unconfirmed: unconfirmedGuests,
      total: totalInvited
    };
    printGuestList(guests, stats);
    toast.success('Opening print dialog');
  }, [guests, attendingGuests, unconfirmedGuests, totalInvited]);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => ({
    'ctrl+n': () => guestNameInputRef.current?.focus(),
    'ctrl+f': () => searchInputRef.current?.focus(),
    'ctrl+e': handleExportCSV,
    'ctrl+p': handlePrint,
    'ctrl+d': toggleDarkMode,
    'ctrl+z': () => handleUndo(null),
  }), [handleExportCSV, handlePrint, toggleDarkMode, handleUndo]);

  const [showKeyboardHelp, toggleKeyboardHelp] = useKeyboardShortcuts(shortcuts);

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#4caf50',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#f44336',
              color: 'white',
            },
          },
        }}
      />

      <Header
        title={APP_CONSTANTS.TITLE}
        subtitle={APP_CONSTANTS.SUBTITLE}
        formValue={value}
        onFormSubmit={handleSubmit}
        onFormChange={handleInputChange}
        formError={error}
        inputRef={guestNameInputRef}
      />

      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--bg-secondary)',
          border: '2px solid var(--border-color)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode (Ctrl+D)`}
      >
        {isDarkMode ? <FiSun size={24} color="var(--text-primary)" /> : <FiMoon size={24} color="var(--text-primary)" />}
      </button>

      <button
        onClick={toggleKeyboardHelp}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--accent-color)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        ?
      </button>

      <button
        onClick={() => setShowStats(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: showStats ? 'var(--accent-color)' : 'var(--bg-secondary)',
          border: showStats ? 'none' : '2px solid var(--border-color)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
        aria-label={showStats ? 'Hide statistics' : 'Show statistics'}
        title={showStats ? 'Hide statistics' : 'Show statistics'}
      >
        <FiBarChart2 size={24} color={showStats ? 'white' : 'var(--text-primary)'} />
      </button>

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

        {showStats && (
          <StatisticsChart
            attending={attendingGuests}
            unconfirmed={unconfirmedGuests}
            total={totalInvited}
          />
        )}

        <SearchSort
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchInputRef={searchInputRef}
        />

        {guests.length === 0 ? (
          <EmptyState
            type="no-guests"
            onFocusInput={() => guestNameInputRef.current?.focus()}
          />
        ) : filteredAndSortedGuests.length === 0 ? (
          <EmptyState
            type={searchQuery ? 'no-results' : 'filtered'}
            searchQuery={searchQuery}
            onClearSearch={() => {
              setSearchQuery('');
              setHideUnconfirmed(false);
            }}
          />
        ) : (
          <GuestList
            guests={filteredAndSortedGuests}
            allGuests={guests}
            hideUnconfirmed={hideUnconfirmed}
            editingIndex={editingIndex}
            onToggleConfirmation={handleToggleConfirmation}
            onStartEditing={startEditing}
            onStopEditing={stopEditing}
            onNameChange={handleNameChange}
            onRemoveGuest={handleRemoveRequest}
            onGuestClick={openGuestDetail}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Remove Guest"
        message={`Are you sure you want to remove ${confirmModal.guestName}? You can undo this action.`}
        onConfirm={handleRemoveConfirmed}
        onCancel={() => setConfirmModal({ isOpen: false, guestIndex: null, guestName: '' })}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={toggleKeyboardHelp}
      />

      <GuestDetailModal
        isOpen={guestDetailModal.isOpen}
        guest={guestDetailModal.guest}
        guestIndex={guestDetailModal.guestIndex}
        onClose={closeGuestDetail}
        onSave={handleSaveGuestDetails}
        onToggleConfirmation={handleToggleConfirmation}
      />
    </div>
  );
};

export default App;
