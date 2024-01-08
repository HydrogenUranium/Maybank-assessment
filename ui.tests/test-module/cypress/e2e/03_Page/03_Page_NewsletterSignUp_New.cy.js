describe('Subscribe newsletter page', () => {

const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/newsletter-sign-up.html';

beforeEach(() => {
    cy.visit(pageUrl);
    //cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
    cy.AEMLogin(Cypress.env('AEM_PUBLISH_USERNAME'), Cypress.env('AEM_PUBLISH_PASSWORD'));
  });


  it('Verify the title contains the correct text "Subscribe for the latest insights"', () => {

    //cy.get('#onetrust-accept-btn-handler').click();
      cy.get('.cmp-title__text').contains('Subscribe for the latest insights')
      cy.wait (2000);
      //cy.get(data.AcceptAll_cookies).click();
  });


  it('Verify if all fields are present', () => {
      cy.get('.cmp-title__text').should('exist');
      cy.get('.landing-points-component').should('exist');
      cy.get('#Email').should('exist');
      cy.get('#suspectCountry').should('exist');
      cy.get('.mktoButton').should('exist');
  });


   it('Verify the form submits successfully when all fields are filled out correctly', () => {

       // Fill in the form fields
       cy.get('#Email').type('test@gmail.com');
       cy.get('#suspectCountry').select('Afghanistan');
       // Submit the form
       cy.get('.mktoButton').click();
       // Verify redirection to a success page
       cy.url().should('include', 'https://www.dhl.com/discover/en-global/newsletter-sign-up/newsletter-thanks');
   });


    it('Verify that an error message "This field is required" is displayed when a required field is left blank', () => {
       cy.get('#Email').type('test@gmail.com');
       cy.get('.mktoButton').click();
       cy.get('#ValidMsgsuspectCountry').should('be.visible').and('contain', 'This field is required.') ;

    });

   it('Verify an error message is displayed for each field when the input is invalid (e.g., an email field without an @', () => {
        cy.get('#Email').type('test');
        cy.get('.mktoButton').click();
        cy.get('#ValidMsgEmail.mktoErrorMsg').should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com') ;
    });





   });