/// <reference types="jest" />
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactCard from '../components/ContactCard';
import type { Contact } from '../types/types';

const contact: Contact = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '98765432',
  company: 'Doe Inc.',
  status: 'FOLLOW_UP',
  note: 'Important client',
  order: 0,
  // Use whatever your type expects for createdAt; many codebases use string
  createdAt: new Date().toISOString(),
  // Remove userId if not in the Contact type
  // activities might be optional; include only if your Contact requires it
  // activities: [],
};

describe('ContactCard', () => {
  it('renders key fields', () => {
    render(
      <ContactCard
        contact={contact}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/98765432/i)).toBeInTheDocument();
    expect(screen.getByText(/Doe Inc\./i)).toBeInTheDocument();
    expect(screen.getByText(/FOLLOW_UP/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onDelete when Delete is clicked', () => {
    const onDelete = jest.fn();

    render(
      <ContactCard
        contact={contact}
        onDelete={onDelete}
        onUpdate={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(contact.id);
  });
});
