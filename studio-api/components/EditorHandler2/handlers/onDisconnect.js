const debug = require("debug")("linto:components:EditorHandler2:onDisconnect")

const { releaseSocketLocks } = require("./releaseSocketLocks")

// A dead socket must not keep its turns locked until TTL: release everything
// it held. (A crashed INSTANCE can't run this — that's what TTL expiry covers.)
async function onDisconnect({ io, socket }) {
  try {
    await releaseSocketLocks({ io, socket })
  } catch (err) {
    debug(`disconnect cleanup failed for socket=${socket.id}: ${err.message}`)
  }
}

module.exports = { onDisconnect }
