import Vue from "vue"
import Router from "vue-router"
import { getCookie } from "../tools/getCookie"
import { setCookie } from "../tools/setCookie"
import { apiLoginUserMagicLink } from "../api/user"
import { apiGetUserRightFromConversation } from "../api/conversation"
import PUBLIC_ROUTES from "../const/publicRoutes"

const defaultComponents = {
  AppHeader: () => import("../components/AppHeader.vue"),
  AppNotif: () => import("../components/AppNotif"),
}

const defaultProps = {
  default: true,
  AppHeader: true,
  AppNotif: true,
}
Vue.use(Router)

let isAuthenticated = function () {
  return getCookie("authToken") !== null
}

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/interface/404",
      name: "not_found",
      components: {
        default: () => import("../views/404.vue"),
        ...defaultComponents,
      },
      props: {
        default: true,
        AppHeader: true,
        AppNotif: false,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
      props: {
        default: true,
        AppHeader: false,
        AppNotif: true,
      },
    },
    {
      path: "/create-account",
      name: "create-account",
      components: {
        default: () => import("../views/CreateAccount.vue"),
      },
      props: {
        default: true,
        AppHeader: false,
        AppNotif: true,
      },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      components: {
        default: () => import("../views/ResetPassword.vue"),
      },
      props: {
        default: true,
        AppHeader: false,
        AppNotif: true,
      },
    },
    {
      path: "/magiclink-auth/:magicId",
      name: "magic-link-login",
      props: {
        default: true,
        AppHeader: false,
        AppNotif: false,
      },
    },
    {
      path: "/magiclink-auth-invalid",
      name: "magic-link-error",
      components: {
        default: () => import("../views/ResetPasswordLogin.vue"),
      },
      props: {
        default: true,
        AppHeader: false,
        AppNotif: false,
      },
    },
    {
      path: "/interface/inbox",
      name: "inbox",
      components: {
        default: () => import("../views/Inbox.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { mainListingPage: true },
    },
    {
      path: "/interface/explore",
      name: "explore",
      components: {
        default: () => import("../views/Explore.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { mainListingPage: true },
    },
    {
      path: "/interface/sessionsList",
      name: "sessionsList",
      components: {
        default: () => import("../views/SessionsList.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { sessionListingPage: true },
    },
    {
      path: "/interface/favorites",
      name: "favorites",
      components: {
        default: () => import("../views/Favorites.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { userPage: true },
    },
    {
      path: "/interface/shared",
      name: "shared with me",
      components: {
        default: () => import("../views/SharedWith.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { userPage: true },
    },
    {
      path: "/interface/conversations/create",
      name: "conversations create",
      components: {
        default: () => import("../views/ConversationsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/conversations/:conversationId",
      name: "conversations overview",
      components: {
        default: () => import("../views/ConversationsOverview.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/conversations/:conversationId/transcription",
      name: "conversations transcription",
      components: {
        default: () => import("../views/ConversationsTranscription.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/conversations/:conversationId/subtitles",
      name: "conversations subtitles",
      components: {
        default: () => import("../views/ConversationsSubtitlesMenu.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/conversations/:conversationId/subtitles/:subtitleId",
      name: "conversations subtitle",
      components: {
        default: () => import("../views/ConversationsSubtitle.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/conversations/:conversationId/publish",
      name: "conversations publish",
      components: {
        default: () => import("../views/ConversationsPublish.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/sessions/create",
      name: "sessions create",
      components: {
        default: () => import("../views/SessionsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/sessions/:sessionId",
      name: "sessions live",
      components: {
        default: () => import("../views/SessionLive.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/sessions/:sessionId/settings",
      name: "sessions settings",
      components: {
        default: () => import("../views/SessionSettings.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/organizations/create",
      name: "organizations create",
      components: {
        default: () => import("../views/OrganizationsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/organizations/:organizationId",
      name: "organizations update",
      components: {
        default: () => import("../views/OrganizationsUpdate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/user/settings",
      name: "user settings",
      components: {
        default: () => import("../views/UserSettings.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { userPage: true },
    },
    {
      path: "/interface/tags/settings",
      name: "tags settings",
      components: {
        default: () => import("../views/ManageTags.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "*",
      name: "not_found_redirect",
      component: () => import("../views/404.vue"),
      props: {
        default: false,
        AppHeader: false,
        AppNotif: false,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  try {
    // Redirections 404
    if (to.name === "not_found_redirect") {
      next({ name: "not_found" })
    }
    /* MAGIC LINK AUTH */
    if (to.name === "magic-link-login") {
      const userIsLoggedIn = getCookie("authToken") !== null
      const conversationId = to?.query?.conversationId
      const magicId = to?.params?.magicId

      if (userIsLoggedIn && conversationId) {
        next({
          path: "/interface/conversations/" + conversationId,
        })
      } else {
        const login = await apiLoginUserMagicLink(magicId)
        if (login.status === "success") {
          setCookie("userId", login.data.user_id, 7)
          setCookie("authToken", login.data.auth_token, 7)
          setCookie("refreshToken", login.data.refresh_token, 14)
          setCookie("cm_orga_scope", "")
          let redirect = {}
          if (conversationId) {
            redirect = {
              path: "/interface/conversations/" + conversationId,
            }
          } else {
            redirect = { name: "inbox" }
          }
          next(redirect)
        } else {
          next({ name: "magic-link-error" })
        }
      }
    }
    // CHECK AUTH + REDIRECTIONS
    else {
      const authRoutes = PUBLIC_ROUTES
      const convRoutes = [
        "conversations overview",
        "conversations transcription",
        "conversations publish",
      ]
      // If user is not authenticated and try to access the interface > redirect to auth routes
      if (!isAuthenticated() && authRoutes.indexOf(to.name) < 0) {
        next({ name: "login", query: { next: to.fullPath } })
      }
      // If user is authenticated
      else if (isAuthenticated()) {
        if (from.query.next && from.query.next !== to.fullPath) {
          next(from.query.next)
        }
        // If user try to access an auth route > redirect to conversations
        if (
          to.fullPath === "/" ||
          to.fullPath === "/interface" ||
          authRoutes.indexOf(to.name) >= 0
        ) {
          next({ name: "inbox" })
        } else if (convRoutes.indexOf(to.name) >= 0) {
          const conversationId = to.params.conversationId
          let userRight = 0
          // Check user rights on conversation
          let getUserRight = await apiGetUserRightFromConversation(
            conversationId
          )
          if (getUserRight) {
            userRight = getUserRight?.right
          }
          if (userRight > 0) {
            next()
          } else {
            next({ name: "not_found" })
          }
          next()
        }
      } else {
        next()
      }
    }
  } catch (error) {
    console.error(error)
  }
  next()
})
export default router
