describe('Thank You Page Newsletter ', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL')+ '/content/dhl/global/en-global/newsletter-sign-up/newsletter-thanks.html';

  beforeEach(() => {
    cy.viewport('macbook-11');
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('1.Verify that the "Thank You" page loads successfully without any errors', function() {
    cy.get('.cmp-breadcrumb__item--active > span').should('contain', 'Thank you');
  });

  it('2.Verify that the page title is correct with bold and matches the expected title', function() {
    cy.get('h2 b', { timeout: 10000 })
      .should('contain', 'Thank you - just one more step!')
      .and(($h2) => {
        expect($h2).to.have.css('font-weight', '700'); // check for bold text
      });
  });

  it('3.Verify text consist with some text', function() {
    cy.get('p').should('exist');
  });

  it('4.Verify  header and footer are exist', function() {
    cy.get('.headerV2-wrapper').should('exist');
    cy.get('.footer-container').should('exist');
  });

  it('5.Verify Recommended section section is exist and contain maximum 4 article', function() {
    cy.get('.article-items').should('exist')
      .find('.article-items').should('have.length.at.most', 4);
  });

});
