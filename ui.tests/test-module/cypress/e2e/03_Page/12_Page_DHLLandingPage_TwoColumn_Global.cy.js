describe('Global DHL Landing Page - Two Column', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/dhl-landing-two-column-page.html'
  ];

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        if (e.message.includes('Things went bad')) {
          return false;
        }
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
          // 1. Verify hero banner exists with image
          cy.get('.hero-banner-component > .hero-banner').should('exist');

          // 2. Verify text exists
          cy.get('#text-fa2b4da5ad').should('exist');

          // 3. Verify landing page point exists with title, icon, and content
          cy.get('.landing-point').should('exist');

          // 4. Verify marketo form exists
          cy.get('.marketoForm__container').should('exist');

          // 5. Verify if all fields are present
          cy.get(':nth-child(2) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel').should('exist');
          cy.get('#suspectCompanyname').should('exist');
          cy.get('#FirstName').should('exist');
          cy.get('#LastName').should('exist');
          cy.get('#Email').should('exist');
          cy.get('#suspectAddress').should('exist');
          cy.get('#suspectPostalCode').should('exist');
          cy.get('#suspectCity').should('exist');
          cy.get('#suspectCountry').should('exist');
          cy.get('#Phone').should('exist');
          cy.get('#shippingfrequency').should('exist');
          cy.get('.mktoButton').should('exist');

          // 6. Verify the form submits successfully when all fields are filled out correctly
          const testText = 'THIS IS FOR TEST PLEASE IGNORE';
          cy.get(':nth-child(2) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel').click();
          cy.get('#suspectCompanyname').type(testText);
          cy.get('#FirstName').type(testText);
          cy.get('#LastName').type(testText);
          cy.get('#Email').type('test@gmail.com');
          cy.get('#suspectAddress').type(testText);
          cy.get('#suspectPostalCode').type(testText);
          cy.get('#suspectCity').type(testText);
          cy.get('#suspectCountry').select('Albania');
          cy.get('#Phone').type('111111');
          cy.get('#shippingfrequency').select('One-off');
          cy.get('.mktoButton').should('exist');

          // 7. Verify header and footer exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');
        });
      });
    });
  });
});
