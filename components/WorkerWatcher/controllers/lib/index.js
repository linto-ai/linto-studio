const discovery = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-discovery`)
const register = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-register`)
const remove = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-remove`)

module.exports = {
  discovery : discovery,
  register : register,
  remove : remove
}