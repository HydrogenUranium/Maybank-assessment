
describe('AEM Basic Publish Display Panel', () => {

    beforeEach(() => {
        // End any existing user session
        cy.AEMForceLogout()
        // Start new one
        cy.visit(Cypress.env('AEM_PUBLISH_URL'))
        cy.AEMLogin(Cypress.env('AEM_PUBLISH_USERNAME'), Cypress.env('AEM_PUBLISH_PASSWORD'))
    })

    it('should be possible to display homepage URL', () => {
     const expectedUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global.html';
        cy.visit(expectedUrl);
        cy.url().should('eq', expectedUrl);
        cy.get('.headerV2__logo').should('exist');
    });
})