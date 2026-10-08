import Vue from "vue"
import mergeSession from "../../tools/mergeSession.js"

// Sessions are replaced, never mutated in place, and new ids go through
// Vue.set: views read them through getters and must see every change.
// "terminated" is final: a REST answer or a pause request still in flight
// when the session ended must not bring it back to life (a new session
// always has a new id).
function keepTerminated(existing, session) {
  if (existing?.status !== "terminated") return session
  return { ...session, status: "terminated" }
}

const mutations = {
  // Full or partial object from the API or from a local action: top-level
  // fields win over the stored ones (channels included, as a whole).
  updateOrCreateSession(state, session) {
    const existing = state.sessionsIndexedById[session.id]
    Vue.set(
      state.sessionsIndexedById,
      session.id,
      keepTerminated(existing, { ...existing, ...session }),
    )
  },
  // Object pushed by the websocket: channels are merged one by one, the
  // broadcast may carry only part of them.
  mergeSessionUpdate(state, session) {
    const existing = state.sessionsIndexedById[session.id]
    Vue.set(
      state.sessionsIndexedById,
      session.id,
      keepTerminated(
        existing,
        existing ? mergeSession(existing, session) : session,
      ),
    )
  },
  // The session left the server's list of running sessions: ended (saved
  // into a conversation) or deleted. Kept, so the views open on it can show
  // its end; unknown ids are ignored.
  markSessionTerminated(state, sessionId) {
    const existing = state.sessionsIndexedById[sessionId]
    if (!existing) return
    Vue.set(state.sessionsIndexedById, sessionId, {
      ...existing,
      status: "terminated",
    })
  },
}

export default mutations
