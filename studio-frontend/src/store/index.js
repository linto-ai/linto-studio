import Vue from "vue"
import Vuex from "vuex"

import user from "./user"
import organizations from "./organizations"
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user,
    organizations,
  },
})
