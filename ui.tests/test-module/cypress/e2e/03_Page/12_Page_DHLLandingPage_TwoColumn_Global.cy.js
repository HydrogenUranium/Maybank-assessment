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
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.visit(pageUrl);
      cy.acceptCookies();
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }
        });

        it('All test case', function () {
          // 1. Verify hero banner exists with image
          cy.get(selectors.heroBanner).should('exist');

          // 2. Verify text exists
          cy.get(selectors.textContent).should('exist');

          // 3. Verify landing page point exists with title, icon, and content
          cy.get(selectors.landingPoint).should('exist');

          // 4. Verify marketo form exists
          cy.get(selectors.marketoFormContainer).should('exist');

           // 5. Verify if all fields are present
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
//          cy.get(selectors.header).should('exist'); // Uncomment after release.
          cy.get(selectors.footer).should('exist');
        });
      });
    });
  });
});