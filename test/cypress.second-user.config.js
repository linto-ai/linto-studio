const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-terminal-report/src/installLogsPrinter")(on)
      // implement node event listeners here
    },
    specPattern: ["cypress/collab/user2.cy.js"],
    video: true,
  },
})
