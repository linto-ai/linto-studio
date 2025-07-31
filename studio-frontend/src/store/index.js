import Vue from "vue"
import Vuex from "vuex"

import user from "./user"
import organizations from "./organizations"
import tags from "./tags"
import inbox from "./inbox"
import conversations from "./conversations"
import sessions from "./sessions"
import settings from "./settings"
import system from "./system"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    organizations,
    tags,
    inbox,
    conversations,
    sessions,
    settings,
    system,
  },
})
