import { render, screen, fireEvent } from '@testing-library/react'
import ContactCard from '../components/ContactCard'
import { Contact } from '../types/types'
import '@testing-library/jest-dom'


const contact: Contact = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '98765432',
  company: 'Doe Inc.',
  status: 'FOLLOW_UP',
  order: 0,
  note: 'Important client',
  createdAt: new Date().toISOString(),
}

describe('ContactCard', () => {
  it('renders contact info correctly', () => {
    render(
      <ContactCard
        contact={contact}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    )

    expect(screen.getByText(/jane doe/i)).toBeInTheDocument()
    expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument()
    expect(screen.getByText(/98765432/i)).toBeInTheDocument()
    expect(screen.getByText(/doe inc./i)).toBeInTheDocument()
  })

  it('fires delete and update actions', () => {
    const onDelete = jest.fn()
    const onUpdate = jest.fn()

    render(
      <ContactCard
        contact={contact}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onUpdate).not.toHaveBeenCalled() // UI toggle only

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(contact.id)
  })
})