import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddGuestForm from './AddGuestForm';

describe('AddGuestForm Component', () => {
  const mockHandlers = {
    onSubmit: jest.fn((e) => e.preventDefault()),
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with input and submit button', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error=""
      />
    );

    expect(screen.getByPlaceholderText('Invite Someone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('displays current value in input', () => {
    render(
      <AddGuestForm
        value="John Doe"
        {...mockHandlers}
        error=""
      />
    );

    const input = screen.getByPlaceholderText('Invite Someone');
    expect(input).toHaveValue('John Doe');
  });

  test('calls onChange when typing in input', async () => {
    const user = userEvent.setup();
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error=""
      />
    );

    const input = screen.getByPlaceholderText('Invite Someone');
    await user.type(input, 'A');

    expect(mockHandlers.onChange).toHaveBeenCalled();
  });

  test('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <AddGuestForm
        value="John Doe"
        {...mockHandlers}
        error=""
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(mockHandlers.onSubmit).toHaveBeenCalled();
  });

  test('displays error message when error prop is provided', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error="Guest name cannot be empty"
      />
    );

    expect(screen.getByText('Guest name cannot be empty')).toBeInTheDocument();
  });

  test('does not display error message when error is empty', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error=""
      />
    );

    const errorDiv = screen.queryByRole('alert');
    expect(errorDiv).not.toBeInTheDocument();
  });

  test('sets aria-invalid to true when error exists', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error="Some error"
      />
    );

    const input = screen.getByPlaceholderText('Invite Someone');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('sets aria-invalid to false when no error', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error=""
      />
    );

    const input = screen.getByPlaceholderText('Invite Someone');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('links error message with aria-describedby when error exists', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error="Some error"
      />
    );

    const input = screen.getByPlaceholderText('Invite Someone');
    expect(input).toHaveAttribute('aria-describedby', 'guest-name-error');
  });

  test('has required and length attributes on input', () => {
    render(
      <AddGuestForm
        value=""
        {...mockHandlers}
        error=""
      />
    );

    const input = screen.getByPlaceholderText('Invite Someone');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('minLength', '2');
    expect(input).toHaveAttribute('maxLength', '50');
  });
});
