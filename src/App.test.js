import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

beforeEach(() => {
  localStorage.clear();
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Volutrack')).toBeInTheDocument();
  });

  test('displays initial guests', () => {
    render(<App />);
    expect(screen.getByText('Treasure')).toBeInTheDocument();
    expect(screen.getByText('Nic')).toBeInTheDocument();
  });

  test('displays correct statistics', () => {
    render(<App />);
    // Check for specific table data
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Attending:');
    expect(table).toHaveTextContent('Total:');
  });

  test('adds a new guest when form is submitted', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Invite Someone');
    const submitButton = screen.getByText('Submit');

    await user.type(input, 'John Doe');
    await user.click(submitButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('validates guest name - empty name', async () => {
    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    expect(screen.getByText('Guest name cannot be empty')).toBeInTheDocument();
  });

  test('validates guest name - too short', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Invite Someone');
    const submitButton = screen.getByText('Submit');

    await user.type(input, 'A');
    await user.click(submitButton);

    expect(screen.getByText('Guest name must be at least 2 characters')).toBeInTheDocument();
  });

  test('validates guest name - duplicate name', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Invite Someone');
    const submitButton = screen.getByText('Submit');

    await user.type(input, 'Treasure');
    await user.click(submitButton);

    expect(screen.getByText('This guest name already exists')).toBeInTheDocument();
  });

  test('validates guest name - invalid characters', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Invite Someone');
    const submitButton = screen.getByText('Submit');

    await user.type(input, 'John123');
    await user.click(submitButton);

    expect(screen.getByText(/can only contain letters/i)).toBeInTheDocument();
  });

  test('clears input after adding guest', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Invite Someone');
    const submitButton = screen.getByText('Submit');

    await user.type(input, 'Jane Doe');
    await user.click(submitButton);

    expect(input).toHaveValue('');
  });

  test('toggles guest confirmation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const checkboxes = screen.getAllByRole('checkbox');
    // Find Treasure's checkbox (first guest, unconfirmed)
    const treasureCheckbox = checkboxes.find(cb =>
      cb.getAttribute('aria-label')?.includes('Treasure')
    );

    // Initially Treasure is unconfirmed, so it should be unchecked
    expect(treasureCheckbox).not.toBeChecked();

    await user.click(treasureCheckbox);

    // After click, Treasure should be confirmed
    expect(treasureCheckbox).toBeChecked();
  });

  test('removes a guest', async () => {
    const user = userEvent.setup();
    render(<App />);

    const removeButtons = screen.getAllByText('remove');
    await user.click(removeButtons[0]);

    expect(screen.queryByText('Treasure')).not.toBeInTheDocument();
  });

  test('edits guest name', async () => {
    const user = userEvent.setup();
    render(<App />);

    const editButtons = screen.getAllByText('edit');
    await user.click(editButtons[0]);

    const editInput = screen.getByDisplayValue('Treasure');
    await user.clear(editInput);
    await user.type(editInput, 'Updated Name');

    // Blur to stop editing
    fireEvent.blur(editInput);

    expect(screen.getByText('Updated Name')).toBeInTheDocument();
    expect(screen.queryByText('Treasure')).not.toBeInTheDocument();
  });

  test('hides unconfirmed guests when checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const hideCheckbox = screen.getByLabelText(/Hide those who haven't responded/i);
    await user.click(hideCheckbox);

    expect(screen.queryByText('Treasure')).not.toBeInTheDocument();
    expect(screen.getByText('Nic')).toBeInTheDocument();
  });

  test('persists data to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Invite Someone');
    const submitButton = screen.getByText('Submit');

    await user.type(input, 'Test User');
    await user.click(submitButton);

    const saved = localStorage.getItem('volutrack_guests');
    expect(saved).toBeTruthy();

    const parsedData = JSON.parse(saved);
    expect(parsedData).toHaveLength(3);
    expect(parsedData[2].name).toBe('Test User');
  });

  test('loads data from localStorage on mount', () => {
    const testData = [
      { name: 'Saved User', isConfirmed: true }
    ];
    localStorage.setItem('volutrack_guests', JSON.stringify(testData));

    render(<App />);

    expect(screen.getByText('Saved User')).toBeInTheDocument();
  });

  test('shows empty state message when all guests are removed', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Remove guests one by one, getting the buttons fresh each time
    let removeButtons = screen.getAllByText('remove');
    while (removeButtons.length > 0) {
      await user.click(removeButtons[0]);
      removeButtons = screen.queryAllByText('remove');
    }

    expect(screen.getByText(/No guests to display/i)).toBeInTheDocument();
  });
});
