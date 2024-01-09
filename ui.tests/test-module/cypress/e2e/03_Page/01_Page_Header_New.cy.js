describe('Header Test', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL')+ '/content/dhl/global/en-global.html';
      const searchButtonSelector = '.searchButtonImage__y8c7h';
      const searchInputSelector = '[data-testid="search-input"]';
      const closeSearchSelector = '[data-testid="close-search"] > .searchButtonImage__y8c7h';

    beforeEach(() => {
        cy.visit(pageUrl);
        cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
    });

    it('redirects to the homepage when logo is clicked', () => {
        cy.get('.headerV2__logo').click({force: true});
        cy.url().should('eq', Cypress.env('AEM_PUBLISH_URL') + '/discover/en-global');
    });

    it('Verify search button is clickable and open the search field', () => {
        cy.get(searchButtonSelector).should('be.visible').click({force: true});
        cy.get(searchInputSelector).should('be.visible');
    });

    it('Verify search can be closed', () => {
        cy.get(searchButtonSelector).should('be.visible').click({force: true});
        cy.get(searchInputSelector).should('be.visible');
        cy.get(closeSearchSelector).click({force: true});
    });
});