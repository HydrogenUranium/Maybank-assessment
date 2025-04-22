import { marketo } from "../../support/selectors";

describe('Global DHL Landing Page - Two Column', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/dhl-landing-two-column-page.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  // Define selectors as constants
  const selectors = {
    heroBanner: '.cmp-hero-banner__asset',
    textContent: '.cmp-text',
    landingPoint: '.landing-point',
    fieldLabel: ':nth-child(2) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel',
    header: '.header-wrapper',
    footer: '.footer-container'
  };

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
      cy.visit(pageUrl);
      cy.acceptCookies();
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          cy.handleViewport(viewport, vIndex);
        });

        it('All test case', function () {
          // 1. Verify hero banner exists with image
          cy.exist(selectors.heroBanner);

          // 2. Verify text exists
          cy.exist(selectors.textContent);

          // 3. Verify landing page point exists with title, icon, and content
          cy.exist(selectors.landingPoint);

          // 4. Verify marketo form exists
          cy.exist(marketo.formContainer);

           // 5. Verify if all fields are present
          cy.exist(marketo.lblIsBusiness);
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

          // 6. Verify the form submits successfully when all fields are filled out correctly
          cy.intercept('POST', '**/dhl-landing-two-column-page.form.html').as('formSubmit');
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

          // 7. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);
        });
      });
    });
  });
});
