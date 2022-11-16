const debug = require('debug')('linto:components:worcker-watcher:controllers:dao:container')
const dockerhub_community = 'lintoai/'

const Type = require('./container-type')

class Container {
  constructor(containerName, container) {
    if (container.Config.Image.includes(dockerhub_community)) {
      const type = Type.checkType(container.Config.Image)
      if (type !== Type.UNSUPORTED) {
        this.enabled = true

        this.type = type
        this.name = containerName

        this.id = container.Id
        this.image = container.Config.Image
        this.host = container.Config.Labels['com.docker.compose.service']

        container.Config.Env.map(env => {
          if (env.includes('DESC')) {
            this.desc = env.split('=')[1]
          } else if (env.includes('ACCOUSTIC')) {
            this.accoustic = Number(env.split('=')[1])
          } else if (env.includes('MODEL_QUALITY')) {
            this.model_quality = Number(env.split('=')[1])
          } else if (env.includes('LANGUAGE')) {
            this.language = env.split('=')[1]
          }
        })
      } else {
        this.enabled = false
      }
    } else {
      this.enabled = false
    }
  }

  printServiceInfo() {
    let container = Object.assign({}, this)
    delete container.enabled
    delete container.id
    delete container.type
    delete container.image

    return container
  }

}

module.exports = {
  Container
}



