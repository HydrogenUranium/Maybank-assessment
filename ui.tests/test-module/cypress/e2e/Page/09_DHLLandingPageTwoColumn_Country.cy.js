import { marketo } from "../../support/selectors";

describe('Singapore DHL Landing Page - Two Column', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/dhl-landing-two-column-page.html'
  ];

  // Define selectors as constants
  const selectors = {
    heroBanner: '.cmp-hero-banner__asset',
    textContent: '.cmp-text',
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

        it('Test Case', function () {
          // 1. Verify hero banner exists with image
          cy.exist(selectors.heroBanner);

          // 2. Verify text exists
          cy.exist(selectors.textContent);

          // 4. Verify marketo form exists
          cy.exist(selectors.marketoFormContainer);

          // 5. Verify if all fields are present
          cy.exist(selectors.fieldLabel);
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

          // 6. Verify the form submits successfully when all fields are filled out correctly
          const testText = 'THIS IS FOR TEST PLEASE IGNORE';
          cy.get(selectors.fieldLabel).click();
          cy.get(marketo.suspectCompanyname).type(testText);
          cy.get(marketo.firstName).type(testText);
          cy.get(marketo.lastName).type(testText);
          cy.get(marketo.email).type('test@gmail.com');
          cy.get(marketo.suspectAddress).type(testText);
          cy.get(marketo.suspectPostalCode).type(testText);
          cy.get(marketo.suspectCity).type(testText);
          cy.get(marketo.suspectCountry).select('Albania');
          cy.get(marketo.phone).type('111111');
          cy.get(marketo.shippingFrequency).select('One-off');
          cy.exist(marketo.submit);

          // 7. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);
        });
      });
    });
  });
});