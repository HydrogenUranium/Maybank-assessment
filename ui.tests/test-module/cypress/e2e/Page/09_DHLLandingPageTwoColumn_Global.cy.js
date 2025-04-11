describe('Global DHL Landing Page - Two Column', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/dhl-landing-two-column-page.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  // Define selectors as constants
  const selectors = {
    heroBanner: '.cmp-hero-banner__asset',
    lblIsBusiness: '#LblisBusiness',
    textContent: '.cmp-text',
    landingPoint: '.landing-point',
    marketoFormContainer: '.cmp-marketoForm__container',
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

        it('All test case', function () {
          // 1. Verify hero banner exists with image
          cy.exist(selectors.heroBanner);

          // 2. Verify text exists
          cy.exist(selectors.textContent);

          // 3. Verify landing page point exists with title, icon, and content
          cy.exist(selectors.landingPoint);

          // 4. Verify marketo form exists
          cy.exist(selectors.marketoFormContainer);

           // 5. Verify if all fields are present
          cy.exist(selectors.lblIsBusiness);
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
          cy.intercept('POST', '**/dhl-landing-two-column-page.form.html').as('formSubmit');
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

          // 7. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);
        });
      });
    });
  });
});