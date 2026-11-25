import { apiGetFeatures } from "@/api/studio-api/features.js"
import { computeApiFailure } from "@/tools/request/computeApiFailure.js"

// Whether the API answers this front (classic and mobile), and what its
// deployment offers (GET /features): the front reads none of it from its own
// configuration. The routers check it before any page, login included: once
// reachable it is remembered, while unreachable it is checked again at each
// navigation. A request that later gets no answer at all reports it with
// markUnreachable.
const state = {
  // null: not checked yet
  reachable: null,
  // Why the last check failed (computeApiFailure), null while reachable or
  // not checked: the technical details of the "API unreachable" page.
  failure: null,
  // GET /features once the API answered ({ saas, session,
  // speakerIdentification }), null before. Kept while the API stops
  // answering: the next check replaces it.
  features: null,
}

// The check in progress: navigations asking at the same time share it.
let checking = null

const mutations = {
  setReachable(state, features) {
    state.reachable = true
    state.failure = null
    state.features = features
  },
  setUnreachable(state, failure) {
    state.reachable = false
    state.failure = failure
  },
}

// Each feature is off until the API said otherwise: pages are only shown
// once it did (the routers wait for the check).
const getters = {
  isSaas: (state) => state.features?.saas === true,
  hasSession: (state) => state.features?.session === true,
  hasSpeakerIdentification: (state) =>
    state.features?.speakerIdentification === true,
}

const actions = {
  // Resolves to whether the API is reachable.
  check({ state, commit }) {
    switch (true) {
      case state.reachable === true:
        return Promise.resolve(true)
      default:
        checking ??= apiGetFeatures()
          .then((answer) => saveCheck(commit, answer))
          .finally(() => {
            checking = null
          })
        return checking
    }
  },
  // result: the sendRequest result of the request that got no answer.
  markUnreachable({ commit }, result) {
    commit("setUnreachable", computeApiFailure(result))
  },
}

function saveCheck(commit, { features, failure }) {
  switch (true) {
    case failure === null:
      commit("setReachable", features)
      return true
    default:
      commit("setUnreachable", failure)
      return false
  }
}

export default { namespaced: true, state, mutations, getters, actions }
