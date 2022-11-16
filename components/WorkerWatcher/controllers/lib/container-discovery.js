const debug = require('debug')('linto:components:worcker-watcher::controllers:lib:container-discovery')
const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const { Container } = require('../dao/container')

module.exports = async function containerDiscovery() {
  const containers = await docker.listContainers()
  containers.map(async container => {
    const containerInspect = await docker.getContainer(container.Id).inspect()
    const myContainer = new Container(container.Names[0].substring(1), containerInspect)
    this.register(myContainer)
  })
}