const debug = require('debug')('linto:components:worcker-watcher:controllers:watcher')

const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const { Container } = require('./dao/container')

module.exports = async function () {
  const streamEvent = await docker.getEvents()

  streamEvent.on('data', async buffer => {
    try {
      const { Type, Action, Actor } = JSON.parse(buffer.toString())

      switch (Type) {
        case 'container':
          // debug(`Docker event : ${Type}-${Action}`)
          dockerContainer.call(this, Type, Action, Actor)
          break;
        default:
        // Other docker type events are not managed
      }

    } catch (err) {
      process.stdout.write(`${err.message}\n`)
    }
  })
}

async function dockerContainer(Type, Action, Actor) {
  try {
    const container = await docker.getContainer(Actor?.ID).inspect()

    if (Action === 'remove' || Action === 'stop') {
      // debug(`Docker event : ${Type}-${Action}`)
      this.remove(Actor?.ID)
    } else if (Action === 'update' || Action === 'restart' || Action === 'create' || Action === 'start') {
      // debug(`Docker event : ${Type}-${Action}`)
      this.register(new Container(Actor?.Attributes?.name, container))
    }
  } catch (err) {
    console.error(err)
  }
}