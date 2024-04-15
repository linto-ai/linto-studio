// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//

Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://127.0.0.1:8013/")
  cy.get("#email").type(email)
  cy.get("#password").type(password)
  cy.get("button[type=submit]").click()
})
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
//   // set language to english by overwriting the Accept-Language header
//   const newOptions = Object.assign({}, options, {
//     onBeforeLoad(win) {
//       Object.defineProperty(win.navigator, "language", {
//         value: "fr-FR",
//       })

//       if (options && options.onBeforeLoad) options.onBeforeLoad(win)
//     },
//   })

//   return originalFn(url, newOptions)
// })

Cypress.on("window:before:load", (window) => {
  Object.defineProperty(window.navigator, "language", { value: "fr-FR" })
})
