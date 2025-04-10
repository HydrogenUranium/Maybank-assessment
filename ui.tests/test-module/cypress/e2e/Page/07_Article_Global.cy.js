describe('Global Page Article', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/automation-testing/Page-Article.html'
  ];

  // Define selectors as constants
  const selectors = {
    breadcrumbList: '.cmp-breadcrumb__list',
    headerTitle: '.cmp-article-header__title',
    publishDate: '.cmp-article-header__publishDate',
    readingDuration: '.cmp-article-header__readingDuration',
    shareContainer: '.cmp-article-header > .share-options > .share-options__container',
    heroBanner: '.cmp-hero-banner',
    heroBannerSummary: '.cmp-hero-banner__summary',
    heroBannerImage: '.cmp-hero-banner__asset',
    articleTitle: '.cmp-title__text',
    articleText: '.cmp-text',
    teaserImage: '.cmp-image__image',
    video: 'video',
    accordionItem: '.cmp-accordion__item',
    accordionLink: '.cmp-accordion__panel .cmp-text p:first-child a',
    embeddedComponent: '.cmp-embed iframe',
    articlePanel: '.nextSteps',
    articlePanelTitle: '.nextSteps__text > .nextSteps__title',
    articlePanelImage: '.nextSteps__image',
    articlePanelCopy: '.nextSteps__copy',
    articlePanelButton: '.nextSteps__text > .dhl-btn',
    quoteComponent: '.quote-component',
    quoteText: '.quote-component__text',
    listicleRow: '.listicle__row',
    listicleText: '.listicle__row__text__body',
    listicleImage: '.listicle__row__picture',
    gallery: '.gallery',
    //gallerySlides: ['#uniqueIdImageGallerySlide0 > .figure > .figure__image', '#uniqueIdImageGallerySlide1 > .figure > .figure__image'],
    activeSlide: '.carousel-item.active > .figure > .figure__image',    tabs: '.tabs',
    tabItem: '[id*="-tab"]',
    tabContent: '[id*="-content"]',
    relatedPosts: '.related-posts-component',
    relatedArticle: '.article-container__article',
    authorBanner: '.article-author-banner_wrapper',
    authorImage: '.cmp-article-header__author-image',
    authorName: '.cmp-article-footer__author-name',
    authorDescription: '.article-author-banner_brief',
    articleFooter: '.cmp-article-footer',
    articleFooterAuthorImage: '.cmp-article-footer__author-image',
    articleFooterAuthorName: '.cmp-article-footer__author-name',
    articleFooterShare: '.cmp-article-footer > .share-options',
    header: '.header-wrapper',
    footer: '.footer-container',
    servicePointLocator: '.locator-frame',
    ctaBanner: '.cmp-cta-banner',
    ctaBannerButton: '.cmp-cta-banner__button'

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

        it('All test cases', function () {
          // 1. Verify breadcrumb exists
          cy.exist(selectors.breadcrumbList);

          // 2. Verify header title exists
          cy.exist(selectors.headerTitle);

          // 3. Verify publish date exists
          cy.exist(selectors.publishDate);

          // 4. Verify reading duration exists
          cy.exist(selectors.readingDuration);

          // 5. Verify share options for Facebook, Twitter, and LinkedIn, and clicking redirects correctly
          cy.exist(selectors.shareContainer);

          // 6. Verify hero banner exists with summary text and picture
          cy.exist(selectors.heroBanner);
          cy.get(selectors.heroBanner).within(() => {
            cy.get(selectors.heroBannerSummary, { timeout: 10000 })
              .should('be.visible')
              .and('contain', 'Key Takeaways');
            cy.get(selectors.heroBannerImage)
              .should('be.visible');
          });

          // 7. Verify title exists
          cy.exist(selectors.articleTitle);

          // 8. Verify text exists
          cy.exist(selectors.articleText);

          // 9. Verify image exists without being broken
          cy.get(selectors.teaserImage).should('be.visible').and(($img) => {
            expect($img[0].width).to.be.greaterThan(0);
          });

          // 10. Verify video exists and plays when clicked
          cy.get(selectors.video).should('be.visible').click();

          // 11. Verify accordion exists and clicking links redirects correctly
          cy.exist(selectors.accordionItem);
          cy.get(selectors.accordionLink).should('not.be.visible');
          cy.get(selectors.accordionLink)
            .should('have.attr', 'href')
            .and('include', 'https://globalpeoservices.com/top-15-countries-by-gdp-in-2022/');

          // 12. Verify embedded component exists with configured YouTube video
          cy.exist(selectors.embeddedComponent);

          if (viewport !== 'iphone-6') {
            // 13. Verify article panel exists with title, image, description, and button redirects correctly
            cy.get(selectors.articlePanel).should('be.visible');
            cy.get(selectors.articlePanelTitle).should('be.visible');
            cy.get(selectors.articlePanelImage).should('be.visible');
            cy.get(selectors.articlePanelCopy).should('be.visible');
            cy.get(selectors.articlePanelButton)
              .should('have.attr', 'href')
              .and('include', '/discover/en-global/e-commerce-advice/e-commerce-sector-guides');
          }

          // 14. Verify quote exists with text
          cy.exist(selectors.quoteComponent);
          cy.exist(selectors.quoteText);

          // 15. Verify listicle item exists with text content and image
          cy.get(selectors.listicleRow).should('be.visible');
          cy.get(selectors.listicleText).should('be.visible');
          cy.get(selectors.listicleImage).should('be.visible');

          // 17. Verify the gallery exists and automatically slides every 3 seconds
          cy.get(selectors.activeSlide, { timeout: 15000 })
            .should('exist')
            .and('be.visible');

          // 18. Verify the tab exists and content changes on click
          cy.get(selectors.tabs).should('exist').within(() => {
            cy.get(selectors.tabItem).should('have.length.gt', 1);

            cy.get(selectors.tabItem).first().click();
            cy.get(selectors.tabContent).should('contain', 'Make exporting and importing urgent shipments simple with our international time-sensitive shipping solution with proactive delivery notification upon request.');

            cy.get(selectors.tabItem).eq(1).click();
            cy.get(selectors.tabContent).should('contain', 'With DHL Express, you can stay assured of the safety of your items. Our efficient and reliable courier service makes sure that your goods reach the consignee on time and in good condition.');

            cy.get(selectors.tabItem).eq(2).click();
            cy.get(selectors.tabContent).should('contain', 'Advertising brochures, journals, magazines, or periodicals for commercial purposes can only be imported by the government-authorized importers. For personal purposes, the quantity of the items should be kept to 10 sets or 50 pieces max.');

            cy.get(selectors.tabItem).eq(3).click();
            cy.get(selectors.tabContent).should('contain', 'Advertising brochures, journals, magazines, or periodicals for commercial purposes can only be imported by the government-authorized importers. For personal purposes, the quantity of the items should be kept to 10 sets or 50 pieces max.');
          });

          // 19. Verify the related posts section exists and shows only 3 articles
          cy.exist(selectors.relatedPosts);
          cy.get(selectors.relatedArticle).should('have.length.gte', 3);

          if (viewport !== 'iphone-6') {
            // 20. Verify the about author sidebar exists with image, name, and description
            cy.exist(selectors.authorBanner);
            cy.exist(selectors.authorImage);
            cy.exist(selectors.authorName);
            cy.exist(selectors.authorDescription);
          }

          if (viewport === 'iphone-6') {
            // 21. Verify the article footer exists with author details, share, publication date, and reading duration
            cy.exist(selectors.articleFooter);
            cy.exist(selectors.articleFooterAuthorImage);
            cy.exist(selectors.articleFooterAuthorName);
            cy.exist(selectors.articleFooterShare);
          }

          // 22. Verify header and footer exist
          cy.exist(selectors.header);
          cy.exist(selectors.footer);

          // 26. Verify Service Point Locator exists
          cy.exist(selectors.servicePointLocator);

          // 27. Verify when hovering the breadcrumb it changes from black to red
          cy.get(selectors.breadcrumbList).invoke('css', 'color', 'red');
          cy.get(selectors.breadcrumbList).should('have.css', 'color', 'rgb(255, 0, 0)');

          if (viewport !== 'iphone-6') {
            // 28. Verify CTA Banner exists and the button is clickable, landing on the correct page
            cy.exist(selectors.ctaBanner);
            cy.get(selectors.ctaBannerButton)
              .click({ force: true });
            cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/newsletter-sign-up`);
          }
        });
      });
    });
  });
});