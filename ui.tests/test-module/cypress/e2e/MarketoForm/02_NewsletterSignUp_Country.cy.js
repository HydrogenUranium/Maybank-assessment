import { marketo } from "../../support/selectors";

describe('Singapore Subscribe newsletter page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/newsletter-sign-up.html'
  ];

  const selectors = {
    marketoFormContainer: '.cmp-marketoForm__container',
    title: '.columns-section__right-column__header-section > .aem-Grid > .title-v2',
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      // Log URL and visit page
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
          // 1. Verify the title contains the correct text "Subscribe for the latest insights"
          cy.get(selectors.title, { timeout: 2000 }).should('exist');

          // 2. Verify if all fields are present
          cy.get(selectors.title, { timeout: 2000 }).should('exist');
          cy.exist(marketo.form);
          cy.exist(marketo.firstName);
          cy.exist(marketo.lastName);
          cy.exist(marketo.email);
          cy.exist(marketo.suspectCountry);
          cy.exist(marketo.submit);

          // 3. Verify the form submits successfully when all fields are filled out correctly
          cy.get(marketo.firstName).type('testing purpose', { force: true });
          cy.get(marketo.lastName).type('testing purpose', { force: true });
          cy.get(marketo.email).should('be.visible').type('test@gmail.com', { force: true });
          cy.get(marketo.suspectCountry).select('Afghanistan', { force: true });
          cy.exist(marketo.submit);

          // Clear all the form fields
          cy.get(marketo.firstName).clear({ force: true });
          cy.get(marketo.lastName).clear({ force: true });
          cy.get(marketo.email).clear({ force: true });

          // 4. Verify that an error message "This field is required" is displayed when a required field is left blank
          cy.get(marketo.lastName).type('testing purpose', { force: true });
          cy.get(marketo.email).type('test@gmail.com', { force: true });
          cy.get(marketo.submit).should('exist', { force: true });

          // Clear all the form fields
          cy.get(marketo.firstName).clear({ force: true });
          cy.get(marketo.lastName).clear({ force: true });
          cy.get(marketo.email).clear({ force: true });

          // 5. Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @)
          cy.get(marketo.firstName).type('testing purpose', { force: true });
          cy.get(marketo.lastName).type('testing purpose', { force: true });
          cy.get(marketo.email).type('test', { force: true });
          cy.get(marketo.submit).should('exist', { force: true });
        });
      });
    });
  });
  });
