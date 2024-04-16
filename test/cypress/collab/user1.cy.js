describe("Edition 1st user", () => {
  beforeEach(() => {
    cy.captureConsoleLogs() // Capturer la sortie de la console avant chaque test
  })

  it("edit turn", () => {
    cy.login("foo.bar@example.com", "password")

    cy.get(".conversation-line__head .conversation-line__title").first().click()

    cy.get("#conversation-is-loading", { timeout: 10000 }).should("not.exist")

    cy.wait(50)

    cy.get("#26be0268-b9d3-47c6-99af-a83b20876a51").realClick()

    cy.wait(50)

    cy.realType("mot1 mot2 mot3")

    cy.get(".organization-sidebar").click()

    cy.wait(50)

    cy.get("sync-error-icon").should("not.exist")

    cy.contains("Ça va trèmot1 mot2 mot3s bien.")

    cy.wait(150)
    // cy.contains("recevons").first().realClick()

    // cy.realType(" ")

    // cy.contains("rece vons")

    // cy.get(".organization-sidebar").click()

    // cy.contains("rece vons")

    // cy.get("sync-error-icon").should("not.exist")
  })
  // it("import a media", () => {
  //   cy.visit("http://127.0.0.1:8013/")
  //   cy.get("#upload-media-button").click()

  // })
})
