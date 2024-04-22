describe("watching 3rd user", () => {
  it("edit turn", () => {
    cy.login("foo.bar@example.com", "password")

    cy.get(".conversation-line__head .conversation-line__title").first().click()

    cy.get("#conversation-is-loading", { timeout: 10000 }).should("not.exist")

    cy.wait(10000)

    cy.contains("Ça va très bimot4 mot5 mot6en depuis combien de temps ?")

    cy.contains("Ça va trèmot1 mot2 mot3s bien.")
  })
})
