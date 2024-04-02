describe('Category Landing Page', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/small-business-advice.html'

  beforeEach(() => {
    cy.visit(pageUrl)
    cy.get("button#onetrust-accept-btn-handler")
      .contains("Accept All")
      .click()
  })

  // Verify breadcrumb existence
  it('1.Verify breadcrumb is exist', function() {
    cy.get('.cmp-breadcrumb__list')
      .should('exist')
  })

  // Verify Article Carousel existence and text
  it('2.Verify Article Carousel are exist with some text', function() {
    cy.get('.article-carousel')
      .should('exist')
    cy.get('.article-carousel_pageTitle')
      .should('exist')
  })

  // Verify Article Teaser existence
  it('3.Verify Article Teaser is exist', function() {
    cy.get('.cmp-teaser')
      .should('exist')
  })

  // Verify Article Teaser transition slides
  it('4.Verify Article Teaser automatically transition slides', function() {
    cy.get('.cmp-carousel__item--active .cmp-image__image')
      .should('be.visible')
      .then(($img) => {
        const initialSrc = $img.prop('src')
        cy.wait(5000)
        cy.get('.cmp-carousel__item--active .cmp-image__image')
          .should('be.visible')
          .should(($imgAfter) => {
            expect($imgAfter.prop('src')).not.to.eq(initialSrc)
          })
      })
  })

  // Verify Article Teaser content
  it('5.Verify Article Teaser consist 5 articles with titles and category tag in each', function() {
    cy.get('.cmp-teaser')
      .should('have.length', 5)
    cy.get('.cmp-teaser')
      .each(($el, index, $list) => {
        cy.wrap($el)
          .find('.cmp-teaser__title')
          .should('exist')
        cy.wrap($el)
          .find('.cmp-teaser__article-category-tag')
          .should('exist')
      })
  })

  // Verify Article Grid V2 existence
  it('6.Verify Article Grid V2 is exist', function() {
    cy.get('.articleGrid__O92s5')
      .should('exist')
  })

  // Verify category in Article Grid V2 can be horizontally scrolled
  it('7.Verify category in Article Grid V2 can be horizontal scroll', function() {
    cy.get('.articleGridCategories__ouITc')
      .then($el => {
        expect($el[0].scrollWidth).to.be.gt($el[0].clientWidth)
      })
  })

  // Verify Show More button functionality
  it('8.Verify Show More button is exist and clickable. When click the button, it load additional 2 row of article', function() {
    cy.viewport('macbook-11')
    cy.get('.articleCard__Y5mno')
      .should('have.length', 8)
    cy.get('.articleGridShowMoreButton__NntBo')
      .should('exist')
      .should('be.visible')
      .click()
    cy.get('.articleCard__Y5mno')
      .should('have.length', 16)
  })

   it('9.Verify Recommended sort order is the default option', function() {
      cy.get('.sort__Bvp05').should('contain', 'Recommended')
    })

    it('10.Verify CTA Banner is exist and the button is clickable. When click the button, it landed on the correct page', function() {
      cy.get('.cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body').should('exist')
      cy.get('.cta-banner-with-points > .cta-banner-with-points-component > .banner > .banner__body > .banner__body__button').click()
      cy.url().should('include', `${Cypress.env('AEM_PUBLISH_URL')}/discover/en-global/newsletter-sign-up`);
    })

  // Verify header and footer existence
  it('11.Verify  header and footer are exist', function() {
    cy.get('.headerV2-wrapper')
      .should('exist')
    cy.get('.footer-container')
      .should('exist')
  })
})