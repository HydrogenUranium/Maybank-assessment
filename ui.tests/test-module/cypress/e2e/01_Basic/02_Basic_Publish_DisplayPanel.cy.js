describe('AEM Basic Publish Display Panel', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global.html')
        cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
    })

    it('should be possible to display homepage URL', () => {
        const expectedUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global.html';
        cy.url().should('eq', expectedUrl);
        cy.get('.header__logo').should('exist');
    });
})