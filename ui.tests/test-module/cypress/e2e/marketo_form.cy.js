describe('Marketo Forms', () => {
    const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/open-an-account.html';
    it('Marketo Form on the Open an account page', () => {

        cy.visit(pageUrl)
        cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
        cy.get(".marketoForm")
            .should("not.be.empty")
            .should("be.visible");
    });
})
