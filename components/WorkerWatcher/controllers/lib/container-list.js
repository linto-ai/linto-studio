const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-list')

module.exports = async function containerList() {
  let services = {}
  for (const type in this.containerRegistered) {
    if (type !== 'diarization' && type !== 'punctuation') {
      if (!services[type]) services[type] = []

      this.containerRegistered[type].map(container => {
        services[type].push(container.printServiceInfo(true, true))
      })
    }
  }

  for (const type in this.containerRegistered) {
    if (type === 'diarization' || type === 'punctuation') {
      this.containerRegistered[type].map(container => {
        services[container.language].map(service => {
          if (!service.sub_services[type]) service.sub_services[type] = []

          if (service.language === container.language) {
            service.sub_services[type].push(container.printServiceInfo(true))
          }
        })
      })
    }
  }

  let result = { transcription: [] }
  for (const type in services) {
    result.transcription.push(...services[type])
  }

  return result
}