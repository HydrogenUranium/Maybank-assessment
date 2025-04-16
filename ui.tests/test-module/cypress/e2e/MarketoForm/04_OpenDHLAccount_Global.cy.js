import { marketo } from "../../support/selectors";

describe('Global Open A DHL Account Form', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-OpenADHLAccount.html'
//        Cypress.env('AEM_PUBLISH_URL') + '/en-global/automation-testing/Page-OpenADHLAccount'

  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  const selectors = {
    title: '.right-header-section .cmp-title-v2__text',
    firstNameLabel: ':nth-child(2) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel',
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
          // 1. Verify the title exists
          cy.exist(selectors.title);

          // 2. Verify Marketo form is present
          cy.get(marketo.form2040)
            .should('not.be.empty')
            .should('be.visible');

          // 3. Verify if all fields are present
          cy.exist(selectors.firstNameLabel);
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

          // 4. Verify an error message is displayed for each field when the input is invalid
          cy.get(marketo.firstName).type(testText, { force: true });
          cy.get(marketo.lastName).type(testText, { force: true });
          cy.get(marketo.email).type('test', { force: true });
          cy.get(marketo.suspectAddress).type(testText, { force: true });
          cy.get(marketo.suspectPostalCode).type(testText, { force: true });
          cy.get(marketo.suspectCity).type(testText, { force: true });
          cy.get(marketo.suspectCountry).select('Albania', { force: true });
          cy.get(marketo.phone).type('TEST', { force: true });
          cy.get(marketo.shippingFrequency).select('One-off', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.get(marketo.emailErrorMessage).should('be.visible').and('contain', 'Must be valid email.', 'example@yourdomain.com');
          cy.get(marketo.email).clear();
          cy.get(marketo.email).type('test@gmail.com', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.exist(marketo.phoneErrorMessage);

          // Clear all the form
          cy.get(marketo.firstName).clear({ force: true });
          cy.get(marketo.lastName).clear({ force: true });
          cy.get(marketo.email).clear({ force: true });
          cy.get(marketo.suspectAddress).clear({ force: true });
          cy.get(marketo.suspectPostalCode).clear({ force: true });
          cy.get(marketo.suspectCity).clear({ force: true });
          cy.get(marketo.suspectCountry).select('', { force: true });
          cy.get(marketo.phone).clear({ force: true });
          cy.get(marketo.shippingFrequency).select('', { force: true });

          // 5. Verify the form submits successfully when all fields are filled out correctly and second submission is successful
          cy.intercept('POST', '**/Page-OpenADHLAccount.form.html').as('formSubmit');
          cy.intercept('POST', '**/Page-OpenADHLAccount.form.html', (req) => {
            console.log(req);
          });
          cy.get(marketo.firstName).type(testText, { force: true });
          cy.get(marketo.lastName).type(testText, { force: true });
          cy.get(marketo.email).type('test@gmail.com', { force: true });
          cy.get(marketo.suspectAddress).type(testText, { force: true });
          cy.get(marketo.suspectPostalCode).type(testText, { force: true });
          cy.get(marketo.suspectCity).type(testText, { force: true });
          cy.get(marketo.suspectCountry).select('Albania', { force: true });
          cy.get(marketo.phone).type('111111', { force: true });
          cy.get(marketo.shippingFrequency).select('One-off', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.wait('@formSubmit').its('response.statusCode').should('equal', 202);
          cy.url().should('include', 'thanks');
        });
      });
    });
  });
});