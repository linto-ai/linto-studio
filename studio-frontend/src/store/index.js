import { createStore } from "vuex"

import user from "./user"
import organizations from "./organizations"
import tags from "./tags"
import conversations from "./conversations"
import sessions from "./sessions"
import settings from "./settings"
import system from "./system"
import createMediaModule from "./modules/mediaModuleFactory"

export default createStore({
  modules: {
    user,
    organizations,
    tags,
    conversations,
    sessions,
    settings,
    system,
    "favorites/conversations": createMediaModule("users/self/favorites"),
    "shared/conversations": createMediaModule("conversations/shared"),
    // organizations conv are registered programmatically during "setCurrentOrganizationScope"
  },
})
