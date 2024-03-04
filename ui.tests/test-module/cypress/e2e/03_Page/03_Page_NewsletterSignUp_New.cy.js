describe('Subscribe newsletter page', () => {
  const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/newsletter-sign-up.html';

  beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('1.Verify the title contains the correct text "Subscribe for the latest insights"', () => {
    cy.get('.cmp-title__text').should('exist');
    cy.wait (2000);
  });

  it('2.Verify if all fields are present', () => {
    cy.get('.cmp-title__text').should('exist');
    cy.get('.landing-points-component').should('exist');
    cy.get('#Email').should('exist');
    cy.get('#suspectCountry').should('exist');
    cy.get('.mktoButton').should('exist');
  });

  it('3.Verify the form submits successfully when all fields are filled out correctly', () => {
    // Fill in the form fields
    cy.get('#Email').type('test@gmail.com');
    cy.get('#suspectCountry').select('Afghanistan');
    // Submit the form
    cy.get('.mktoButton').click();
    cy.wait (2000);
    // Verify redirection to a success page
    cy.get('#ValidMsg').should('not.exist');
  });

  it('4.Verify that an error message "This field is required" is displayed when a required field is left blank', () => {
    cy.get('#Email').type('test@gmail.com');
    cy.get('.mktoButton').click();
    cy.get('#ValidMsgsuspectCountry').should('be.visible').and('contain', 'This field is required.') ;
  });

  it('5.Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @', () => {
    cy.get('#Email').type('test');
    cy.get('.mktoButton').click();
    cy.get('#ValidMsgEmail.mktoErrorMsg').should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com') ;
  });

});
