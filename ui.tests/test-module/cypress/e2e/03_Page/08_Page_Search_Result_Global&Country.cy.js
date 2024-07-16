describe('Global & Singapore Search Result Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/search-results.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/search-results.html'
  ];

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        if (e.message.includes('Things went bad')) {
          return false;
        }
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.wait(2000);
      cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }

          cy.log(`Running tests for viewport at index ${vIndex}: ${viewport}`);
        });

        it('Test Case', function () {
          // 1. Verify search result page loads successfully without any errors
          cy.get('.searchFormTitle__QAA_R').should('contain', 'Search Results');

          // 2. Verify that search functionality works correctly, meaning it returns relevant results based on the provided search term
          cy.get('[data-testid="search-input"]')
            .type('Covid')
            .type('{enter}');
          cy.get('.searchFormDetails__Id4pi > b')
            .should('contain', 'Covid');

          // 3. Verify that when a search term does not match any items, the page displays "No result found"
          cy.get('[data-testid="search-input"]')
            .type('yhs')
            .type('{enter}');
          cy.get('.searchResult__usgPF > :nth-child(2) > :nth-child(1)').should('exist');

          // 4. Verify when clicking one of the popular searches (yellow tags), it displays the articles
          cy.get('.trending__tEuuZ > :nth-child(2)').click();
          cy.get('.searchResult__usgPF > :nth-child(2) > :nth-child(1)').each(($el) => {
            cy.wrap($el).should('be.visible');
          });

          // 5. Verify when clicking "Show more result" button, it displays the list of articles
          cy.get('.trending__tEuuZ > :nth-child(2)').click();
          cy.get('.searchResultButton__FxQve').click();
          cy.get('.searchResult__usgPF > :nth-child(2) > :nth-child(1)').each(($el) => {
            cy.wrap($el).should('be.visible');
          });

          // 6. Verify header and footer are exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');
        });
      });
    });
  });
});
