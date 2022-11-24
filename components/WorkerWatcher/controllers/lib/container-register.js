const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-register')

module.exports = async function containerRegister(container) {
  if (container && container.enabled) {
    let isUpadted = false

    let type = container.type
    if (type === 'stt') {
      type = container.language
    }
    
    if (!this.containerRegistered[type]) {
      this.containerRegistered[type] = []
    }

    this.containerRegistered[type].map(registeredContainer => {
      if (container.id === registeredContainer.id) {
        registeredContainer = container
        isUpadted = true
        return
      }
    })
    if (!isUpadted) {
      this.containerRegistered[type].push(container)
    }
  }
}