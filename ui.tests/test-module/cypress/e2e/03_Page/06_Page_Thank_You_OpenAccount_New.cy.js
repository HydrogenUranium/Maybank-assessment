describe('Thank You Page Open An Account', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL')+ '/content/dhl/global/en-global/open-an-account/thanks.html';

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('1.Verify that the "Thank You" page loads successfully without any errors', function() {
    cy.get('.cmp-breadcrumb__item--active > span').should('contain', 'Thank you');
  });

  it('2.Verify that the page title is correct with bold and matches the expected title', function() {
    cy.get('h2>b').should('contain', 'Thank You for requesting a DHL EXPRESS BUSINESS ACCOUNT.')
      .and(($h2) => {
        expect($h2).to.have.css('font-weight', '700'); //find the bold
      });
  });

  it('3.Verify text consist with some text', function() {
    cy.get('p').should('exist');
  });

  it('4.Verify  header and footer are exist', function() {
    cy.get('.headerV2-wrapper').should('exist');
    cy.get('.footer-container').should('exist');
  });

  it('5.Verify follow us section is exist', function() {
    cy.get('.followUs').should('exist');
  });


  it('6.Verify all the social media icon is clickable (Facebook, Youtube, Instagram, LinkedIn, Twitter)', function() {
    cy.get('.followUs__items > [href="https://www.facebook.com/DHLexpress/"]').should('have.attr', 'href');
    cy.wait (2000);
    cy.get('.followUs__items > [href="https://www.youtube.com/user/dhl"]').should('have.attr', 'href');
    cy.wait (2000);
    cy.get('.followUs__items > [href="https://www.instagram.com/discoverbydhl/"]').should('have.attr', 'href');
    cy.wait (2000);
    cy.get('.followUs__items > [href="https://www.linkedin.com/showcase/discover-dhl-for-business/"]').should('have.attr', 'href');
    cy.wait (2000);
    cy.get('.followUs__items > [href="https://twitter.com/DHLexpress"]').should('have.attr', 'href');
  });

});
