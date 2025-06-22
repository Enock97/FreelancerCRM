import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import ContactForm from '../app/(protected)/contacts/ContactForm'
import { CREATE_CONTACT } from '../app/graphql/mutations'
import '@testing-library/jest-dom'


const mocks = [
  {
    request: {
      query: CREATE_CONTACT,
      variables: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '12345678',
        company: 'TestCorp',
        status: 'NEW',
        note: '',
      },
    },
    result: {
      data: {
        createContact: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '12345678',
          company: 'TestCorp',
          status: 'NEW',
          note: '',
          createdAt: new Date().toISOString(),
        },
      },
    },
  },
]

describe('ContactForm', () => {
  it('submits the form with valid input', async () => {
    const onSubmit = jest.fn()
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactForm onSubmit={onSubmit} onCancel={() => {}} />
      </MockedProvider>
    )

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'TestCorp' } })

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})