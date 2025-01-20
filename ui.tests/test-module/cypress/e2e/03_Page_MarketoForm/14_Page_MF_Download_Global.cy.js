describe('Global Download Marketo page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-Download.html'
  ];

  const selectors = {
    downloadAssetComponent: '#download',
    title: '.DHLdownload__title',
    emailField: '#Email',
    countryField: '#suspectCountry',
    formButton: '.mktoButton',
    countryErrorMessage: '#ValidMsgsuspectCountry',
    emailErrorMessage: '#ValidMsgEmail',
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
          // 1. Verify the download asset component exists
          cy.get(selectors.downloadAssetComponent).should('exist');

          // 2. Verify if all fields are present
          cy.get(selectors.title, { timeout: 2000 }).should('exist');
          cy.get(selectors.downloadAssetComponent).should('exist');
          cy.get(selectors.emailField).should('exist');
          cy.get(':nth-child(11) > .mktoFieldDescriptor > .mktoFieldWrap > .mktoLabel').should('exist');
          cy.get(selectors.countryField).should('exist');
          cy.get(selectors.formButton).should('exist');

          // 3. Verify that an error message "This field is required" is displayed when a required field is left blank
          cy.get(selectors.emailField).type('test@gmail.com', { force: true });
          cy.get(selectors.formButton).click({ force: true });
          cy.get(selectors.countryErrorMessage).should('exist', { force: true });

          // 4. Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @)
          cy.get(selectors.emailField).clear({ force: true });
          cy.get(selectors.countryField).select('', { force: true });
          cy.get(selectors.emailField).type('test', { force: true });
          cy.get(selectors.countryField).select('Afghanistan', { force: true });
          cy.get(selectors.formButton).click({ force: true });
          cy.get(selectors.emailErrorMessage).should('be.visible').and('contain', 'Must be valid email.', 'example@yourdomain.com');

          // 5. Verify the form submits successfully when all fields are filled out correctly and the second submission is successful
          cy.get(selectors.emailField).clear({ force: true });
          cy.intercept('POST', '**/Page-Download.form.html').as('formSubmit');
          cy.intercept('POST', '**/Page-Download.form.html', (req) => {
            console.log(req);
          });
          cy.get(selectors.emailField).type('test@gmail.com', { force: true });
          cy.get(selectors.countryField).select('Afghanistan', { force: true });
          cy.get(selectors.formButton).click({ force: true });
          cy.wait('@formSubmit').its('response.statusCode').should('equal', 202);
          cy.url().should('include', 'thanks');
        });
      });
    });
  });
});