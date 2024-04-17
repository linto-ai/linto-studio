const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    specPattern: ["cypress/collab/user2.cy.js"],
    video: true,
  },
})
