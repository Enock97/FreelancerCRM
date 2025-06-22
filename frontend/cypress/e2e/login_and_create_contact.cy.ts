describe('Login and Create Contact Flow', () => {
  it('logs in and creates a new contact', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('input[name="email"]').type('user@example.com')
    cy.get('input[name="password"]').type('securepassword')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')

    cy.visit('http://localhost:3000/contacts')
    cy.get('button').contains(/new contact/i).click()

    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@user.com')
    cy.get('input[name="phone"]').type('12345678')
    cy.get('input[name="company"]').type('TestCompany')

    cy.get('button[type="submit"]').click()

    cy.contains('Test User').should('exist')
  })
})
