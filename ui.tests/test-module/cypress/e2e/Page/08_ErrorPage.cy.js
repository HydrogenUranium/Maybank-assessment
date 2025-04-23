describe('Global and Country Error Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--Error.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/Page--Error.html'
  ];

  // Define selectors as constants
  const selectors = {
    title: '.title',
    image: '.cmp-error-banner__image',
    errorButton: '.cmp-error-banner__button',
    header: '.header-wrapper',
    footer: '.footer-container',
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

        it('All test case', function () {
          // 1. Verify the error page consists of title
          cy.exist(selectors.title);

          // 2. Verify image exists without being broken
          cy.get(selectors.image).should('be.visible').and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });

          // 3. Verify button link is visible and when clicked, it redirects to the homepage
          cy.exist(selectors.errorButton);
          cy.get(selectors.errorButton).click();
          cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global`);

          // 4. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);
        });
      });
    });
  });
});