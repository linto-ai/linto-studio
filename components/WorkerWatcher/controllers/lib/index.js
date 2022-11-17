const discovery = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-discovery`)
const list = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-list`)
const register = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-register`)
const remove = require(`${process.cwd()}/components/WorkerWatcher/controllers/lib/container-remove`)

module.exports = {
  discovery : discovery,
  list : list,
  register : register,
  remove : remove
}