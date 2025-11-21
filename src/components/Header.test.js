import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  const mockProps = {
    title: 'Volutrack',
    subtitle: 'Rosamond Elementary',
    formValue: '',
    onFormSubmit: jest.fn((e) => e.preventDefault()),
    onFormChange: jest.fn(),
    formError: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title', () => {
    render(<Header {...mockProps} />);

    expect(screen.getByRole('heading', { name: 'Volutrack' })).toBeInTheDocument();
  });

  test('renders subtitle when provided', () => {
    render(<Header {...mockProps} />);

    expect(screen.getByText('Rosamond Elementary')).toBeInTheDocument();
  });

  test('does not render subtitle when not provided', () => {
    const propsWithoutSubtitle = { ...mockProps, subtitle: '' };
    render(<Header {...propsWithoutSubtitle} />);

    expect(screen.queryByText('Rosamond Elementary')).not.toBeInTheDocument();
  });

  test('renders AddGuestForm component', () => {
    render(<Header {...mockProps} />);

    expect(screen.getByPlaceholderText('Invite Someone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('passes form props to AddGuestForm', () => {
    render(<Header {...mockProps} formValue="Test Name" />);

    const input = screen.getByPlaceholderText('Invite Someone');
    expect(input).toHaveValue('Test Name');
  });

  test('passes error to AddGuestForm', () => {
    render(<Header {...mockProps} formError="Error message" />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('has semantic header element', () => {
    const { container } = render(<Header {...mockProps} />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});
