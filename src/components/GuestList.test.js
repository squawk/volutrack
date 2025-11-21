import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GuestList from './GuestList';

const mockGuests = [
  { name: 'Alice', isConfirmed: true },
  { name: 'Bob', isConfirmed: false },
  { name: 'Charlie', isConfirmed: true }
];

const mockHandlers = {
  onToggleConfirmation: jest.fn(),
  onStartEditing: jest.fn(),
  onStopEditing: jest.fn(),
  onNameChange: jest.fn(),
  onRemoveGuest: jest.fn()
};

describe('GuestList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all guests', () => {
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('filters unconfirmed guests when hideUnconfirmed is true', () => {
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={true}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('shows empty state when no guests match filter', () => {
    render(
      <GuestList
        guests={[{ name: 'Bob', isConfirmed: false }]}
        hideUnconfirmed={true}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText(/No guests to display/i)).toBeInTheDocument();
  });

  test('calls onToggleConfirmation when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockHandlers.onToggleConfirmation).toHaveBeenCalledWith(0);
  });

  test('calls onStartEditing when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    const editButtons = screen.getAllByText('edit');
    await user.click(editButtons[0]);

    expect(mockHandlers.onStartEditing).toHaveBeenCalledWith(0);
  });

  test('calls onRemoveGuest when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    const removeButtons = screen.getAllByText('remove');
    await user.click(removeButtons[0]);

    expect(mockHandlers.onRemoveGuest).toHaveBeenCalledWith(0);
  });

  test('shows edit input when editingIndex matches', () => {
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={0}
        {...mockHandlers}
      />
    );

    const editInput = screen.getByDisplayValue('Alice');
    expect(editInput).toBeInTheDocument();
  });

  test('calls onStopEditing when pressing Enter in edit mode', async () => {
    const user = userEvent.setup();
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={0}
        {...mockHandlers}
      />
    );

    const editInput = screen.getByDisplayValue('Alice');
    await user.type(editInput, '{Enter}');

    expect(mockHandlers.onStopEditing).toHaveBeenCalled();
  });

  test('calls onStopEditing when pressing Escape in edit mode', async () => {
    const user = userEvent.setup();
    render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={0}
        {...mockHandlers}
      />
    );

    const editInput = screen.getByDisplayValue('Alice');
    await user.type(editInput, '{Escape}');

    expect(mockHandlers.onStopEditing).toHaveBeenCalled();
  });

  test('applies correct CSS class for confirmed guests', () => {
    const { container } = render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    const confirmedItems = container.querySelectorAll('.responded');
    expect(confirmedItems.length).toBe(2); // Alice and Charlie
  });

  test('applies correct CSS class for unconfirmed guests', () => {
    const { container } = render(
      <GuestList
        guests={mockGuests}
        hideUnconfirmed={false}
        editingIndex={null}
        {...mockHandlers}
      />
    );

    const pendingItems = container.querySelectorAll('.pending');
    expect(pendingItems.length).toBe(1); // Bob
  });
});
