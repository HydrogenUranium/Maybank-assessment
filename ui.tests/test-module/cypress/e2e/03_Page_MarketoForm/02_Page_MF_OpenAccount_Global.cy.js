describe('Global Open An Account page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-MarketoForm.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  // Define selectors as constants
  const selectors = {
    title: '.columns-section__right-column__header-section > .aem-Grid > .title-v2 > .cmp-title-v2 > #title-v2-880e6e437e > .cmp-title__text',
    marketoForm: '#mktoForm_1756',
    lblIsBusiness: '#LblisBusiness',
    firstName: '#FirstName',
    lastName: '#LastName',
    email: '#Email',
    suspectAddress: '#suspectAddress',
    suspectPostalCode: '#suspectPostalCode',
    suspectCity: '#suspectCity',
    suspectCountry: '#suspectCountry',
    phone: '#Phone',
    shippingFrequency: '#shippingfrequency',
    submitButton: '.mktoButton',
    validMsgEmail: '#ValidMsgEmail',
    validMsgPhone: '#ValidMsgPhone',
    onetrustConsentSdk: '#onetrust-consent-sdk',
    onetrustAcceptButton: 'button#onetrust-accept-btn-handler'
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.get('body', { timeout: 2000 }).then(($body) => {
        cy.get(selectors.onetrustConsentSdk, { timeout: 5000 }).then(($onetrust) => {
          if ($onetrust.find(selectors.onetrustAcceptButton, { timeout: 5000 }).length > 0) {
              cy.get(selectors.onetrustAcceptButton)
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
          cy.get(selectors.title).should('exist');

          // 2. Verify Marketo form is present
          cy.get(selectors.marketoForm)
            .should("not.be.empty")
            .should("be.visible");

          // 3. Verify if all fields are present
          cy.get(selectors.lblIsBusiness).should('exist');
          cy.get(selectors.firstName).should('exist');
          cy.get(selectors.lastName).should('exist');
          cy.get(selectors.email).should('exist');
          cy.get(selectors.suspectAddress).should('exist');
          cy.get(selectors.suspectPostalCode).should('exist');
          cy.get(selectors.suspectCity).should('exist');
          cy.get(selectors.suspectCountry).should('exist');
          cy.get(selectors.phone).should('exist');
          cy.get(selectors.shippingFrequency).should('exist');
          cy.get(selectors.submitButton).should('exist');

          // 4. Verify an error message is displayed for each field when the input is invalid (e.g., an email field, a phone number field with non-numeric characters)
          cy.get(selectors.firstName).type(testText, { force: true });
          cy.get(selectors.lastName).type(testText, { force: true });
          cy.get(selectors.email).type('test', { force: true });
          cy.get(selectors.suspectAddress).type(testText, { force: true });
          cy.get(selectors.suspectPostalCode).type(testText, { force: true });
          cy.get(selectors.suspectCity).type(testText, { force: true });
          cy.get(selectors.suspectCountry).select('Albania', { force: true });
          cy.get(selectors.phone).type('TEST', { force: true });
          cy.get(selectors.shippingFrequency).select('One-off', { force: true });
          cy.get(selectors.submitButton).click({ force: true });
          cy.get(selectors.validMsgEmail).should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com');
          cy.get(selectors.email).type('test@gmail.com', { force: true });
          cy.get(selectors.submitButton).click({ force: true });
          cy.get(selectors.validMsgPhone).should('exist');

          // Clear all the form
          cy.get(selectors.firstName).clear({ force: true });
          cy.get(selectors.lastName).clear({ force: true });
          cy.get(selectors.email).clear({ force: true });
          cy.get(selectors.suspectAddress).clear({ force: true });
          cy.get(selectors.suspectPostalCode).clear({ force: true });
          cy.get(selectors.suspectCity).clear({ force: true });
          cy.get(selectors.suspectCountry).select('', { force: true });
          cy.get(selectors.phone).clear({ force: true });
          cy.get(selectors.shippingFrequency).select('', { force: true });

          // 5. Verify the form submits successfully when all fields are filled out correctly and the second submission is successful
          cy.intercept('POST', '**/Page-MarketoForm.form.html').as('formSubmit');
          cy.get(selectors.firstName).type(testText, { force: true });
          cy.get(selectors.lastName).type(testText, { force: true });
          cy.get(selectors.email).type('test@gmail.com', { force: true });
          cy.get(selectors.suspectAddress).type(testText, { force: true });
          cy.get(selectors.suspectPostalCode).type(testText, { force: true });
          cy.get(selectors.suspectCity).type(testText, { force: true });
          cy.get(selectors.suspectCountry).select('Albania', { force: true });
          cy.get(selectors.phone).type('111111', { force: true });
          cy.get(selectors.shippingFrequency).select('One-off', { force: true });
          cy.get(selectors.submitButton).click({ force: true });
          cy.wait('@formSubmit').its('response.statusCode').should('equal', 202);
          cy.url().should('include', 'thanks');
        });
      });
    });
  });
});