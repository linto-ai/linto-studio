const debug = require('debug')('Application:main')

class Application {
  /**
   * Application root class, every application is an instance of this class. Certainly a singleton.
   * @param {string} app_env - The name of the environment variable that contains the list of component folder names.
   * @param {string} app_dirname - The name of the directory of the implementation of the application.
   */
  constructor(app_env, app_dirname) {
    try {
      this.app_dirname = app_dirname
      // Load env variables
      require("./config.js");
      // Auto-loads components based on process.env.COMPONENTS list
      this.components = {}
      process.env[app_env].split(',').reduce((prev, componentFolderName) => {
        return prev.then(async () => {
          await this.use(componentFolderName)
        })
      }, Promise.resolve()).then(() => {
        debug('All components loaded')
      })
    } catch (e) {
      console.error(debug.namespace, e)
    }
  }

  async use(componentFolderName) {
    debug(`Registering component: ${componentFolderName}`)
    try {
      // Component dependency injections with inversion of control based on events emitted between components
      // Component is an async singleton - requiring it returns a reference to an instance
      const component = await require(`${this.app_dirname}/components/${componentFolderName}`)(this)
      this.components[component.id] = component // We register the instancied component reference in app.components object
      debug(`Registered component: ${component.id}`)
    } catch (e) {
      if (e.name == 'COMPONENT_MISSING') {
        debug(`Skipping ${componentFolderName} - this component depends on: ${e.missingComponents}`)
      } else {
        console.error(debug.namespace, `Error in component loading: ${componentFolderName}`)
        console.error(debug.namespace, e)
        process.exit(1)
      }
    }
  }
}

module.exports = Application