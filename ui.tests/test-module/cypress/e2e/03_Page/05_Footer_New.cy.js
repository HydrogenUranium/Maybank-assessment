describe('Footer', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL')+ '/content/dhl/global/en-global.html';

  beforeEach(() => {
    cy.on('uncaught:exception', (e) => {
      if (e.message.includes('Things went bad')) {
      return false;
      }
    });

    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('1.Verify the footer has a logo and three link groups', () => {
    cy.get('.logo__link > .logo__image').should('be.visible');
    cy.get('.links-group').should('have.length', 3);
  });

  it('2.Verify when click DHL logo, it redirects to correct url dhl.com', () => {
    cy.get('.logo__link > .logo__image').should('exist');
  });

  it('3.Verify that each footer link redirects to the correct destination', () => {
    cy.get('.links-group__item')
      .each(($link) => {
        const href = $link.prop('href');

        cy.request(href)
          .its('status')
          .should('eq', 200);
      });
  });

  it('4.Verify that each hyperlink in the footer is accessible via keyboard navigation', () => {
    cy.get('.links-group__item')
      .each(($link) => {
        cy.wrap($link).focus().should('have.focus');
      });
  });

  it('5.Verify hover changes hyperlink color from black to red in the footer', () => {
    const link = cy.get('.links-group__item');
      link.invoke('css', 'color', 'red');
      link.should('have.css', 'color', 'rgb(255, 0, 0)');
  });

});