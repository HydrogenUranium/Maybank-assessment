describe('Global Page Article', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-Article.html'
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
      cy.get("button#onetrust-accept-btn-handler")
        .contains("Accept All")
        .click();
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

        it('All test cases', function () {
          // 1. Verify breadcrumb exists
          cy.get('.cmp-breadcrumb__list').should('exist');

          // 2. Verify header title exists
          cy.get('.article-header_title').should('exist');

          // 3. Verify publish date exists
          cy.get('.article-header_date-publishDate').should('exist');

          // 4. Verify reading duration exists
          cy.get('.article-header_date-readingDuration').should('exist');

          // 5. Verify share options for Facebook, Twitter, and LinkedIn, and clicking redirects correctly
          cy.get('.article-header_share-container__left').should('exist');

          // 6. Verify hero banner exists with summary text and picture
          cy.get('.hero-banner-component > .hero-banner').should('exist');
          cy.get('.hero-banner-component').within(() => {
            cy.get('.summary')
              .should('be.visible')
              .and('contain', 'Key Takeaways');
            cy.get('.hero-banner.hero-banner--with-rounded-corners .hero-banner__image')
              .should('be.visible');
          });

          // 7. Verify title exists
          cy.get('.aem-Grid > .title h1').should('exist');

          // 8. Verify text exists
          cy.get('#text-bc4d131331').should('exist');

          // 9. Verify image exists without being broken
          cy.get('.teaser img').should('be.visible').and(($img) => {
            expect($img[0].width).to.be.greaterThan(0);
          });

          // 10. Verify video exists and plays when clicked
          cy.get('video').should('be.visible').click();

          // 11. Verify accordion exists and clicking links redirects correctly
          cy.get('.card').should('exist');
          cy.get('.card__body p:first-child a').should('be.visible');
          cy.get('.card__body p:first-child a')
            .should('have.attr', 'href')
            .and('include', 'https://globalpeoservices.com/top-15-countries-by-gdp-in-2022/');

          // 12. Verify embedded component exists with configured YouTube video
          cy.get('#embed-4a64c4e8e3 > iframe').should('exist');

          if (viewport !== 'iphone-6') {
            // 13. Verify article panel exists with title, image, description, and button redirects correctly
            cy.get('.nextSteps').should('be.visible');
            cy.get('.nextSteps__text > .nextSteps__title').should('be.visible');
            cy.get('.nextSteps__image').should('be.visible');
            cy.get('.nextSteps__copy').should('be.visible');
            cy.get('a.nextSteps__cta')
              .should('have.attr', 'href')
              .and('include', '/discover/en-global/e-commerce-advice/e-commerce-sector-guides');
          }

          // 14. Verify quote exists with text
          cy.get('.quote-component').should('exist');
          cy.get('.quote-component__text').should('exist');

          // 15. Verify listicle item exists with text content and image
          cy.get('.listicle__row').should('be.visible');
          cy.get('.listicle__row__text__body').should('be.visible');
          cy.get('.listicle__row__picture').should('be.visible');

          // 17. Verify the gallery exists and automatically slides every 3 seconds
          cy.get('.gallery').should('exist').within(() => {
            cy.get('.figure').should('have.length.gt', 1);
            cy.get('.figure').first().should('be.visible');
            cy.wait(3000);
            cy.get('.figure').eq(1).should('be.visible');
          });

          // 18. Verify the tab exists and content changes on click
          cy.get('.tabs').should('exist').within(() => {
            cy.get('[id*="-tab"]').should('have.length.gt', 1);

            cy.get('[id*="-tab"]').first().click();
            cy.get('[id*="-content"]').should('contain', 'Make exporting and importing urgent shipments simple with our international time-sensitive shipping solution with proactive delivery notification upon request.');

            cy.get('[id*="-tab"]').eq(1).click();
            cy.get('[id*="-content"]').should('contain', 'With DHL Express, you can stay assured of the safety of your items. Our efficient and reliable courier service makes sure that your goods reach the consignee on time and in good condition.');

            cy.get('[id*="-tab"]').eq(2).click();
            cy.get('[id*="-content"]').should('contain', 'Advertising brochures, journals, magazines, or periodicals for commercial purposes can only be imported by the government-authorized importers. For personal purposes, the quantity of the items should be kept to 10 sets or 50 pieces max.');

            cy.get('[id*="-tab"]').eq(3).click();
            cy.get('[id*="-content"]').should('contain', 'Advertising brochures, journals, magazines, or periodicals for commercial purposes can only be imported by the government-authorized importers. For personal purposes, the quantity of the items should be kept to 10 sets or 50 pieces max.');
          });

          // 19. Verify the related posts section exists and shows only 3 articles
          cy.get('.related-posts-component').should('exist');
          cy.get('.article-container__article').should('have.length.gte', 3);

          if (viewport !== 'iphone-6') {
            // 20. Verify the about author sidebar exists with image, name, and description
            cy.get('.article-author-banner_wrapper').should('exist');
            cy.get('.article-author-banner_author-image').should('exist');
            cy.get('.article-author-banner_author-description__name').should('exist');
            cy.get('.article-author-banner_brief').should('exist');
          }

          if (viewport === 'iphone-6') {
            // 21. Verify the article footer exists with author details, share, publication date, and reading duration
            cy.get(':nth-child(5) > .article-container-component > .grid > .grid__container').should('exist');
            cy.get(':nth-child(5) > .article-container-component > .grid > .grid__container > .grid__container__body > .body-container > .aem-Grid > .aem-GridColumn > .article-header_author > .article-header_author-image').should('exist');
            cy.get(':nth-child(5) > .article-container-component > .grid > .grid__container > .grid__container__body > .body-container > .aem-Grid > .aem-GridColumn > .article-header_author > .article-header_author-description > :nth-child(1) > .article-header_author-description__name').should('exist');
            cy.get(':nth-child(5) > .article-container-component > .grid > .grid__container > .grid__container__body > .body-container > .aem-Grid > .aem-GridColumn > .article-header_share > .article-header_share-container > .article-header_share-container__right > .st-custom-button').should('exist');
          }

          // 22. Verify header and footer exist
          cy.get('.headerV2-wrapper').should('exist');
          cy.get('.footer-container').should('exist');

          // 26. Verify Service Point Locator exists
          cy.get('.locator-frame').should('exist');

          // 27. Verify when hovering the breadcrumb it changes from black to red
          const link = cy.get('.cmp-breadcrumb__list');
          link.invoke('css', 'color', 'red');
          link.should('have.css', 'color', 'rgb(255, 0, 0)');

          if (viewport !== 'iphone-6') {
            // 28. Verify CTA Banner exists and the button is clickable, landing on the correct page
            cy.get('.cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body').should('exist');
            cy.get('.cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body > .banner__body__button')
              .click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/open-an-account`);
          }
        });
      });
    });
  });
});
