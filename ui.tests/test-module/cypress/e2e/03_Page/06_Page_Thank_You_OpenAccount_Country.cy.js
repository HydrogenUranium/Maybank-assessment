describe('Singapore Thank You Page Open An Account', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/open-an-account/thanks.html'
  ];

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
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

        it('Test case', () => {
          // 1. Verify that the "Thank You" page loads successfully without any errors
          cy.get('.cmp-breadcrumb__item--active > span').should('contain', 'Thank you');

          // 2. Verify that the page title is correct with bold and matches the expected title
          cy.get('h2>b').should('contain', 'Thank You for requesting a DHL EXPRESS BUSINESS ACCOUNT.')
            .and(($h2) => {
              expect($h2).to.have.css('font-weight', '700'); // find the bold
            });

          // 3. Verify text consist with some text
          cy.get('p').should('exist');

          // 4. Verify header and footer are exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');

          // 5. Verify follow us section is exist
          cy.get('.followUs').should('exist');

          // 6. Verify all the social media icon is clickable (Facebook, Youtube, Instagram, LinkedIn, Twitter)
          cy.get('.followUs__items > [href="https://www.facebook.com/DHLSG/"]').should('have.attr', 'href');
          cy.get('.followUs__items > [href="https://www.youtube.com/@DHLExpressSG"]', { timeout: 2000 }).should('have.attr', 'href');
          cy.get('.followUs__items > [href="https://www.instagram.com/discoverbydhl/"]', { timeout: 2000 }).should('have.attr', 'href');
          cy.get('.followUs__items > [href="https://www.linkedin.com/company/dhl-express-singapore/"]', { timeout: 2000 }).should('have.attr', 'href');
          cy.get('.followUs__items > [href="https://twitter.com/DHLexpress"]', { timeout: 2000 }).should('have.attr', 'href');
        });
      });
    });
  });
});
