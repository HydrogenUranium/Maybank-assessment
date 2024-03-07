describe('HomePage', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL')+ '/content/dhl/global/en-global.html';

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('1.Verify top tiles is exist and should contain maximum 4 article', () => {
    cy.get('.top-tiles-component').should('exist')
      .find('.article').should('have.length.at.most', 4);
  });

  it('2.Verify title v2 is exist with some title', function() {
    cy.get('#title-v2-9830663cf4').should('exist')
      .invoke('text').should('not.be.empty');
  });

  it('3.Verify horizontal article showcase is exist and should contain maximum 4 article', function() {
    cy.get('.root > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(3)').should('exist')
      .find('.article').should('have.length.at.most', 4);
  });

  it('4.Verify vertical article showcase is exist', function() {
    cy.get(':nth-child(4) > .home-page-container-component > .container > .container__body > .body-container > .aem-Grid > .article-showcase > .article-showcase-component').should('exist')
  });

  it('5.Verify sign up to the discover exists', function() {
    cy.get(':nth-child(1) > .cta-banner-with-points-component > .banner > .banner__body').should('exist')
      .click();
  });

  it('6.Verify CTA Banner with Points (apply for a business account) exists with the correct title', function() {
    cy.get('.body-container > .aem-Grid > .cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body').should('exist')
      .click();
  });

});
