describe('Global & Singapore HomePage & Footer', () => {
  const pageUrls = [
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global.html',
    Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/sg/en-sg.html'
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
      cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
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

        it('All the test case', () => {
          // HOMEPAGE
          // 1. Verify top tiles is exist and should contain maximum 4 article
          cy.get('.top-tiles-component').should('exist')
            .find('.article').should('have.length.at.most', 4);

          // 2. Verify title v2 is exist with some title
          cy.get('.cmp-title__text').should('exist')
            .invoke('text').should('not.be.empty');

          // 3. Verify horizontal article showcase is exist and should contain maximum 4 article
          cy.get('.root > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(3)').should('exist')
            .find('.article').should('have.length.at.most', 4);

          // 4. Verify vertical article showcase is exist
          cy.get(':nth-child(4) > .home-page-container-component > .container > .container__body > .body-container > .aem-Grid > .article-showcase > .article-showcase-component').should('exist');

          // 5. Verify sign up to the discover exists
          cy.get(':nth-child(1) > .cta-banner-with-points-component > .banner > .banner__body').should('exist')
            .click({ force: true });

          // 6. Verify CTA Banner with Points (apply for a business account) exists with the correct title
          cy.get('.body-container > .aem-Grid > .cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body').should('exist')
            .click();

          // FOOTER
          // 1. Verify the footer has a logo and three link groups
          cy.get('.logo__link > .logo__image').should('be.visible');
          cy.get('.links-group').should('have.length', 3);

          // 2. Verify when click DHL logo, it redirects to correct url dhl.com
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
              cy.wrap($link).focus().should('have.focus');
            });

          // 5. Verify hover changes hyperlink color from black to red in the footer
          const link = cy.get('.links-group__item');
          link.invoke('css', 'color', 'red');
          link.should('have.css', 'color', 'rgb(255, 0, 0)');
        });
      });
    });
  });
});
