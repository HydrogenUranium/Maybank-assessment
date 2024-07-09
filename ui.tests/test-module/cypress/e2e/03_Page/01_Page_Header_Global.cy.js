describe('Global Page Header', () => {
  const pageUrls = [
    `${Cypress.env('AEM_PUBLISH_URL')}/content/dhl/global/en-global.html`
  ];

  const logoSelector = '.headerV2__logo';
  const searchButtonSelector = '.searchButtonImage__y8c7h';
  const searchInputSelector = '[data-testid="search-bar-input"]';
  const closeSearchSelector = '[data-testid="close-search"] > .searchButtonImage__y8c7h';
  const navigationItemSelector = '.navigation-item';

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        if (e.message.includes('Things went bad')) {
          return false;
        }
      });

      cy.visit(pageUrl);
      cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
    });

    const viewports = ['iphone-6', 'ipad-2', 'macbook-11'];

    viewports.forEach((viewport) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }
        });

        it('Test Case', () => {
          // 1. Verify when the website logo in the header is clicked, it should redirect to the homepage
          cy.get(logoSelector).click({ force: true });

          // 2. Verify search button is clickable and open the search field and can close the search field
          cy.get(searchButtonSelector).should('be.visible').click({ force: true });
          cy.get(searchInputSelector).should('be.visible');

          // 3. Verify search can be closed
          cy.get(closeSearchSelector).click({ force: true });

          if (viewport == 'macbook-11') {
            // 4. Verify that all navigation links (Apply for Business, Contact Us) in the header are present and correctly redirect to their respective pages
            cy.get('.navigation-row__right .button:contains("Apply for a Business Account"):first').should('be.visible').click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/open-an-account`);
            cy.visit(pageUrl);

            cy.get('.navigation-item:contains("Contact us"):first').should('be.visible').click({ force: true });
            cy.wait(2000);
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/ship-with-dhl/contact`);
          }

          if (viewport !== 'macbook-11') {
            // 4. For phone hamburger menu
            cy.get('.headerV2__hamburger').click({ force: true });
            cy.get('.short-banners > .cta-banner-with-points-component > .banner > .banner__body > .banner__body__button').click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/open-an-account`);
            cy.visit(pageUrl);

            cy.get(':nth-child(3) > ul > li > .navigation-item').click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/ship-with-dhl/contact`);
          }

          // 5. Verify all the options in the language switcher dropdown are displayed correctly
          cy.get('.global-icon').click({ force: true });
          cy.get('.header-countryList--open:first').should('be.visible');

          if (viewport == 'macbook-11') {
            // 6. Verify header is keyboard navigable
            cy.get('.navigation-row__left > .navigation-item:not(.navigation-item_more-less)')
              .each(($link) => {
                cy.wrap($link).focus().should('have.focus');
              });
          }
        });
      });
    });
  });
});
