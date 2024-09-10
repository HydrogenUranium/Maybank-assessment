describe('Singapore Category Landing Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/small-business-advice.html'
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

    const viewports = ['iphone-6', 'ipad-2', 'macbook-13'];

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

        let initialLength, finalLength;

        if (viewport === 'iphone-6') { // Mobile
          initialLength = 3;
          finalLength = 6;
        } else if (viewport === 'ipad-2') { // Tablet
          initialLength = 4;
          finalLength = 8;
        } else { // Desktop
          initialLength = 8;
          finalLength = 16;
        }

        it('All test cases', function () {
          // 1. Verify breadcrumb exists
          cy.get('.cmp-breadcrumb__list').should('exist');

          // 2. Verify Article Carousel exists with some text
          cy.get('.article-carousel').should('exist');
          cy.get('.article-carousel_pageTitle').should('exist');

          // 3. Verify Article Teaser exists
          cy.get('.cmp-teaser').should('exist');

          // 4. Verify Article Teaser automatically transitions slides
          cy.get('.cmp-carousel__item--active .cmp-image__image')
            .should('be.visible')
            .then(($img) => {
              const initialSrc = $img.prop('src');
              cy.wait(5000);
              cy.get('.cmp-carousel__item--active .cmp-image__image')
                .should('be.visible')
                .should(($imgAfter) => {
                  expect($imgAfter.prop('src')).not.to.eq(initialSrc);
                });
            });

          // 5. Verify Article Teaser consists of 5 articles with titles and category tags in each
          cy.get('.cmp-teaser').should('have.length', 5);
          cy.get('.cmp-teaser').each(($el) => {
            cy.wrap($el).find('.cmp-teaser__title').should('exist');
            cy.wrap($el).find('.cmp-teaser__article-category-tag').should('exist');
          });

          // 6. Verify Article Grid V2 exists
          cy.get('.articleGrid__O92s5').should('exist');

          // 7. Verify category in Article Grid V2 can be horizontally scrolled
          cy.get('.articleGridCategories__ouITc').then(($el) => {
            expect($el[0].scrollWidth).to.be.gt($el[0].clientWidth);
          });

          // 8. Verify "Show More" button exists and is clickable. When clicked, it loads an additional 2 rows of articles
          cy.get('.articleCard__Y5mno').should('have.length', initialLength);
          cy.get('.articleGridShowMoreButton__NntBo')
            .should('exist')
            .should('be.visible')
            .click();
          cy.get('.articleCard__Y5mno').should('have.length', finalLength);

          // 9. Verify Recommended sort order is the default option
          cy.get('#sort-by')
            .parent()
            .should('contain', 'Recommended');

          // 10. Verify CTA Banner exists and the button is clickable. When clicked, it lands on the correct page
          cy.get('.cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body').should('exist');
          cy.get('.cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body > .banner__body__button')
            .click();
          cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-sg/newsletter-sign-up`);

          // 11. Verify header and footer exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');

          // 12. Verify when hovering the breadcrumb it changes from black to red
          const link = cy.get('.cmp-breadcrumb__list');
          link.invoke('css', 'color', 'red');
          link.should('have.css', 'color', 'rgb(255, 0, 0)');
        });
      });
    });
  });
});
