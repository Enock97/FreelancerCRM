/// <reference types="jest" />
import '@testing-library/jest-dom';

// Ensure Apollo link has concat for this suite
jest.mock('@apollo/client/link/context', () => ({
  setContext: () => ({ concat: (next: unknown) => next }),
}));
jest.mock('@apollo/client/link/http', () => ({
  HttpLink: function HttpLinkMock() { return {}; },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../app/login/page';

describe('Login page', () => {
  it('logs in and enables the button after completion', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Inputs use placeholders, not <label> elements
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secret' } });

    // Button text is "Sign in"
    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);

    await waitFor(() => expect(button).toBeEnabled());
  });
});
