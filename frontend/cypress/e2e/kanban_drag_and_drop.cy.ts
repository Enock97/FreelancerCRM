describe('Kanban Drag and Drop', () => {
  it('drags a card from NEW to COMPLETED', () => {
    cy.visit('http://localhost:3000/dashboard')

    // Ensure card in NEW column
    cy.get('[data-status="NEW"]').find('.draggable-card').first().as('card')
    cy.get('[data-status="ARCHIVED"]').as('targetColumn')

    cy.get('@card')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('dragstart', { force: true })

    cy.get('@targetColumn')
      .trigger('dragenter', { force: true })
      .trigger('dragover', { force: true })
      .trigger('drop', { force: true })

    cy.get('@card').trigger('dragend', { force: true })

    cy.get('[data-status="ARCHIVED"]').should('contain.text', 'Test A')
  })
})
