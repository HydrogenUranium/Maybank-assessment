describe('Global Subscribe newsletter page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-NewsletterSignUp.html'
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
          // 1. Verify the marketo is exist"
          cy.get('.marketoForm__container')
            .should("not.be.empty")
            .should("be.visible");

          // 2. Verify if all fields are present
          cy.get('.columns-section__right-column__header-section > .aem-Grid > .title-v2 > .title-component > #title-v2-b4a322772c > .cmp-title__text', { timeout: 2000 }).should('exist');
          cy.get('#Email').should('exist');
          cy.get('#suspectCountry').should('exist');
          cy.get('.mktoButton').should('exist');

          // 3. Verify the form submits successfully when all fields are filled out correctly and verify console lg
//          cy.intercept('POST', '**/newsletter-sign-up.form.html').as('formSubmission');
          cy.get('#Email').should('be.visible').type('test@gmail.com', { force: true });
          cy.get('#suspectCountry').should('be.visible').select('Afghanistan', { force: true });
          cy.get('.mktoButton').should('exist');
//          cy.get('.mktoButton').should('be.visible').click({ force: true });
//          cy.wait('@formSubmission', { timeout: 10000 }).its('response.statusCode').should('eq', 202);
//          cy.window().then((win) => {
//              cy.stub(win.console, 'log').as('consoleLog');
//          });
//          cy.get('@consoleLog').should('have.been.calledWith', 'Second submission was a success');

           //Clear the form


          // 4. Verify that an error message "This field is required" is displayed when a required field is left blank
           cy.get('#suspectCountry').select('', { force: true });
          cy.get('#Email').clear({ force: true });
          cy.get('.mktoButton').click({ force: true });
          cy.get('#ValidMsgEmail').should('be.visible');

          // 5. Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @)
          cy.get('#Email').clear({ force: true });
          cy.get('#Email').type('test', { force: true });
          cy.get('.mktoButton').click({ force: true });
          cy.get('#ValidMsgEmail').should('be.visible');

        });
      });
    });
  });
});
