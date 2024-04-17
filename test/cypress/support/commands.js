// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://127.0.0.1:8013/")
  cy.get("#email").type(email)
  cy.get("#password").type(password)
  cy.get("button[type=submit]").click()
})

Cypress.on("window:before:load", (window) => {
  Object.defineProperty(window.navigator, "language", { value: "fr-FR" })
})
