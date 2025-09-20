/// <reference types="jest" />
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import type { Contact } from '../types/types';

const mockContacts: Contact[] = [
  {
    id: 1,
    name: 'A',
    email: 'a@ex.com',
    phone: '123',
    company: 'Acme',
    status: 'NEW',
    order: 0,
    note: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'B',
    email: 'b@ex.com',
    phone: '456',
    company: 'Bravo',
    status: 'FOLLOW_UP',
    order: 0,
    note: '',
    createdAt: new Date().toISOString(),
  },
];

describe('KanbanBoard', () => {
  it('renders columns with correct titles', () => {
    render(
      <KanbanBoard
        contacts={mockContacts}
        onEdit={() => {}}
        onDelete={() => {}}
        // add the required props that your component expects
        reorderContacts={jest.fn()}
        refetch={jest.fn()}
      />
    );

    expect(screen.getByText(/^New$/i,        { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/^Follow Up$/i,  { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/^Customer$/i,   { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/^Archived$/i,   { selector: 'span' })).toBeInTheDocument();
  });
});
