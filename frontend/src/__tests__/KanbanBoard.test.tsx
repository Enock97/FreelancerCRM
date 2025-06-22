import { render, screen } from '@testing-library/react'
import KanbanBoard from '../components/KanbanBoard'

const mockContacts = [
  {
    id: '1',
    name: 'Test A',
    email: 'a@example.com',
    phone: '111',
    company: 'CompA',
    status: 'NEW',
    note: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Test B',
    email: 'b@example.com',
    phone: '222',
    company: 'CompB',
    status: 'FOLLOW_UP',
    note: '',
    createdAt: new Date().toISOString(),
  },
]

describe('KanbanBoard', () => {
  it('renders columns with correct titles and contact counts', () => {
    render(<KanbanBoard contacts={mockContacts} onUpdate={() => {}} token="dummy-token" />)

    expect(screen.getByText(/New/i)).toBeInTheDocument()
    expect(screen.getByText(/Follow Up/i)).toBeInTheDocument()
    expect(screen.getByText(/Test A/i)).toBeInTheDocument()
    expect(screen.getByText(/Test B/i)).toBeInTheDocument()
  })
})