describe("Edition", () => {
  it("edit turn", () => {
    cy.login("foo.bar@example.com", "password")

    cy.get(".conversation-line__head .conversation-line__title").first().click()

    cy.contains("recevons").first().realClick()

    cy.realType(" ")

    cy.contains("rece vons")

    cy.get(".organization-sidebar").click()

    cy.contains("rece vons")

    cy.get("sync-error-icon").should("not.exist")
  })
  // it("import a media", () => {
  //   cy.visit("http://127.0.0.1:8013/")
  //   cy.get("#upload-media-button").click()

  // })
})
