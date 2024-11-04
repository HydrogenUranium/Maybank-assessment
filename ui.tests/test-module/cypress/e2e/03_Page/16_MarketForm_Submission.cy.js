describe('Global Subscribe Newsletter Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-NewsletterSignUp.html'
  ];

  // Define viewports to test
  const viewports = [[1024, 768]];

  pageUrls.forEach((pageUrl, index) => {
    viewports.forEach((viewport, vIndex) => {
      context(`Testing ${pageUrl} on viewport ${viewport}`, () => {
        beforeEach(() => {
          // Handle uncaught exceptions
          cy.on('uncaught:exception', (e) => {
            if (e.message.includes('Things went bad')) {
              return false;
            }
          });

          // Set the viewport
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }

          // Log the URL and viewport
          cy.log(`Running tests for URL at index ${index}: ${pageUrl} on viewport ${viewport}`);

          // Visit the page and handle the cookie consent banner
          cy.visit(pageUrl);
          cy.get('button#onetrust-accept-btn-handler:contains("Accept All")', { timeout: 5000 })
            .then(($btn) => {
              if ($btn.length) {
                // Use a separate command to click the button
                cy.get('button#onetrust-accept-btn-handler', { timeout: 2000 }).contains('Accept All').click();
              }
            });
        });

        it('should verify the presence of the Marketo form and successful form submission', () => {
          // 1. Verify the Marketo form container is present and visible
          cy.get('.marketoForm__container')
            .should('exist')
            .and('be.visible');

          // 2. Intercept the form submission request
          cy.intercept('POST', '**/Page-NewsletterSignUp.form.html').as('formSubmit');

          // 3. Fill out and submit the form
          cy.get('#Email').should('be.visible').type('test@gmail.com', { force: true });
          cy.get('#suspectCountry').should('be.visible').select('Afghanistan', { force: true });
          cy.get('form#mktoForm_1759').submit();

          // 4. Assert that form submission succeeded and URL redirected correctly
          cy.wait('@formSubmit').its('response.statusCode').should('equal', 202);
          cy.url().should('include', 'thankyou.html');
        });

        it('should display required field error messages if fields are left blank', () => {
          // Clear fields and attempt to submit the form
          cy.get('#Email').clear({ force: true });
          cy.get('#suspectCountry').select('', { force: true });
          cy.get('.mktoButton').click({ force: true });

          // Check for error messages
          cy.get('#ValidMsgEmail').should('be.visible').and('contain', 'Must be valid email. example@yourdomain.com');
        });

        it('should display an error message for invalid email format', () => {
          // Enter an invalid email and attempt to submit
          cy.get('#Email').clear({ force: true });
          cy.get('#Email').type('invalidEmail', { force: true });
          cy.get('.mktoButton').click({ force: true });

          // Assert that an invalid email error message is displayed
          cy.get('#ValidMsgEmail').should('be.visible').and('contain', 'Must be valid email');
        });
      });
    });
  });
});
