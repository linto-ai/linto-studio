const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-remove')

module.exports = async function containerRegister(id) {
  if (this.containerRegistered.stt.id === id) {
    this.containerRegistered.stt = {}
  } else {
    this.containerRegistered.diartization = this.containerRegistered.diartization.filter(registeredContainer => {
      if (id !== registeredContainer.id) {
        return registeredContainer
      }
    })
    this.containerRegistered.punctuation = this.containerRegistered.punctuation.filter(registeredContainer => {
      if (id !== registeredContainer.id) {
        return registeredContainer
      }
    })
  }
}