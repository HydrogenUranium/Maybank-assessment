describe('DHL Landing Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--DHL-Landing-Page.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/Page--DHL-Landing-Page.html'
  ];

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.visit(pageUrl);
      cy.get('#onetrust-consent-sdk', { timeout: 2000 }).then(($body) => {
        if ($body.find('button#onetrust-accept-btn-handler:contains("Accept All")').length > 0) {
          cy.get('button#onetrust-accept-btn-handler')
            .contains('Accept All')
            .should('be.visible')
            .click();
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

          // 2. Verify text exists
          cy.get('.title-v2').should('exist');

          // 3. Verify download asset exists and when clicked, it redirects to the correct page
          cy.get('body').then(($body) => {
            if ($body.find(':nth-child(5) > .download > .cq-dd-file').length) {
              cy.get(':nth-child(5) > .download > .cq-dd-file').should('exist');
              cy.get(':nth-child(5) > .download > .cq-dd-file').click();
            } else {
              cy.get(':nth-child(5).button > .cmp-button').should('exist');
              cy.get(':nth-child(5).button > .cmp-button').click({force: true});
            }
          });
          cy.url().should('match', new RegExp(`${Cypress.env('AEM_PUBLISH_URL')}/discover/(en-global|en-sg)/open-an-account`));

          // 4. Verify header and footer exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');
        });
      });
    });
  });
});
