describe('Singapore DHL Landing Page - Two Column', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/dhl-landing-two-column-page.html'
  ];

  // Define selectors as constants
  const selectors = {
    heroBanner: '.cmp-hero-banner__asset',
    textContent: '.cmp-text',
    marketoFormContainer: '#mktoForm_1795',
    fieldLabel: ':nth-child(2) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel',
    suspectCompanyname: '#suspectCompanyname',
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
          cy.exist(selectors.suspectCompanyname);
          cy.exist(selectors.firstName);
          cy.exist(selectors.lastName);
          cy.exist(selectors.email);
          cy.exist(selectors.suspectAddress);
          cy.exist(selectors.suspectPostalCode);
          cy.exist(selectors.suspectCity);
          cy.exist(selectors.suspectCountry);
          cy.exist(selectors.phone);
          cy.exist(selectors.shippingFrequency);
          cy.exist(selectors.submitButton);

          // 6. Verify the form submits successfully when all fields are filled out correctly
          const testText = 'THIS IS FOR TEST PLEASE IGNORE';
          cy.get(selectors.fieldLabel).click();
          cy.get(selectors.suspectCompanyname).type(testText);
          cy.get(selectors.firstName).type(testText);
          cy.get(selectors.lastName).type(testText);
          cy.get(selectors.email).type('test@gmail.com');
          cy.get(selectors.suspectAddress).type(testText);
          cy.get(selectors.suspectPostalCode).type(testText);
          cy.get(selectors.suspectCity).type(testText);
          cy.get(selectors.suspectCountry).select('Albania');
          cy.get(selectors.phone).type('111111');
          cy.get(selectors.shippingFrequency).select('One-off');
          cy.exist(selectors.submitButton);

          // 7. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);
        });
      });
    });
  });
});