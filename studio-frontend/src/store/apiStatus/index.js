import { apiCheckHealth } from "@/api/healthcheck.js"
import { computeApiFailure } from "@/tools/request/computeApiFailure.js"

// Whether the API answers this front (classic and mobile). The routers check
// it before any page, login included: once reachable it is remembered, while
// unreachable it is checked again at each navigation. A request that later
// gets no answer at all reports it with markUnreachable.
const state = {
  // null: not checked yet
  reachable: null,
  // Why the last check failed (computeApiFailure), null while reachable or
  // not checked: the technical details of the "API unreachable" page.
  failure: null,
}

// The check in progress: navigations asking at the same time share it.
let checking = null

const mutations = {
  setReachable(state) {
    state.reachable = true
    state.failure = null
  },
  setUnreachable(state, failure) {
    state.reachable = false
    state.failure = failure
  },
}

const actions = {
  // Resolves to whether the API is reachable.
  check({ state, commit }) {
    switch (true) {
      case state.reachable === true:
        return Promise.resolve(true)
      default:
        checking ??= apiCheckHealth()
          .then((failure) => saveCheck(commit, failure))
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

function saveCheck(commit, failure) {
  switch (true) {
    case failure === null:
      commit("setReachable")
      return true
    default:
      commit("setUnreachable", failure)
      return false
  }
}

export default { namespaced: true, state, mutations, actions }
