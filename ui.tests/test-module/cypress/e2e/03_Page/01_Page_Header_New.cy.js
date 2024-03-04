describe('Page Header', () => {
  const pageUrl = `${Cypress.env('AEM_PUBLISH_URL')}/content/dhl/global/en-global.html`;
  const logoSelector = '.headerV2__logo';
  const searchButtonSelector = '.searchButtonImage__y8c7h';
  const searchInputSelector = '[data-testid="search-bar-input"]';
  const closeSearchSelector = '[data-testid="close-search"] > .searchButtonImage__y8c7h';
  const navigationItemSelector = '.navigation-item';

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('1.Verify when the website logo in the header is clicked, it should redirect to the homepage', () => {
    cy.get(logoSelector).click({force: true});
  });

  it('2.Verify search button is clickable and open the search field', () => {
    cy.get(searchButtonSelector).should('be.visible').click({force: true});
    cy.get(searchInputSelector).should('be.visible');
  });

  it('3.Verify search can be closed', () => {
    cy.get(searchButtonSelector).should('be.visible').click({force: true});
    cy.get(searchInputSelector).should('be.visible');
    cy.get(closeSearchSelector).click({force: true});
  });

  it('4.Verify that all navigation links (Apply for Business, Contact Us) in the header are present and correctly redirect to their respective pages', () => {
    cy.viewport('macbook-11')
    cy.get('.navigation-row__right .button:contains("Apply for a Business Account"):first').should('be.visible').click({force: true});
    cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/open-an-account`);
    cy.visit(pageUrl);

    cy.get('.navigation-item:contains("Contact us"):first').should('be.visible').click({force: true});
    cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/ship-with-dhl/contact`);
  });

  it('5.Verify all the options in the language switcher dropdown are displayed correctly', () => {
    cy.viewport('macbook-11');
    cy.get('.global-icon').click({force: true});
    cy.get('.header-countryList--open:first').should('be.visible');
  });

  it('6.Verify header is keyboard navigable', () => {
    cy.viewport('macbook-11');
    cy.get('.navigation-row__left > .navigation-item:not(.navigation-item_more-less)')
      .each(($link) => {
        cy.wrap($link).focus().should('have.focus');
      });
  });

});
