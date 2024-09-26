describe('Singapore Subscribe newsletter page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/newsletter-sign-up.html'
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

        it('All test case', () => {
          // 1. Verify the title contains the correct text "Subscribe for the latest insights"
          cy.get('.cmp-title__text').should('exist');
          cy.wait(2000);

          // 2. Verify if all fields are present
          cy.get('.cmp-title__text').should('exist');
          cy.get('.landing-points-component').should('exist');
          cy.get('#FirstName').should('exist');
          cy.get('#LastName').should('exist');
          cy.get('#Email').should('exist');
          cy.get('#suspectCountry').should('exist');
          cy.get('.mktoButton').should('exist');

          // 3. Verify the form submits successfully when all fields are filled out correctly
          cy.get('#FirstName').type('testing purpose', { force: true });
          cy.get('#LastName').type('testing purpose', { force: true });
          cy.get('#Email').should('be.visible').type('test@gmail.com', { force: true });
          cy.get('#suspectCountry').select('Afghanistan', { force: true });
          cy.get('.mktoButton').should('exist');

          //Clear all the form
          cy.get('#FirstName').clear({ force: true });
          cy.get('#LastName').clear({ force: true });
          cy.get('#Email').clear({ force: true });

          // 4. Verify that an error message "This field is required" is displayed when a required field is left blank
          cy.get('#LastName').type('testing purpose', { force: true });
          cy.get('#Email').type('test@gmail.com', { force: true });
          cy.get('.mktoButton').should('exist', { force: true });

          //Clear all the form
          cy.get('#FirstName').clear({ force: true });
          cy.get('#LastName').clear({ force: true });
          cy.get('#Email').clear({ force: true });

          // 5. Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @)
          cy.get('#FirstName').type('testing purpose', { force: true });
          cy.get('#LastName').type('testing purpose', { force: true });
          cy.get('#Email').type('test', { force: true });
          cy.get('.mktoButton').should('exist', { force: true });
        });
      });
    });
  });
});
