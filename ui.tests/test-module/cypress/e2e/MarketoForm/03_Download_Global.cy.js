import { marketo } from "../../support/selectors";

describe('Global Download Marketo page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-Download.html'
  ];

  const selectors = {
    downloadAssetComponent: '#download',
    title: '.DHLdownload__title',
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      // Log URL and visit page
      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);

      // Accept cookie consent if present
      cy.acceptCookies();
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          cy.handleViewport(viewport, vIndex);
        });

        it('All test case', () => {
          // 1. Verify the download asset component exists
          cy.exist(selectors.downloadAssetComponent);

          // 2. Verify if all fields are present
          cy.get(selectors.title, { timeout: 2000 }).should('exist');
          cy.exist(selectors.downloadAssetComponent);
          cy.exist(marketo.email);
          cy.exist(':nth-child(11) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel');
          cy.exist(marketo.suspectCountry);
          cy.exist(marketo.submit);

          // 3. Verify that an error message "This field is required" is displayed when a required field is left blank
          cy.get(marketo.email).type('test@gmail.com', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.get(marketo.countryErrorMessage).should('exist', { force: true });

          // 4. Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @)
          cy.get(marketo.email).clear({ force: true });
          cy.get(marketo.suspectCountry).select('', { force: true });
          cy.get(marketo.email).type('test', { force: true });
          cy.get(marketo.suspectCountry).select('Afghanistan', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.get(marketo.emailErrorMessage).should('be.visible').and('contain', 'Must be valid email.', 'example@yourdomain.com');

          // 5. Verify the form submits successfully when all fields are filled out correctly and the second submission is successful
          cy.get(marketo.email).clear({ force: true });
          cy.intercept('POST', '**/Page-Download.form.html').as('formSubmit');
          cy.intercept('POST', '**/Page-Download.form.html', (req) => {
            console.log(req);
          });
          cy.get(marketo.email).type('test@gmail.com', { force: true });
          cy.get(marketo.suspectCountry).select('Afghanistan', { force: true });
          cy.get(marketo.submit).click({ force: true });
          cy.wait('@formSubmit').its('response.statusCode').should('equal', 202);
          cy.url().should('include', 'thanks');
        });
      });
    });
  });
});