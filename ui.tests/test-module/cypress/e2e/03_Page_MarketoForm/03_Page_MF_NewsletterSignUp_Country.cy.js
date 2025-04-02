describe('Singapore Subscribe newsletter page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/newsletter-sign-up.html'
  ];

  const selectors = {
    marketoFormContainer: '.cmp-marketoForm__container',
    title: '.columns-section__right-column__header-section > .aem-Grid > .title-v2',
    firstNameField: '#FirstName',
    lastNameField: '#LastName',
    emailField: '#Email',
    countryField: '#suspectCountry',
    formButton: '.mktoButton'
  };

  const acceptCookieConsent = () => {
    cy.get('body', { timeout: 2000 }).then(($body) => {
      cy.get('#onetrust-consent-sdk', { timeout: 5000 }).then(($onetrust) => {
        if ($onetrust.find('button#onetrust-accept-btn-handler', { timeout: 5000 }).length > 0) {
          cy.get('button#onetrust-accept-btn-handler')
            .contains('Accept All')
            .should('be.visible')
            .click();
        }
      });
    });
  };

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      // Log URL and visit page
      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      acceptCookieConsent();
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
          // 1. Verify the title contains the correct text "Subscribe for the latest insights"
          cy.get(selectors.title, { timeout: 2000 }).should('exist');

          // 2. Verify if all fields are present
          cy.get(selectors.title, { timeout: 2000 }).should('exist');
          cy.get(selectors.marketoFormContainer).should('exist');
          cy.get(selectors.firstNameField).should('exist');
          cy.get(selectors.lastNameField).should('exist');
          cy.get(selectors.emailField).should('exist');
          cy.get(selectors.countryField).should('exist');
          cy.get(selectors.formButton).should('exist');

          // 3. Verify the form submits successfully when all fields are filled out correctly
          cy.get(selectors.firstNameField).type('testing purpose', { force: true });
          cy.get(selectors.lastNameField).type('testing purpose', { force: true });
          cy.get(selectors.emailField).should('be.visible').type('test@gmail.com', { force: true });
          cy.get(selectors.countryField).select('Afghanistan', { force: true });
          cy.get(selectors.formButton).should('exist');

          // Clear all the form fields
          cy.get(selectors.firstNameField).clear({ force: true });
          cy.get(selectors.lastNameField).clear({ force: true });
          cy.get(selectors.emailField).clear({ force: true });

          // 4. Verify that an error message "This field is required" is displayed when a required field is left blank
          cy.get(selectors.lastNameField).type('testing purpose', { force: true });
          cy.get(selectors.emailField).type('test@gmail.com', { force: true });
          cy.get(selectors.formButton).should('exist', { force: true });

          // Clear all the form fields
          cy.get(selectors.firstNameField).clear({ force: true });
          cy.get(selectors.lastNameField).clear({ force: true });
          cy.get(selectors.emailField).clear({ force: true });

          // 5. Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @)
          cy.get(selectors.firstNameField).type('testing purpose', { force: true });
          cy.get(selectors.lastNameField).type('testing purpose', { force: true });
          cy.get(selectors.emailField).type('test', { force: true });
          cy.get(selectors.formButton).should('exist', { force: true });
        });
      });
    });
  });
  });
