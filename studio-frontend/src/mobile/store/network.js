// Vuex module `mobileNetwork`: whether the browser has a network. Set at
// startup and on each change by main.js (api/device/network.js).
const state = () => ({
  online: true,
})

const mutations = {
  setOnline(state, online) {
    state.online = online
  },
}

export default { namespaced: true, state, mutations }
