describe('Global and Country Error Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--Error.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/Page--Error.html'
  ];

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        if (e.message.includes('Things went bad')) {
          return false;
        }
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.wait(2000);
      cy.get('body').then(($body) => {
        if ($body.find('button#onetrust-accept-btn-handler:contains("Accept All")').length > 0) {
          cy.get('button#onetrust-accept-btn-handler').contains('Accept All').click();
        }
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
          cy.get('.title').should('exist');

          // 2. Verify image exists without being broken
          cy.get('.image').should('be.visible').and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });

          // 3. Verify button link is visible and when clicked, it redirects to the homepage
          cy.get('.error-banner-component > .button').should('exist');
          cy.get('.error-banner-component > .button').click();
          cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global`);

          // 4. Verify header and footer exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');
        });
      });
    });
  });
});
