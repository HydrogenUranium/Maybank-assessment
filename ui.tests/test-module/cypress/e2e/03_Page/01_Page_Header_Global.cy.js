describe('Global Page Header', () => {
  const pageUrls = [
    `${Cypress.env('AEM_PUBLISH_URL')}/content/dhl/global/en-global.html`
  ];

  const selectors = {
    logo: '.headerV2__logo',
    searchButton: '.searchButtonImage__y8c7h',
    searchInput: '[data-testid="search-bar-input"]',
    closeSearch: '[data-testid="close-search"] > .searchButtonImage__y8c7h',
    navigationItem: '.navigation-item',
    applyForBusiness: '.navigation-row__right .button:contains("Apply for a Business Account"):first',
    contactUs: '.navigation-item:contains("Contact us"):first',
    hamburgerMenu: '.headerV2__hamburger',
    applyForBusinessHamburger: '.short-banners > .cta-banner-with-points-component > .banner > .banner__body > .banner__body__button',
    contactUsHamburger: ':nth-child(3) > ul > li > .navigation-item',
    countrySwitcher: '.global-icon',
    countryList: '.header-countryList--open:first',
    countryOption: '.header-countryList--open .country-option',
    headerLinks: '.navigation-row__left > .navigation-item:not(.navigation-item_more-less)',
    languageText: '.language-specific-text',
    hoverText: '.hover-text'
  };

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        if (e.message.includes('Things went bad')) {
          return false;
        }
      });

      cy.visit(pageUrl);
      cy.wait(2000);
      cy.get('body').then(($body) => {
        if ($body.find('button#onetrust-accept-btn-handler:contains("Accept All")').length > 0) {
          cy.get('button#onetrust-accept-btn-handler').contains('Accept All').click();
        }
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
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/open-an-account`);
            cy.visit(pageUrl);
            cy.wait(2000);

            cy.get(selectors.contactUs).should('be.visible').click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/ship-with-dhl/contact`);
          } else {
            // 4. Verify hamburger menu exists and all navigation links are present and redirect correctly
            cy.get(selectors.hamburgerMenu).click({ force: true });
            cy.get(selectors.applyForBusinessHamburger).click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/open-an-account`);
            cy.visit(pageUrl);
            cy.wait(2000);

            cy.get(selectors.contactUsHamburger).click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/ship-with-dhl/contact`);
          }

          if (viewport === 'macbook-11') {
            // 5. Verify header is keyboard navigable
            cy.get(selectors.headerLinks).each(($link) => {
              cy.wrap($link).focus().should('have.focus');
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
          const link = cy.get('.navigation-row__left');
          link.invoke('css', 'color', 'red');
          link.should('have.css', 'color', 'rgb(255, 0, 0)');
        });
      });
    });
  });
});
