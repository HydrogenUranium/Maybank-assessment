describe('DHL Landing Page', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--DHL-Landing-Page.html'

  beforeEach(() => {
    cy.on('uncaught:exception', (e) => {
      if (e.message.includes('Things went bad')) {
        return false;
      }
    });

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

      it('2. Verify text is exist', function() {
        cy.get('.title-v2').should('exist');
      });

      it('3. Verify download asset is exist and when click on it, it redirects to the correct page', function() {
        cy.get(':nth-child(5) > .download > .cq-dd-file').should('exist');
        cy.get(':nth-child(5) > .download > .cq-dd-file')
          .should('have.attr', 'href')
          .and('include', 'https://www.dhl.com/en/express/tracking.shtml')
      });

      it('4. Verify header and footer exist', function() {
        cy.get('.headerV2-wrapper').should('exist');
        cy.get('.footer-container').should('exist');
      });
    });
  });
});