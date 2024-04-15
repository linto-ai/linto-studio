describe("New user", () => {
  it("Create an account", () => {
    cy.visit("http://127.0.0.1:8013/")

    cy.get("#create-account-link").click()

    cy.get("#firstname").type("henry")
    cy.get("#lastname").type("leblanc")
    cy.get("#email").type("test@example.com")
    cy.get("#password").type("password")
    cy.get("#passwordconfirm").type("password")

    cy.get("button[type=submit]").click()

    cy.get("button[type=submit]").click()

    cy.contains("Félicitations")
  })

  it("Login", () => {
    cy.login("test@example.com", "password")
    cy.contains("Aucun média trouvé")
  })

  // it("import a media", () => {
  //   cy.visit("http://127.0.0.1:8013/")
  //   cy.get("#upload-media-button").click()

  // })
})
