import { marketo } from "../../support/selectors";

describe('Singapore Open An Account page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/open-an-account.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  // Define selectors as constants
  const selectors = {
    title: '.right-header-section .cmp-title-v2__text',
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.acceptCookies();
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          cy.handleViewport(viewport, vIndex);
        });

        it('All test case', () => {
          // 1. Verify the title contains the correct text "Open An Account"
          cy.exist(selectors.title);

          // 2. Verify Marketo form is present
          cy.get(marketo.form)
            .should("not.be.empty")
            .should("be.visible");

          // 3. Verify if all fields are present
          cy.exist(marketo.lblIsBusiness);
          cy.exist(marketo.suspectCompanyname);
          cy.exist(marketo.firstName);
          cy.exist(marketo.lastName);
          cy.exist(marketo.email);
          cy.exist(marketo.suspectAddress);
          cy.exist(marketo.suspectPostalCode);
          cy.exist(marketo.suspectCity);
          cy.exist(marketo.suspectCountry);
          cy.exist(marketo.phone);
          cy.exist(marketo.shippingFrequency);
          cy.exist(marketo.submit);

          // 4. Verify an error message is displayed for each field when the input is invalid (e.g., an email field, a phone number field with non-numeric characters)
          cy.get(marketo.lblIsBusiness).click({ force: true });
          cy.get(marketo.firstName).type(testText, { force: true });
          cy.get(marketo.lastName).type(testText, { force: true });
          cy.get(marketo.suspectCompanyname).type(testText, { force: true });
          cy.get(marketo.phone).type('111111', { force: true });
          cy.get(marketo.email).type('test', { force: true });
          cy.get(marketo.suspectAddress).type(testText, { force: true });
          cy.get(marketo.suspectPostalCode).type(testText, { force: true });
          cy.get(marketo.suspectCity).type(testText, { force: true });
          cy.get(marketo.shippingFrequency).select('One-off', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.get(marketo.emailErrorMessage).should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com');

          // Clear all the form
          cy.get(marketo.firstName).clear({ force: true });
          cy.get(marketo.lastName).clear({ force: true });
          cy.get(marketo.suspectCompanyname).clear({ force: true });
          cy.get(marketo.phone).clear({ force: true });
          cy.get(marketo.email).clear({ force: true });
          cy.get(marketo.suspectAddress).clear({ force: true });
          cy.get(marketo.suspectPostalCode).clear({ force: true });
          cy.get(marketo.suspectCity).clear({ force: true });
          cy.get(marketo.shippingFrequency).select('', { force: true });

          // 5. Verify the form submits successfully when all fields are filled out correctly
          cy.get(marketo.lblIsBusiness).click({ force: true });
          cy.get(marketo.suspectCompanyname).type(testText, { force: true });
          cy.get(marketo.firstName).type(testText, { force: true });
          cy.get(marketo.lastName).type(testText, { force: true });
          cy.get(marketo.email).type('test@gmail.com', { force: true });
          cy.get(marketo.suspectAddress).type(testText, { force: true });
          cy.get(marketo.suspectPostalCode).type(testText, { force: true });
          cy.get(marketo.suspectCity).type(testText, { force: true });
          cy.get(marketo.suspectCountry).select('Albania', { force: true });
          cy.get(marketo.phone).type('111111', { force: true });
          cy.get(marketo.shippingFrequency).select('One-off', { force: true });
          cy.exist(marketo.submit);
        });
      });
    });
  });
});