describe("Overview", () => {
  it("Login", () => {
    cy.login("foo.bar@example.com", "password")
    cy.contains("small")
  })

  it("edit title", () => {
    //cy.visit("http://127.0.0.1:8013/")
    cy.login("foo.bar@example.com", "password")
    cy.contains("small")

    cy.get(".conversation-line__head .conversation-line__open-with button")
      .first()
      .click()
    cy.contains("Synthèse du média")

    cy.get(".conversation-line__head .select__list__item").first().click()

    cy.contains("Informations générales")

    cy.get(".overview__main-section input").clear().type("small audio")

    cy.get(".overview__main-section button").first().click()

    cy.contains("Fermer la synthèse").click()

    cy.contains("small audio")
  })
  // it("import a media", () => {
  //   cy.visit("http://127.0.0.1:8013/")
  //   cy.get("#upload-media-button").click()

  // })
})
