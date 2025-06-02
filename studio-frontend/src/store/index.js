import Vue from "vue"
import Vuex from "vuex"

import user from "./user"
import organizations from "./organizations"
import tags from "./tags"
import inbox from "./inbox"
import settings  from "./settings"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    organizations,
    tags,
    inbox,
    settings,
  },
})
