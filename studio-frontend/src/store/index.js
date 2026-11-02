import Vue from "vue"
import Vuex from "vuex"

import user from "./user"
import organizations from "./organizations"
import tags from "./tags"
import folders from "./folders"
import sessions from "./sessions"
import settings from "./settings"
import system from "./system"
import createMediaModule from "./modules/mediaModuleFactory"
import quickSession from "./quickSession"
import billing from "./billing"
import transcriptionCreate from "./transcriptionCreate"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    organizations,
    tags,
    folders,
    quickSession,
    sessions,
    settings,
    system,
    billing,
    transcriptionCreate,
    "favorites/conversations": createMediaModule("users/self/favorites"),
    "shared/conversations": createMediaModule("conversations/shared"),
    // organizations conv are registered programmatically during "setCurrentOrganizationScope"
  },
})
