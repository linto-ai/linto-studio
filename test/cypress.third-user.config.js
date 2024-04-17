const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    specPattern: ["cypress/collab/user3.cy.js"],
    video: true,
  },
})
