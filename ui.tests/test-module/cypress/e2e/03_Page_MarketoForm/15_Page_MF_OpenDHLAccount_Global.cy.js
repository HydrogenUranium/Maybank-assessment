describe('Global Open A DHL Account Form', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-OpenADHLAccount.html'
  ];

  const testText = 'THIS IS FOR TEST PLEASE IGNORE';

  const selectors = {
    title: '.columns-section__right-column__header-section > .aem-Grid > .title-v2 > .cmp-title-v2 > #title-v2-e579709512 > .cmp-title__text',
    marketoForm: '#mktoForm_2040',
    firstNameLabel: ':nth-child(2) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel',
    firstNameField: '#FirstName',
    lastNameField: '#LastName',
    emailField: '#Email',
    addressField: '#suspectAddress',
    postalCodeField: '#suspectPostalCode',
    cityField: '#suspectCity',
    countryField: '#suspectCountry',
    phoneField: '#Phone',
    shippingFrequencyField: '#shippingfrequency',
    formButton: '.mktoButton',
    emailErrorMessage: '#ValidMsgEmail',
    phoneErrorMessage: '#ValidMsgPhone',
    onetrustConsentSdk: '#onetrust-consent-sdk',
    onetrustAcceptButton: 'button#onetrust-accept-btn-handler'
  };

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      // Log URL and visit page
      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);

      // Accept cookie consent if present
      cy.get(selectors.onetrustConsentSdk, { timeout: 5000 }).then(($onetrust) => {
        if ($onetrust.find(selectors.onetrustAcceptButton, { timeout: 5000 }).length > 0) {
          cy.get(selectors.onetrustAcceptButton)
            .contains('Accept All')
            .should('be.visible')
            .click();
        }
      });
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          // Set viewport
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }

          // Log viewport
          cy.log(`Running tests for viewport at index ${vIndex}: ${viewport}`);
        });

        it('All test case', () => {
          // 1. Verify the title exists
          cy.get(selectors.title).should('exist');

          // 2. Verify Marketo form is present
          cy.get(selectors.marketoForm)
            .should('not.be.empty')
            .should('be.visible');

          // 3. Verify if all fields are present
          cy.get(selectors.firstNameLabel).should('exist');
          cy.get(selectors.firstNameField).should('exist');
          cy.get(selectors.lastNameField).should('exist');
          cy.get(selectors.emailField).should('exist');
          cy.get(selectors.addressField).should('exist');
          cy.get(selectors.postalCodeField).should('exist');
          cy.get(selectors.cityField).should('exist');
          cy.get(selectors.countryField).should('exist');
          cy.get(selectors.phoneField).should('exist');
          cy.get(selectors.shippingFrequencyField).should('exist');
          cy.get(selectors.formButton).should('exist');

          // 4. Verify an error message is displayed for each field when the input is invalid
          cy.get(selectors.firstNameField).type(testText, { force: true });
          cy.get(selectors.lastNameField).type(testText, { force: true });
          cy.get(selectors.emailField).type('test', { force: true });
          cy.get(selectors.addressField).type(testText, { force: true });
          cy.get(selectors.postalCodeField).type(testText, { force: true });
          cy.get(selectors.cityField).type(testText, { force: true });
          cy.get(selectors.countryField).select('Albania', { force: true });
          cy.get(selectors.phoneField).type('TEST', { force: true });
          cy.get(selectors.shippingFrequencyField).select('One-off', { force: true });
          cy.get(selectors.formButton).click({ force: true });
          cy.get(selectors.emailErrorMessage).should('be.visible').and('contain', 'Must be valid email.', 'example@yourdomain.com');
          cy.get(selectors.emailField).clear();
          cy.get(selectors.emailField).type('test@gmail.com', { force: true });
          cy.get(selectors.formButton).click({ force: true });
          cy.get(selectors.phoneErrorMessage).should('exist');

          // Clear all the form
          cy.get(selectors.firstNameField).clear({ force: true });
          cy.get(selectors.lastNameField).clear({ force: true });
          cy.get(selectors.emailField).clear({ force: true });
          cy.get(selectors.addressField).clear({ force: true });
          cy.get(selectors.postalCodeField).clear({ force: true });
          cy.get(selectors.cityField).clear({ force: true });
          cy.get(selectors.countryField).select('', { force: true });
          cy.get(selectors.phoneField).clear({ force: true });
          cy.get(selectors.shippingFrequencyField).select('', { force: true });

          // 5. Verify the form submits successfully when all fields are filled out correctly and second submission is successful
          cy.intercept('POST', '**/Page-OpenADHLAccount.form.html').as('formSubmit');
          cy.intercept('POST', '**/Page-OpenADHLAccount.form.html', (req) => {
            console.log(req);
          });
          cy.get(selectors.firstNameField).type(testText, { force: true });
          cy.get(selectors.lastNameField).type(testText, { force: true });
          cy.get(selectors.emailField).type('test@gmail.com', { force: true });
          cy.get(selectors.addressField).type(testText, { force: true });
          cy.get(selectors.postalCodeField).type(testText, { force: true });
          cy.get(selectors.cityField).type(testText, { force: true });
          cy.get(selectors.countryField).select('Albania', { force: true });
          cy.get(selectors.phoneField).type('111111', { force: true });
          cy.get(selectors.shippingFrequencyField).select('One-off', { force: true });
          cy.get(selectors.formButton).click({ force: true });
          cy.wait('@formSubmit').its('response.statusCode').should('equal', 202);
          cy.url().should('include', 'thanks');
        });
      });
    });
  });
});