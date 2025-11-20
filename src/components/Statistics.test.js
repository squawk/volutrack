import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Statistics from './Statistics';

describe('Statistics Component', () => {
  test('renders all statistics rows', () => {
    render(<Statistics attending={5} unconfirmed={3} total={8} />);

    expect(screen.getByText('Attending:')).toBeInTheDocument();
    expect(screen.getByText('Unconfirmed:')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  test('displays correct attending count', () => {
    render(<Statistics attending={5} unconfirmed={3} total={8} />);

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('5');
  });

  test('displays correct unconfirmed count', () => {
    render(<Statistics attending={5} unconfirmed={3} total={8} />);

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('3');
  });

  test('displays correct total count', () => {
    render(<Statistics attending={5} unconfirmed={3} total={8} />);

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('8');
  });

  test('renders with zero values', () => {
    render(<Statistics attending={0} unconfirmed={0} total={0} />);

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('0');
  });

  test('has proper accessibility attributes', () => {
    render(<Statistics attending={5} unconfirmed={3} total={8} />);

    const table = screen.getByRole('table', { name: 'Guest statistics' });
    expect(table).toBeInTheDocument();
  });
});
