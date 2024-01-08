describe('Login Publish AEM', () => {
    it('should redirect to login page by default', () => {
        cy.visit(Cypress.env('AEM_PUBLISH_URL'))

        cy.url().should('match', /login.html/)
    });

    it('should contain the login form', () => {
        cy.visit(Cypress.env('AEM_PUBLISH_URL'))

        cy.get('#username').should('exist')
        cy.get('#password').should('exist')
        cy.get('form [type="submit"]').should('exist')
    });

    it('should login with correct credentials', () => {
        cy.visit(Cypress.env('AEM_PUBLISH_URL'))

        cy.AEMLogin(Cypress.env('AEM_PUBLISH_USERNAME'), Cypress.env('AEM_PUBLISH_PASSWORD'))

        cy.get('coral-shell', { timeout: 6000 }).should('exist')
        cy.get('coral-shell-header', { timeout: 6000 }).should('exist')
    });
})