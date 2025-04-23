describe('Global & Singapore HomePage & Footer', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg.html'
  ];

  // Define selectors as constants
  const selectors = {
    topTilesComponent: '.cmp-top-tiles',
    article: 'article',
    cmpTitleText: '.cmp-title-v2__text',
    horizontalArticleShowcase: '.cmp-article-showcase.cmp-article-showcase--horizontal:first',
    articleCardImageWrapper: '.article-card__image-wrapper',
    articleShowcaseComponent: '.cmp-article-showcase:not(.cmp-article-showcase--horizontal):first',
    articlePicture: '.cmp-article-showcase__article-picture',
    verticalShowcaseLink: '.cmp-article-showcase__link',
    ctaBannerWithPoints: ':nth-child(3) > .cta-banner-with-points-component > .banner > .banner__body',
    bannerBodyButton: '.cta-banner-with-points > .cmp-cta-banner-with-points > .cmp-cta-banner-with-points__body > .cmp-cta-banner-with-points__button',
    footerLogo: '.logo__link > .logo__image',
    footerLinksGroup: '.links-group',
    footerLinkItem: '.links-group__item',
    footerLogoLink: 'a.logo__link'
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

        it('All the test cases', () => {
          // -----HOMEPAGE----
          // 1. Verify top tiles exist and should contain a maximum of 4 articles
          cy.get(selectors.topTilesComponent).should('exist')
            .find(selectors.article).should('have.length.at.most', 4);

          // 2. Verify title v2 exists with some title
          cy.get(selectors.cmpTitleText).should('exist')
            .invoke('text').should('not.be.empty');

          // 3. Verify horizontal article showcase exists and should contain a maximum of 4 articles with images
          cy.get(selectors.horizontalArticleShowcase).should('exist')
            .find(selectors.article).should('have.length.at.most', 4)
            .each(($article, index) => {
              if (index < 4) {
                cy.wrap($article).within(() => {
                  cy.exist(selectors.articleCardImageWrapper).find('img').should('exist');
                });
              }
            });

          // 4. Verify vertical article showcase exists and all articles contain images
          cy.get(selectors.articleShowcaseComponent).should('exist')
            .each(($article, index) => {
              if (index < 4) {
                cy.wrap($article).find(selectors.articlePicture).should('exist');
              }
            });

          // 5. Verify CTA Banner with Points (apply for a business account) exists with the correct title
          cy.exist(selectors.bannerBodyButton);
          cy.get(selectors.bannerBodyButton).find('span').should('contain', 'Apply now');

          // 6. Verify the bottom link at vertical showcase is clickable
          cy.get(selectors.verticalShowcaseLink).click({ force: true });

          if (viewport === 'macbook-15') {
            // 7. Verify sign up to the discover exists
            cy.get(selectors.ctaBannerWithPoints).click({ force: true });
          }



          // ---FOOTER---
          // 1. Verify the footer has a logo and three link groups
          cy.get(selectors.footerLogo).should('be.visible');
          cy.get(selectors.footerLinksGroup).should('have.length', 3);

          // 2. Verify when clicking the DHL logo, it redirects to the correct URL (dhl.com)
          cy.exist(selectors.footerLogo);
          cy.get(selectors.footerLogoLink)
            .should('have.attr', 'href')
            .and('include', 'https://www.dhl.com/');

          // 3. Verify that each footer link redirects to the correct destination
          cy.get(selectors.footerLinkItem)
            .each(($link) => {
              cy.wrap($link).should('have.attr', 'href');
            });

          // 4. Verify that each hyperlink in the footer is accessible via keyboard navigation
          cy.get(selectors.footerLinkItem)
            .each(($link) => {
              cy.wrap($link).focus();
              cy.wrap($link).should('have.focus');
            });

          // 5. Verify hover changes hyperlink color from black to red in the footer
          cy.get(selectors.footerLinkItem).invoke('css', 'color', 'red');
          cy.get(selectors.footerLinkItem).should('have.css', 'color', 'rgba(0, 0, 0, 0.9)');
        });
      });
    });
  });
});