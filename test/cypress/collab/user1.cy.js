describe("Edition 1st user", () => {
  it("edit turn", () => {
    cy.login("foo.bar@example.com", "password")

    cy.get(".conversation-line__head .conversation-line__title").first().click()

    cy.get("#conversation-is-loading", { timeout: 10000 }).should("not.exist")

    cy.wait(50)

    cy.get("#26be0268-b9d3-47c6-99af-a83b20876a51").realClick()

    cy.wait(50)

    cy.realType("mot1 mot2 mot3")

    cy.get(".organization-sidebar").click()

    cy.wait(500)

    cy.get("sync-error-icon").should("not.exist")

    cy.contains("Ça va trèmot1 mot2 mot3s bien.")

    // cy.wait(200)
    // cy.contains("Ça va très bimot4 mot5 mot6en depuis combien de temps ?")
    // cy.contains("Ça va trèmot1 mot2 mot3s bien.")

    // cy.get("#65433089-ab0b-41c2-a068-989b504754f6").realClick()
    // cy.realType("mot1 mot2 mot3 mot31 mot32")
    // cy.wait(200)
    // cy.contains("Depuis qumot1 mot2 mot3 mot31 mot32e j'ai quitté une certmot4 mot5 mot6 mot7 mot8aine presse.")
  })
  // it("import a media", () => {
  //   cy.visit("http://127.0.0.1:8013/")
  //   cy.get("#upload-media-button").click()

  // })
})
