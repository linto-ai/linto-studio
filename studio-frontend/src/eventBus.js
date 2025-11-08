import mitt from "mitt"

// Create event bus using mitt
export const bus = mitt()

// For Vue 3 plugin compatibility
export default {
  install(app) {
    // Make event bus available as $bus in components
    app.config.globalProperties.$bus = bus
  },
}
