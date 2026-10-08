import test from "ava"
import mutations from "../mutations.js"
import actions from "../actions.js"

function createState(sessions = []) {
  const sessionsIndexedById = {}
  for (const session of sessions) sessionsIndexedById[session.id] = session
  return { sessionsIndexedById }
}

// Runs an action against the real mutations, like the store would.
function dispatch(state, action, payload) {
  const commit = (type, value) => mutations[type](state, value)
  return actions[action]({ commit }, payload)
}

const runningSession = {
  id: "s1",
  status: "active",
  name: "Daily",
  channels: [{ id: 1, name: "fr", streamStatus: "active" }],
}

test("updateOrCreateSession creates then replaces top-level fields", (t) => {
  const state = createState()
  mutations.updateOrCreateSession(state, runningSession)
  mutations.updateOrCreateSession(state, { id: "s1", status: "paused" })
  t.deepEqual(state.sessionsIndexedById.s1, {
    ...runningSession,
    status: "paused",
  })
})

test("updateOrCreateSession never mutates the stored object", (t) => {
  const state = createState([runningSession])
  const before = state.sessionsIndexedById.s1
  mutations.updateOrCreateSession(state, { id: "s1", visibility: "public" })
  t.not(state.sessionsIndexedById.s1, before)
  t.is(before.visibility, undefined)
})

test("applySessionsUpdate merges channels one by one", (t) => {
  const state = createState([runningSession])
  dispatch(state, "applySessionsUpdate", {
    updated: [{ id: "s1", channels: [{ id: 1, streamStatus: "inactive" }] }],
  })
  t.deepEqual(state.sessionsIndexedById.s1.channels, [
    { id: 1, name: "fr", streamStatus: "inactive" },
  ])
})

test("applySessionsUpdate adds unknown sessions", (t) => {
  const state = createState()
  dispatch(state, "applySessionsUpdate", { added: [runningSession] })
  t.deepEqual(state.sessionsIndexedById.s1, runningSession)
})

test("applySessionsUpdate keeps a removed session as terminated", (t) => {
  const state = createState([runningSession])
  dispatch(state, "applySessionsUpdate", { removed: [{ id: "s1" }] })
  t.is(state.sessionsIndexedById.s1.status, "terminated")
  t.is(state.sessionsIndexedById.s1.name, "Daily")
})

test("applySessionsUpdate ignores the removal of an unknown session", (t) => {
  const state = createState()
  dispatch(state, "applySessionsUpdate", { removed: [{ id: "s2" }] })
  t.deepEqual(state.sessionsIndexedById, {})
})

test("applySessionsUpdate accepts a partial payload", (t) => {
  const state = createState([runningSession])
  dispatch(state, "applySessionsUpdate", {})
  t.deepEqual(state.sessionsIndexedById.s1, runningSession)
})

test("a terminated session stays terminated on a late REST write", (t) => {
  const state = createState([{ ...runningSession, status: "terminated" }])
  mutations.updateOrCreateSession(state, { ...runningSession, name: "New" })
  t.is(state.sessionsIndexedById.s1.status, "terminated")
  t.is(state.sessionsIndexedById.s1.name, "New")
})

test("a terminated session stays terminated on a late websocket update", (t) => {
  const state = createState([{ ...runningSession, status: "terminated" }])
  dispatch(state, "applySessionsUpdate", { updated: [runningSession] })
  t.is(state.sessionsIndexedById.s1.status, "terminated")
})
