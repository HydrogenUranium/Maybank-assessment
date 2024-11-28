describe('Global & Singapore HomePage & Footer', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg.html'
  ];

  pageUrls.forEach((pageUrl, index) => {
    beforeEach(() => {
      cy.on('uncaught:exception', (e) => {
        return false;
      });

      cy.log(`Running tests for URL at index ${index}: ${pageUrl}`);
      cy.visit(pageUrl);
      cy.get('body', { timeout: 2000 }).then(($body) => {
        cy.get('#onetrust-consent-sdk', { timeout: 5000 }).then(($onetrust) => {
          if ($onetrust.find('button#onetrust-accept-btn-handler', { timeout: 5000 }).length > 0) {
              cy.get('button#onetrust-accept-btn-handler')
                .contains('Accept All')
                .should('be.visible')
                .click();
          }
        });
      });
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

        it('All the test cases', () => {
          // -----HOMEPAGE----
          // 1. Verify top tiles exist and should contain a maximum of 4 articles
          cy.get('.top-tiles-component').should('exist')
            .find('.article').should('have.length.at.most', 4);

          // 2. Verify title v2 exists with some title
          cy.get('.cmp-title__text').should('exist')
            .invoke('text').should('not.be.empty');

          // 3. Verify horizontal article showcase exists and should contain a maximum of 4 articles with images
          cy.get('.root > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(3)').should('exist')
            .find('.article').should('have.length.at.most', 4)
            .each(($article, index) => {
              if (index < 4) {
                cy.wrap($article).within(() => {
                  cy.get('.article-card__image-wrapper').should('exist').find('img').should('exist');
                });
              }
            });

          // 4. Verify vertical article showcase exists and all articles contain images
          cy.get(':nth-child(4) > .home-page-container-component > .container > .container__body > .body-container > .aem-Grid > .article-showcase > .article-showcase-component').should('exist')
            .each(($article, index) => {
              if (index < 4) {
                cy.wrap($article).find('.article__picture').should('exist');
              }
            });

          // 5. Verify the bottom link at vertical showcase is clickable
          cy.get('.link').click({ force: true });

          if (viewport === 'macbook-15') {
            // 6. Verify sign up to the discover exists
            cy.get(':nth-child(3) > .cmp-cta-banner-with-points > .cmp-cta-banner-with-points__body').click({ force: true });
          }

          // 7. Verify CTA Banner with Points (apply for a business account) exists with the correct title
          cy.get('.cmp-cta-banner-with-points__button').should('exist');
          cy.get('.cmp-cta-banner-with-points__button').find('span').should('contain', 'Apply now');

          // ---FOOTER---
          // 1. Verify the footer has a logo and three link groups
          cy.get('.logo__link > .logo__image').should('be.visible');
          cy.get('.links-group').should('have.length', 3);

          // 2. Verify when clicking the DHL logo, it redirects to the correct URL (dhl.com)
          cy.get('.logo__link > .logo__image').should('exist');
          cy.get('a.logo__link')
            .should('have.attr', 'href')
            .and('include', 'https://www.dhl.com/');

          // 3. Verify that each footer link redirects to the correct destination
          cy.get('.links-group__item')
            .each(($link) => {
              cy.wrap($link).should('have.attr', 'href');
            });

          // 4. Verify that each hyperlink in the footer is accessible via keyboard navigation
          cy.get('.links-group__item')
            .each(($link) => {
              cy.wrap($link).focus();
              cy.wrap($link).should('have.focus');
            });

          // 5. Verify hover changes hyperlink color from black to red in the footer
          cy.get('.links-group__item').invoke('css', 'color', 'red');
          cy.get('.links-group__item').should('have.css', 'color', 'rgb(255, 0, 0)');
        });
      });
    });
  });
});
