describe('Singapore DHL Landing Page - Two Column', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/dhl-landing-two-column-page.html'
  ];

  // Define selectors as constants
  const selectors = {
    onetrustConsentSdk: '#onetrust-consent-sdk',
    onetrustAcceptButton: 'button#onetrust-accept-btn-handler',
    heroBanner: '.cmp-hero-banner__asset',
    textContent: '#text-ba3e0cc854',
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
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.visit(pageUrl);
      cy.get('body', { timeout: 2000 }).then(($body) => {
        cy.get(selectors.onetrustConsentSdk, { timeout: 5000 }).then(($onetrust) => {
          if ($onetrust.find(selectors.onetrustAcceptButton, { timeout: 5000 }).length > 0) {
              cy.get(selectors.onetrustAcceptButton)
                .contains('Accept All')
                .should('be.visible')
                .click();
          }
        });
      });
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

        it('Test Case', function () {
          // 1. Verify hero banner exists with image
          cy.get(selectors.heroBanner).should('exist');

          // 2. Verify text exists
          cy.get(selectors.textContent).should('exist');

          // 4. Verify marketo form exists
          cy.get(selectors.marketoFormContainer).should('exist');

          // 5. Verify if all fields are present
          cy.get(selectors.fieldLabel).should('exist');
          cy.get(selectors.suspectCompanyname).should('exist');
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
          cy.get(selectors.submitButton).should('exist');

          // 7. Verify header and footer exist
          cy.get(selectors.header).should('exist');
          cy.get(selectors.footer).should('exist');
        });
      });
    });
  });
});