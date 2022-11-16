const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-list')

module.exports = async function containerList() {
  let services = {}
  for (let type in this.containerRegistered) {
    services[type] = []
    this.containerRegistered[type].map(container => {
      services[type].push(container.printServiceInfo())
    })
  }
  return services
}