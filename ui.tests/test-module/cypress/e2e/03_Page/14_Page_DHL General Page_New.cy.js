describe('DHL Landing Page', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-General.html'

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

      it('1.Verify Title V2 is exist', function() {
        cy.get('.cmp-title__text').should('exist');
      });

      it('2.Verify text is exist', function() {
        cy.get('#text-6d3c85d7a4').should('exist');
      });

      it('3.Verify accordian is exist', function() {
        cy.get('.accordion').should('exist');
      });

//    it('4.Verify when click dropdown, it will expand and it shows the content', function() {
//      cy.get('#accordion-2000737226 > :nth-child(1)').should('click');
//      cy.get('#collapse-2000737226-1 > .card__body > p').should('be.visible')
//    });
//
//    it('5.Verify when click again the dropdown, it will close the accordian', function() {
//      cy.get('#heading-2000737226-1').should('click');
//      cy.get('#collapse-2000737226-1 > .card__body > p').should('not.be.visible')
//    });

      it('5. Verify header and footer exist', function() {
        cy.get('.headerV2-wrapper').should('exist');
        cy.get('.footer-container').should('exist');
      });
    });
  });
});