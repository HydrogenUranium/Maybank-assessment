describe('Global Thank You Page Newsletter', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/newsletter-sign-up/newsletter-thanks.html'
  ];

  // Define selectors as constants
  const selectors = {
    breadcrumbActiveItem: '.cmp-breadcrumb__item--active > span',
    pageTitleBold: 'h2 b',
    paragraph: 'p',
    header: '.header-wrapper',
    footer: '.footer-container',
    recommendedSection: '.cmp-article-showcase__articles',
    recommendedArticle: '.article-items'
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
          if (typeof viewport === 'string') {
            cy.viewport(viewport);
          } else {
            cy.viewport(viewport[0], viewport[1]);
          }

          cy.log(`Running tests for viewport at index ${vIndex}: ${viewport}`);
        });

        it('All test case', function () {
          // 1. Verify that the "Thank You" page loads successfully without any errors
          cy.get(selectors.breadcrumbActiveItem).should('contain', 'Thank you');

          // 2. Verify that the page title is correct with bold and matches the expected title
          cy.get(selectors.pageTitleBold, { timeout: 10000 })
            .should('contain', 'Thank you - just one more step!')
            .and(($h2) => {
              expect($h2).to.have.css('font-weight', '700'); // check for bold text
            });

          // 3. Verify text consist with some text
          cy.get(selectors.paragraph).should('exist');

          // 4. Verify header and footer are exist
          cy.get(selectors.header).should('exist');
          cy.get(selectors.footer).should('exist');

          // 5. Verify Recommended section is exist and contain maximum 4 articles
          cy.get(selectors.recommendedSection).should('exist')
            .find(selectors.recommendedArticle).should('have.length.at.most', 4);
        });
      });
    });
  });
});