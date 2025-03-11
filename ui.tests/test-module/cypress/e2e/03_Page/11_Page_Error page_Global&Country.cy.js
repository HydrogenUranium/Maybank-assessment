describe('Global and Country Error Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--Error.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/Page--Error.html'
  ];

  // Define selectors as constants
  const selectors = {
    onetrustConsentSdk: '#onetrust-consent-sdk',
    onetrustAcceptButton: 'button#onetrust-accept-btn-handler',
    title: '.title',
    image: '.cmp-error-banner__image',
    errorButton: '.cmp-error-banner__button',
    header: '.header-wrapper',
    footer: '.footer-container',
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.get('body', { timeout: 2000 }).then(($body) => {
        cy.get(selectors.onetrustConsentSdk, { timeout: 5000 }).then(($onetrust) => {
          if ($onetrust.find(selectors.onetrustAcceptButton, { timeout: 5000 }).length > 0) {
              cy.get(selectors.onetrustAcceptButton)
                .contains('Accept All')
                .should('be.visible')
                .click();
          }
        });
      });
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }
        });

        it('All test case', function () {
          // 1. Verify the error page consists of title
          cy.get(selectors.title).should('exist');

          // 2. Verify image exists without being broken
          cy.get(selectors.image).should('be.visible').and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });

          // 3. Verify button link is visible and when clicked, it redirects to the homepage
          cy.get(selectors.errorButton).should('exist');
          cy.get(selectors.errorButton).click();
          cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global`);

          // 4. Verify header and footer exist
          cy.get(selectors.header).should('exist');
          cy.get(selectors.footer).should('exist');
        });
      });
    });
  });
});