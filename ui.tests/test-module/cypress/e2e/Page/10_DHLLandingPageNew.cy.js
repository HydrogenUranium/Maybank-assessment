describe('DHL Landing Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page--DHL-Landing-Page.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/automation-testing/Page--DHL-Landing-Page.html'
  ];

  // Define selectors as constants
  const selectors = {
    title: '.title',
    titleV2: '.title-v2',
    downloadAsset: ':nth-child(5) > .download > .cq-dd-file',
    downloadButton: ':nth-child(5).button > .cmp-button',
    header: '.header-wrapper',
    footer: '.footer-container'
  };

  pageUrls.forEach((pageUrl) => {
    beforeEach(() => {
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

          // 2. Verify text exists
          cy.exist(selectors.titleV2);

          // 3. Verify download asset exists and when clicked, it redirects to the correct page
          cy.get('body').then(($body) => {
            if ($body.find(selectors.downloadAsset).length) {
              cy.exist(selectors.downloadAsset);
              cy.get(selectors.downloadAsset).click();
            } else {
              cy.exist(selectors.downloadButton);
              cy.get(selectors.downloadButton).click({force: true});
            }
          });
          cy.url().should('match', new RegExp(`${Cypress.env('AEM_PUBLISH_URL')}/discover/(en-global|en-sg)/open-an-account`));

          // 4. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);
        });
      });
    });
  });
});