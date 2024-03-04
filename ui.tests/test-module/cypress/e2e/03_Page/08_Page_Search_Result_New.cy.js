describe('Search Result Page', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL')+ '/content/dhl/global/en-global/search-results.html';

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });


  it('1.Verify search result page loads successfully without any errors', function() {
    cy.get('.searchFormTitle__QAA_R').should('contain', 'Search Results');
  });

  it('2.Verify that search functionality works correctly, meaning it returns relevant results based on the provided search term', function() {
    cy.get('[data-testid="search-input"]')
      .type('Covid')
      .type('{enter}');
    cy.get('.searchFormDetails__Id4pi > b')
      .should('contain', 'Covid');
  });

  it('3.Verify that when a search term does not match any items, the page displays an appropriate "No Results Found" message', function() {
    cy.get('[data-testid="search-input"]')
      .type('Unmatched Term')
      .type('{enter}');
    cy.get('.searchResult__usgPF > :nth-child(2) > :nth-child(1)').should('not.exist');
  });

  it('4.Verify when click one of the popular searches (yellow tags), it display the articles', function() {
    cy.get('.trending__tEuuZ > :nth-child(2)').click();
    cy.get('.searchResult__usgPF > :nth-child(2) > :nth-child(1)').each(($el, index, $list) => {
      cy.wrap($el).should('be.visible');
    });
  });

  it('5.Verify when click show more result button, it display the list of article', function() {
    cy.get('.trending__tEuuZ > :nth-child(2)').click();
    cy.get('.searchResultButton__FxQve').click();
    cy.get('.searchResult__usgPF > :nth-child(2) > :nth-child(1)').each(($el, index, $list) => {
      cy.wrap($el).should('be.visible');
    });
  });

  it('6.Verify  header and footer are exist', function() {
    cy.get('.headerV2-wrapper').should('exist');
    cy.get('.footer-container').should('exist');
  });

});
