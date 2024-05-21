describe('Error Page', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--Error.html'

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

  viewports.forEach(viewport => {
    context(`Testing on ${viewport}`, () => {
      beforeEach(() => {
        if (typeof viewport === 'string') {
          cy.viewport(viewport);
        } else {
          cy.viewport(viewport[0], viewport[1]);
        }
      });

      it('1. Verify the error page consist of title', function() {
        cy.get('.title').should('exist');
      });

      it('2. Verify image exists without being broken', function() {
        cy.get('.image').should('be.visible').and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
      });

      it('3.Verify button link is visible and when click on it, it redirects to the homepage', function() {
        cy.get('.error-banner-component > .button').should('exist');
        cy.get('.error-banner-component > .button').click();
        cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global`);
      });

      it('4. Verify header and footer exist', function() {
        cy.get('.headerV2-wrapper').should('exist');
        cy.get('.footer-container').should('exist');
      });
    })
  })
});