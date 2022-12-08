describe("Appointments", () => {
  beforeEach(() => {
    cy.request('GET', '/api/debug/reset');
    cy.visit("/");
    cy.contains('Monday');
  })

  it("should book an interview", () => {
    cy.get('.appointment__add-button')
      .first()
      .click();
    cy.get('[data-testid=student-name-input]')
      .type('Edgar Moo')
    cy.get('.interviewers__item').first()
      .click()
    cy.get('button').contains('Save')
      .click()
    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.contains(".appointment__card--show", "Edgar Moo");
  });

  it("should edit an interview", () => {
    cy.get('.appointment__card--show')
      .click({ force: true });
    cy.get('[alt=Edit]')
      .click({ force: true });
    cy.get('[alt="Sylvia Palmer"]')
      .click()
    cy.get('[data-testid=student-name-input]')
      .clear()
      .type('Royal Moo')
    cy.get('button').contains('Save')
      .click()
    cy.contains(".appointment__card--show", "Royal");
  });

  it("should cancel an interview", () => {
    cy.get('[alt=Delete]')
      .click({ force: true });
    cy.contains('Delete the appointment?');
    cy.contains('button', 'Confirm')
      .click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });

})