const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-remove')

module.exports = async function containerRegister(id) {
  for (let type in this.containerRegistered) {
    this.containerRegistered[type] = this.containerRegistered[type].filter(registeredContainer => {
      if (id !== registeredContainer.id) {
        return registeredContainer
      }
    })
  }
}