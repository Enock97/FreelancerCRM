import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from '../app/(protected)/contacts/ContactForm';

describe('ContactForm validation', () => {
  it('prevents submit with empty required fields', () => {
    const onSubmit = jest.fn();

    render(<ContactForm onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
