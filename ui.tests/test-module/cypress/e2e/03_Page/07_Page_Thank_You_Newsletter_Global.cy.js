describe('Global Thank You Page Newsletter', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/newsletter-sign-up/newsletter-thanks.html'
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

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }

          cy.log(`Running tests for viewport at index ${vIndex}: ${viewport}`);
        });

        it('All test case', function () {
          // 1. Verify that the "Thank You" page loads successfully without any errors
          cy.get('.cmp-breadcrumb__item--active > span').should('contain', 'Thank you');

          // 2. Verify that the page title is correct with bold and matches the expected title
          cy.get('h2 b', { timeout: 10000 })
            .should('contain', 'Thank you - just one more step!')
            .and(($h2) => {
              expect($h2).to.have.css('font-weight', '700'); // check for bold text
            });

          // 3. Verify text consist with some text
          cy.get('p').should('exist');

          // 4. Verify header and footer are exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');

          // 5. Verify Recommended section is exist and contain maximum 4 articles
          cy.get('.article-items').should('exist')
            .find('.article-items').should('have.length.at.most', 4);
        });
      });
    });
  });
});
