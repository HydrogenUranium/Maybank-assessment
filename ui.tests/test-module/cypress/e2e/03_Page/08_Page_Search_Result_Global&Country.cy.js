describe('Global & Singapore Search Result Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/search-results.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/search-results.html'
  ];

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);

      cy.get('body', { timeout: 2000 }).then(($body) => {
        cy.get('#onetrust-consent-sdk', { timeout: 5000 }).then(($onetrust) => {
          if ($onetrust.find('button#onetrust-accept-btn-handler', { timeout: 5000 }).length > 0) {
              cy.get('button#onetrust-accept-btn-handler')
                .contains('Accept All')
                .should('be.visible')
                .click();
          }
        });
      });
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
          cy.get('[data-testid="search-input"]', {force: true}).clear();
          cy.get('[data-testid="search-input"]', {force: true}).type('Covid');
          cy.get('[data-testid="search-input"]').type('{enter}');
          cy.get('.searchFormDetails__Id4pi > b').should('contain', 'Covid');

          // 3. Verify that when a search term does not match any items, the page displays "No result found"
          cy.get('[data-testid="search-input"]').clear();
          cy.get('[data-testid="search-input"]').type('yhs');
          cy.get('[data-testid="search-input"]').type('{enter}');
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

          // 6. Verify header and footer exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');

          // 7. Verify search results should be shown even for incorrectly spelled queries if we have suggestions for correction
          cy.get('[data-testid="search-input"]').clear();
          cy.get('[data-testid="search-input"]').type('lokistics');
          cy.get('[data-testid="handle-search"]').click();
          cy.get('.searchResult__usgPF').should('be.visible');

          // 8. Verify when the user starts typing in the search box, auto-complete suggestions should appear
          cy.get('[data-testid="search-input"]').clear();
          cy.get('[data-testid="search-input"]').type('log');
          cy.get('.searchSection__qMyFf').should('be.visible');

          // 9. Verify it should allow navigation through drop-down menus with "up" and "down" arrow keys
          cy.get('[data-testid="search-input"]').clear();
          cy.get('[data-testid="search-input"]').type('log');
          cy.get('[data-testid="search-input"]', { timeout: 2000 }).should('be.visible').focus();

          cy.get('[data-testid="search-input"]').type('{downarrow}'); // Move to the first suggestion
          cy.get('#search-suggestion-1', { timeout: 2000 }).should('be.visible');

          cy.get('[data-testid="search-input"]').type('{downarrow}'); // Move to the second suggestion
          cy.get('#search-suggestion-2', { timeout: 2000 }).should('be.visible');

          cy.get('[data-testid="search-input"]').type('{downarrow}'); // Move to the third suggestion
          cy.get('#search-suggestion-3', { timeout: 2000 }).should('be.visible');

          cy.get('[data-testid="search-input"]').type('{uparrow}'); // Move back to the second suggestion
          cy.get('#search-suggestion-2', { timeout: 2000 }).should('be.visible');

          cy.get('[data-testid="search-input"]').type('{uparrow}'); // Move back to the first suggestion
          cy.get('#search-suggestion-1', { timeout: 2000 }).should('be.visible');

          // 10. Verify it should include tags in search results when searching by tag and shown in the result
          cy.get('[data-testid="search-input"]').clear();
          cy.get('[data-testid="search-input"]').type('Test1 Amni');
          cy.get('[data-testid="handle-search"]').click();

          cy.get('.searchResult__usgPF')
            .invoke('text')
            .should((text) => {
              expect(text.trim()).to.include('How one entrepreneur leapt into the global marketplace');
            });
        });
      });
    });
  });
});
