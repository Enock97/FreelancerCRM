/// <reference types="jest" />
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '../app/(protected)/contacts/ContactForm';

describe('ContactForm', () => {
  it('submits the form with valid input', async () => {
    const onSubmit = jest.fn();

    render(<ContactForm onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/phone/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByPlaceholderText(/company/i), { target: { value: 'TestCorp' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'NEW' } });
    fireEvent.change(screen.getByPlaceholderText(/note/i), { target: { value: 'Some note' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
