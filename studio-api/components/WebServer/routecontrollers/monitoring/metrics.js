const model = require(`${process.cwd()}/lib/mongodb/models`)

async function startWebsocketConnection(req, res, next) {
  try {
    const { conversationId, organizationId, userId } = req.body
    if (!conversationId || !organizationId || !userId)
      return res.status(400).send({ message: "Missing parameters" })

    const result = await model.metrics.startConnection({
      conversationId,
      organizationId,
      userId,
    })
    res.status(201).json({ id: result.insertedId })
  } catch (err) {
    next(err)
  }
}

async function endWebsocketConnection(req, res, next) {
  try {
    const { id } = req.params
    await model.metrics.endConnection(id)
    res.status(200).json({ message: "ok" })
  } catch (err) {
    next(err)
  }
}

async function getMediaCount(req, res, next) {
  try {
    const count = await model.conversations.countByOrganization(
      req.params.organizationId,
    )
    res.status(200).json({ count })
  } catch (err) {
    next(err)
  }
}

function computeStats(connections) {
  const convMap = {}
  connections.forEach((c) => {
    const id = c.conversationId
    if (!convMap[id]) convMap[id] = { users: new Set(), intervals: [] }
    convMap[id].users.add(c.userId)
    const start = new Date(c.startTime)
    const end = c.endTime ? new Date(c.endTime) : new Date()
    convMap[id].intervals.push({ start, end })
  })
  const result = []
  for (const id in convMap) {
    const data = convMap[id]
    let total = 0
    const events = []
    data.intervals.forEach((i) => {
      total += i.end - i.start
      events.push({ t: i.start, type: "s" })
      events.push({ t: i.end, type: "e" })
    })
    events.sort((a, b) => a.t - b.t)
    let current = 0
    let max = 0
    events.forEach((e) => {
      if (e.type === "s") {
        current++
        if (current > max) max = current
      } else {
        current--
      }
    })
    result.push({
      conversationId: id,
      uniqueUsers: data.users.size,
      totalDuration: total,
      maxConcurrentConnections: max,
    })
  }
  return result
}

async function getWebsocketStats(req, res, next) {
  try {
    const rows = await model.metrics.getByOrganization(
      req.params.organizationId,
    )
    const sessions = computeStats(rows)
    res.status(200).json({ sessions })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  startWebsocketConnection,
  endWebsocketConnection,
  getMediaCount,
  getWebsocketStats,
}
