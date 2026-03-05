import Vue from "vue"
import Vuex from "vuex"

import user from "./user"
import organizations from "./organizations"
import tags from "./tags"
import sessions from "./sessions"
import settings from "./settings"
import system from "./system"
import createMediaModule from "./modules/mediaModuleFactory"
import quickSession from "./quickSession"
import chat from "./chat"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    organizations,
    tags,
    quickSession,
    sessions,
    settings,
    system,
    chat,
    "favorites/conversations": createMediaModule("users/self/favorites"),
    "shared/conversations": createMediaModule("conversations/shared"),
    // organizations conv are registered programmatically during "setCurrentOrganizationScope"
  },
})
