describe('Singapore Thank You Page Open An Account', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/open-an-account/thanks.html'
  ];

  // Define selectors as constants
  const selectors = {
    breadcrumbActiveItem: '.cmp-breadcrumb__item--active > span',
    pageTitleBold: 'h2>b',
    paragraph: 'p',
    header: '.header-wrapper',
    footer: '.footer-container',
    followUsSection: '.followUs',
    followUsFacebook: '.followUs__items > [href="https://www.facebook.com/DHLSG/"]',
    followUsYoutube: '.followUs__items > [href="https://www.youtube.com/@DHLExpressSG"]',
    followUsInstagram: '.followUs__items > [href="https://www.instagram.com/discoverbydhl/"]',
    followUsLinkedIn: '.followUs__items > [href="https://www.linkedin.com/company/dhl-express-singapore/"]',
    followUsTwitter: '.followUs__items > [href="https://twitter.com/DHLexpress"]'
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

        it('Test case', () => {
          // 1. Verify that the "Thank You" page loads successfully without any errors
          cy.get(selectors.breadcrumbActiveItem).should('contain', 'Thank you');

          // 2. Verify that the page title is correct with bold and matches the expected title
          cy.get(selectors.pageTitleBold).should('contain', 'Thank You for requesting a DHL EXPRESS BUSINESS ACCOUNT.')
            .and(($h2) => {
              expect($h2).to.have.css('font-weight', '700'); // find the bold
            });

          // 3. Verify text consist with some text
          cy.get(selectors.paragraph).should('exist');

          // 4. Verify header and footer are exist
          cy.get(selectors.header).should('exist');
          cy.get(selectors.footer).should('exist');

          // 5. Verify follow us section is exist
          cy.get(selectors.followUsSection).should('exist');

          // 6. Verify all the social media icon is clickable (Facebook, Youtube, Instagram, LinkedIn, Twitter)
          cy.get(selectors.followUsFacebook).should('have.attr', 'href');
          cy.get(selectors.followUsYoutube, { timeout: 2000 }).should('have.attr', 'href');
          cy.get(selectors.followUsInstagram, { timeout: 2000 }).should('have.attr', 'href');
          cy.get(selectors.followUsLinkedIn, { timeout: 2000 }).should('have.attr', 'href');
          cy.get(selectors.followUsTwitter, { timeout: 2000 }).should('have.attr', 'href');
        });
      });
    });
  });
});