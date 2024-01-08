describe('Open An Account Marketo page', () => {

const pageUrl = Cypress.env('AEM_PUBLISH_URL') + '/content/dhl/global/en-global/open-an-account.html';
const testText = 'THIS IS FOR TEST PLEASE IGNORE';

beforeEach(() => {
    cy.visit(pageUrl);
    cy.get("button#onetrust-accept-btn-handler").contains("Accept All").click();
  });

  it('Verify the title contains the correct text "Open An Account"', () => {
      //cy.get('#onetrust-accept-btn-handler').click();
      cy.get('#title-v2-acf2487a6a').contains('Open a Business Account')

  });

  it('Marketo form is present', () => {
              cy.get(".marketoForm")
              .should("not.be.empty")
              .should("be.visible");
      });

    it('Verify if all fields are present', () => {

        cy.get('#LblisBusiness').should('exist');
        cy.get('#suspectCompanyname').should('exist');
        cy.get('#FirstName').should('exist');
        cy.get('#LastName').should('exist');
        cy.get('#Email').should('exist');
        cy.get('#suspectAddress').should('exist');
        cy.get('#suspectPostalCode').should('exist');
        cy.get('#suspectCity').should('exist');
        cy.get('#suspectCountry').should('exist');
        cy.get('#Phone').should('exist');
        cy.get('#shippingfrequency').should('exist');
        cy.get('.mktoButton').should('exist');

        });


      it('Verify an error message is displayed for each field when the input is invalid (e.g., an email field, a phone number field with non-numeric characters)', () => {

                  cy.get('#LblisBusiness').click();
                  cy.get('#suspectCompanyname').type(testText);
                  cy.get('#FirstName').type(testText);
                  cy.get('#LastName').type(testText);
                  cy.get('#Email').type('test');
                  cy.get('#suspectAddress').type(testText);
                  cy.get('#suspectPostalCode').type(testText);
                  cy.get('#suspectCity').type(testText);
                  cy.get('#suspectCountry').select('Albania');
                  cy.get('#Phone').type('TEST');
                  cy.get('#shippingfrequency').select('One-off');
                  cy.get('.mktoButton').click();
                  cy.get('#ValidMsgEmail').should('be.visible').and('contain', 'Must be valid email.','example@yourdomain.com');
                  cy.get('#Email').type('test@gmail.com');
                  cy.get('.mktoButton').click();
                  cy.get('#ValidMsgPhone').should('be.visible').and('contain', 'Must be a phone number.','503-555-1212');
           });


     it('Verify the form submits successfully when all fields are filled out correctly', () => {

                 const testText = 'THIS IS FOR TEST PLEASE IGNORE';
                 cy.get('#LblisBusiness').click();
                 cy.get('#suspectCompanyname').type(testText);
                 cy.get('#FirstName').type(testText);
                 cy.get('#LastName').type(testText);
                 cy.get('#Email').type('test@gmail.com');
                 cy.get('#suspectAddress').type(testText);
                 cy.get('#suspectPostalCode').type(testText);
                 cy.get('#suspectCity').type(testText);
                 cy.get('#suspectCountry').select('Albania');
                 cy.get('#Phone').type('111111');
                 cy.get('#shippingfrequency').select('One-off');
                 cy.get('.mktoButton').click();
             });

});
