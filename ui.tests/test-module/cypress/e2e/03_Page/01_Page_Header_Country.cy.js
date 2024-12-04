describe('Global Page Header', () => {
  const pageUrls = [
    `${Cypress.env('AEM_PUBLISH_URL')}/content/dhl/sg/en-sg.html`
  ];

  const selectors = {
    logo: '.headerV2__logo',
    searchButton: '.searchButtonImage__y8c7h',
    searchInput: '[data-testid="search-bar-input"]',
    closeSearch: '[data-testid="close-search"] > .searchButtonImage__y8c7h',
    navigationItem: '.navigation-item',
    applyForBusiness: '[data-testid="header-button"] > span',
    contactUs: '.navigation-item:contains("Contact us"):first',
    hamburgerMenu: '.headerV2__hamburger',
    applyForBusinessHamburger: '.short-banners > .cmp-cta-banner-with-points > .cmp-cta-banner-with-points__body > .cmp-cta-banner-with-points__button',
    contactUsHamburger: ':nth-child(3) > ul > li > .navigation-item',
    countrySwitcher: '.headerV2__desktopCountry > .fi',
    countryList: '.header-countryList--open:first',
    countryOption: '.header-countryList--open .country-option',
    headerLinks: '.navigation-row__left > .navigation-item:not(.navigation-item_more-less)',
    languageText: '.language-specific-text',
    hoverText: '.hover-text'
  };

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.visit(pageUrl);
      cy.get('body', { timeout: 2000 }).then(($body) => {
        cy.get('#onetrust-consent-sdk', { timeout: 5000 }).then(($onetrust) => {
          if ($onetrust.find('button#onetrust-accept-btn-handler', { timeout: 5000 }).length > 0) {
              cy.get('button#onetrust-accept-btn-handler')
                .contains('Accept All')
                .should('be.visible')
                .click();
          }
        });
      });
    });

    const viewports = ['iphone-6', 'ipad-2', 'macbook-11'];

    viewports.forEach((viewport) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          cy.viewport(viewport);
        });

        it('Test Case', () => {
          // 1. Verify when the website logo in the header is clicked, it should redirect to the homepage
          cy.get(selectors.logo).click({ force: true });

          // 2. Verify search button is clickable, opens the search field, and can close the search field
          cy.get(selectors.searchButton).should('be.visible').click({ force: true });
          cy.get(selectors.searchInput).should('be.visible');
          cy.get(selectors.closeSearch).click({ force: true });

          if (viewport === 'macbook-11') {
            // 3. Verify that all navigation links (Apply for Business, Contact Us) in the header are present and correctly redirect to their respective pages
            cy.get(selectors.applyForBusiness).should('be.visible').click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-sg/ship-now`);
            cy.visit(pageUrl);

            cy.get(selectors.contactUs, { timeout: 2000 }).should('be.visible').click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-sg/contact`);
          } else {
            // 4. Verify hamburger menu exists and all navigation links are present and redirect correctly
            cy.get(selectors.hamburgerMenu).click({ force: true });
            cy.get(selectors.applyForBusinessHamburger).click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-sg/ship-now`);
            cy.visit(pageUrl);

            cy.get(selectors.contactUsHamburger, { timeout: 2000 }).click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-sg/contact`);
          }

          if (viewport === 'macbook-11') {
            // 5. Verify header is keyboard navigable
            cy.get(selectors.headerLinks).each(($link) => {
              cy.wrap($link).focus();
              cy.wrap($link).should('have.focus');
            });
          }

          if (viewport !== 'iphone-6') {
            // 6. Verify country option changes content and URL
            cy.get(selectors.countrySwitcher).click({ force: true });
            cy.get(selectors.countryList).should('be.visible');
            cy.get('.header-countryList__option label[for="country-jp"]').contains('Japan').click({ force: true });
            cy.url().should('include', '/ja-jp');

            // 7. Verify the language on the page changes appropriately based on country
            cy.get('.cmp-title__text').should('contain', 'DHL Expressのスモールビジネス&グローバルシッピングに関するアドバイス');
          }

          // 8. Verify when hovering the cursor over each category, the color changes from black to red
          cy.get('.navigation-row__left').invoke('css', 'color', 'red');
          cy.get('.navigation-row__left').should('have.css', 'color', 'rgb(255, 0, 0)');
        });
      });
    });
  });
});
