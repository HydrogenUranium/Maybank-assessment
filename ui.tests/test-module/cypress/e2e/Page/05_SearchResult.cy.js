describe('Global & Singapore Search Result Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/search-results.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/search-results.html'
  ];

  // Define selectors as constants
  const selectors = {
    searchFormTitle: '.searchFormTitle__QAA_R',
    searchInput: '[data-testid="search-input"]',
    searchResultTitle: '.searchFormDetails__Id4pi > b',
    noResultFound: '.searchResult__usgPF > :nth-child(2) > :nth-child(1)',
    popularSearchTag: '.trending__tEuuZ > :nth-child(2)',
    showMoreResultsButton: '.searchResultButton__FxQve',
    header: '.header-wrapper',
    footer: '.footer-container',
    searchSuggestion: '.searchSection__qMyFf',
    searchResult: '.searchResult__usgPF',
    searchSuggestionItem1: '#search-suggestion-1',
    searchSuggestionItem2: '#search-suggestion-2',
    searchSuggestionItem3: '#search-suggestion-3',
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.acceptCookies();
    });

    const viewports = ['iphone-6', 'ipad-2', [1024, 768]];

    viewports.forEach((viewport, vIndex) => {
      context(`Testing on ${viewport}`, () => {
        beforeEach(() => {
          cy.handleViewport(viewport, vIndex);
        });

        it('Test Case', function () {
          // 1. Verify search result page loads successfully without any errors
          cy.get(selectors.searchFormTitle).should('contain', 'Search Results');

          // 2. Verify that search functionality works correctly, meaning it returns relevant results based on the provided search term
          cy.get(selectors.searchInput, {force: true}).clear();
          cy.get(selectors.searchInput, {force: true}).type('Covid');
          cy.get(selectors.searchInput).type('{enter}');
          cy.get(selectors.searchResultTitle).should('contain', 'Covid');

          // 3. Verify that when a search term does not match any items, the page displays "No result found"
          cy.get(selectors.searchInput).clear();
          cy.get(selectors.searchInput).type('yhs');
          cy.get(selectors.searchInput).type('{enter}');
          cy.exist(selectors.noResultFound);

          // 4. Verify when clicking one of the popular searches (yellow tags), it displays the articles
          cy.get(selectors.popularSearchTag).click();
          cy.get(selectors.noResultFound).each(($el) => {
            cy.wrap($el).should('be.visible');
          });

          // 5. Verify when clicking "Show more result" button, it displays the list of articles
          cy.get(selectors.popularSearchTag).click();
          cy.get(selectors.showMoreResultsButton).click();
          cy.get(selectors.noResultFound).each(($el) => {
            cy.wrap($el).should('be.visible');
          });

          // 6. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);

          // 7. Verify search results should be shown even for incorrectly spelled queries if we have suggestions for correction
          cy.get(selectors.searchInput).clear();
          cy.get(selectors.searchInput).type('lokistics');
          cy.get('[data-testid="handle-search"]').click();
          cy.get(selectors.searchResult).should('be.visible');

          // 8. Verify when the user starts typing in the search box, auto-complete suggestions should appear
          cy.get(selectors.searchInput).clear();
          cy.get(selectors.searchInput).type('log');
          cy.get(selectors.searchSuggestion).should('be.visible');

          // 9. Verify it should allow navigation through drop-down menus with "up" and "down" arrow keys
          cy.get(selectors.searchInput).clear();
          cy.get(selectors.searchInput).type('log');
          cy.get(selectors.searchInput, { timeout: 2000 }).should('be.visible').focus();

          cy.get(selectors.searchInput).type('{downarrow}'); // Move to the first suggestion
          cy.get(selectors.searchSuggestionItem1, { timeout: 2000 }).should('be.visible');

          cy.get(selectors.searchInput).type('{downarrow}'); // Move to the second suggestion
          cy.get(selectors.searchSuggestionItem2, { timeout: 2000 }).should('be.visible');

          cy.get(selectors.searchInput).type('{downarrow}'); // Move to the third suggestion
          cy.get(selectors.searchSuggestionItem3, { timeout: 2000 }).should('be.visible');

          cy.get(selectors.searchInput).type('{uparrow}'); // Move back to the second suggestion
          cy.get(selectors.searchSuggestionItem2, { timeout: 2000 }).should('be.visible');

          cy.get(selectors.searchInput).type('{uparrow}'); // Move back to the first suggestion
          cy.get(selectors.searchSuggestionItem1, { timeout: 2000 }).should('be.visible');

          // 10. Verify it should include tags in search results when searching by tag and shown in the result
          cy.get(selectors.searchInput).clear();
          cy.get(selectors.searchInput).type('Test1 Amni');
          cy.get('[data-testid="handle-search"]').click();

          cy.get(selectors.searchResult)
            .invoke('text')
            .should((text) => {
              expect(text.trim()).to.include('How one entrepreneur leapt into the global marketplace');
            });
        });
      });
    });
  });
});