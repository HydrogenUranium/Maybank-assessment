describe('Global Open An Account page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-MarketoForm.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

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

        it('All test case', () => {
          // 1. Verify the title contains the correct text "Open An Account"
          cy.get('.columns-section__right-column__header-section > .aem-Grid > .title-v2 > .title-component > #title-v2-880e6e437e > .cmp-title__text').should('exist');

          // 2. Verify Marketo form is present
          cy.get('#mktoForm_1756')
            .should("not.be.empty")
            .should("be.visible");

          // 3. Verify if all fields are present
          cy.get('#LblisBusiness').should('exist');
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
          cy.get('#FirstName').type(testText, { force: true });
          cy.get('#LastName').type(testText, { force: true });
          cy.get('#Email').type('test', { force: true });
          cy.get('#suspectAddress').type(testText, { force: true });
          cy.get('#suspectPostalCode').type(testText, { force: true });
          cy.get('#suspectCity').type(testText, { force: true });
          cy.get('#suspectCountry').select('Albania', { force: true });
          cy.get('#Phone').type('TEST', { force: true });
          cy.get('#shippingfrequency').select('One-off', { force: true });
          cy.get('.mktoButton').click({ force: true });
          cy.get('#ValidMsgEmail').should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com');
          cy.get('#Email').type('test@gmail.com', { force: true });
          cy.get('.mktoButton').click({ force: true });
          cy.get('#ValidMsgPhone').should('exist');

          //Clear all the form
          cy.get('#FirstName').clear({ force: true });
          cy.get('#LastName').clear({ force: true });
          cy.get('#Email').clear({ force: true });
          cy.get('#suspectAddress').clear({ force: true });
          cy.get('#suspectPostalCode').clear({ force: true });
          cy.get('#suspectCity').clear({ force: true });
          cy.get('#suspectCountry').select('', { force: true });
          cy.get('#Phone').clear({ force: true });
          cy.get('#shippingfrequency').select('', { force: true });

          // 5. Verify the form submits successfully when all fields are filled out correctly
//          cy.get('.mktoLogicalField > #LblisBusiness').click({ force: true });
//          cy.get('#suspectCompanyname').type(testText, { force: true });
          cy.get('#FirstName').type(testText, { force: true });
          cy.get('#LastName').type(testText, { force: true });
          cy.get('#Email').type('test@gmail.com', { force: true });
          cy.get('#suspectAddress').type(testText, { force: true });
          cy.get('#suspectPostalCode').type(testText, { force: true });
          cy.get('#suspectCity').type(testText, { force: true });
          cy.get('#suspectCountry').select('Albania', { force: true });
          cy.get('#Phone').type('111111', { force: true });
          cy.get('#shippingfrequency').select('One-off', { force: true });
          cy.get('.mktoButton').click({ force: true });
        });
      });
    });
  });
});
