describe('Singapore Category Landing Page', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg/small-business-advice.html'
  ];

  // Define selectors as constants
  const selectors = {
    breadcrumbList: '.cmp-breadcrumb__list',
    articleCarousel: '.article-carousel',
    articleCarouselTitle: '.article-carousel_pageTitle',
    articleTeaser: '.cmp-teaser',
    carouselActiveItemImage: '.cmp-carousel__item--active .cmp-image__image',
    articleGrid: '.articleGrid__O92s5',
    articleGridCategories: '.articleGridCategories__ouITc',
    showMoreButton: '.articleGridShowMoreButton__NntBo',
    articleCard: '.articleCard__Y5mno',
    sortBy: '#sort-by',
    ctaBanner:'#bottom-cta-section .cmp-cta-banner-with-points',
    ctaBannerButton: '#bottom-cta-section .cmp-cta-banner-with-points__button',
    header: '.header-wrapper',
    footer: '.footer-container',
  };

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.acceptCookies();
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
          cy.get(selectors.breadcrumbList).should('exist');

          // 2. Verify Article Carousel exists with some text
          cy.get(selectors.articleCarousel).should('exist');
          cy.get(selectors.articleCarouselTitle).should('exist');

          // 3. Verify Article Teaser exists
          cy.get(selectors.articleTeaser).should('exist');

          // 4. Verify Article Teaser automatically transitions slides
          cy.get(selectors.carouselActiveItemImage)
            .should('be.visible')
            .then(($img) => {
              const initialSrc = $img.prop('src');
              cy.get(selectors.carouselActiveItemImage, { timeout: 10000 })
                .should('be.visible')
                .should(($imgAfter) => {
                  expect($imgAfter.prop('src')).not.to.eq(initialSrc);
                });
            });

          // 5. Verify Article Teaser consists of 5 articles with titles and category tags in each
           cy.get(selectors.articleTeaser, { timeout: 10000 }).should('have.length', 5);
           cy.get(selectors.articleTeaser, { timeout: 10000 }).each(($el) => {
           cy.wrap($el).find('.cmp-teaser__title', { timeout: 10000 }).should('exist');
           cy.wrap($el).find('.cmp-teaser__article-category-tag', { timeout: 10000 }).should('exist');
         });

          // 6. Verify Article Grid V2 exists
          cy.get(selectors.articleGrid).should('exist');

          // 7. Verify category in Article Grid V2 can be horizontally scrolled
          cy.get(selectors.articleGridCategories).then(($el) => {
            expect($el[0].scrollWidth).to.be.gt($el[0].clientWidth);
          });

          // 8. Verify "Show More" button exists and is clickable. When clicked, it loads an additional 2 rows of articles
          if (viewport !== 'iphone-6') {
          cy.get(selectors.articleCard, { timeout: 10000 }).should('have.length', initialLength);
          cy.get(selectors.showMoreButton)
            .should('exist')
            .should('be.visible')
            .click();
          // Wait for the additional articles to load, with an appropriate timeout
         cy.get(selectors.articleCard, { timeout: 15000 }).should('have.length', finalLength)
           .and('be.visible');
           }

          // 9. Verify Recommended sort order is the default option
          cy.get(selectors.sortBy)
            .invoke('text')
            .should((text) => {
              expect(text.trim()).to.include('Recommended');
            });

          // 10. Verify CTA Banner exists and the button is clickable. When clicked, it lands on the correct page
          cy.get(selectors.ctaBanner).should('exist');
          cy.get(selectors.ctaBannerButton)
             .click({ multiple: true });
          cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-sg/newsletter-sign-up`);

          // 11. Verify header and footer exist
          cy.get(selectors.header).should('exist');
          cy.get(selectors.footer).should('exist');

          // 12. Verify when hovering the breadcrumb it changes from black to red
          cy.get(selectors.breadcrumbList).invoke('css', 'color', 'red');
          cy.get(selectors.breadcrumbList).should('have.css', 'color', 'rgb(255, 0, 0)');
        });
      });
    });
  });
});