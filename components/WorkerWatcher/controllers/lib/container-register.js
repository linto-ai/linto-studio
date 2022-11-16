const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-register')

module.exports = async function containerRegister(container) {
  if (container && container.enabled) {
      if (container.type === 'stt') {
        this.containerRegistered.stt = container
      } else {
        let isUpadted = false
        this.containerRegistered[container.type].map(registeredContainer => {
          if (container.id === registeredContainer.id) {
            registeredContainer = container
            isUpadted = true
            return
          }
        })
        if (!isUpadted) {
          this.containerRegistered[container.type].push(container)
        }
      }
  }
}