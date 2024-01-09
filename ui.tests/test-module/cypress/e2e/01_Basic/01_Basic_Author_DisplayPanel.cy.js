describe('AEM Basic', () => {

    beforeEach(() => {
        // End any existing user session
        cy.AEMForceLogout()
        // Start new one
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))
        cy.AEMLogin(Cypress.env('AEM_AUTHOR_USERNAME'), Cypress.env('AEM_AUTHOR_PASSWORD'))
    })

    it('should be possible to display Solutions panel', () => {
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))

        cy.get('[data-foundation-toggleable-control-src$="solutionswitcher.html"]').click()
        cy.get('coral-shell-menu[aria-label$="solutions"]').should('exist')
    });
})
