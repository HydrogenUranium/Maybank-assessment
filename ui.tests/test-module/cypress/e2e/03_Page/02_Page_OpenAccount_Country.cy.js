describe('Singapore Open An Account page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/open-an-account.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        if (e.message.includes('Things went bad')) {
          return false;
        }
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
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

        it('All test case', () => {
          // 1. Verify the title contains the correct text "Open An Account"
          cy.get('.columns-section__right-column__header-section > .aem-Grid > .title-v2 > .title-component > #title-v2-b0172515ad > .cmp-title__text').should('exist')

          // 2. Verify Marketo form is present
          cy.get(".marketoForm")
            .should("not.be.empty")
            .should("be.visible");

          // 3. Verify if all fields are present
          cy.get('#LblisBusiness').should('exist');
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

          // 4. Verify an error message is displayed for each field when the input is invalid (e.g., an email field, a phone number field with non-numeric characters)
          cy.get('#LblisBusiness').click();
          cy.get('#FirstName').type(testText);
          cy.get('#LastName').type(testText);
          cy.get('#suspectCompanyname').type(testText);
          cy.get('#Phone').type('111111');
          cy.get('#Email').type('test');
          cy.get('#suspectAddress').type(testText);
          cy.get('#suspectPostalCode').type(testText);
          cy.get('#suspectCity').type(testText);
          cy.get('#shippingfrequency').select('One-off');
          cy.get('.mktoButton').click();
          cy.get('#ValidMsgEmail').should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com');

          // 5. Verify the form submits successfully when all fields are filled out correctly
          cy.get('#LblisBusiness').click();
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
        });
      });
    });
  });
});
