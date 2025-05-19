import Vue from "vue"
import Router from "vue-router"

import { getEnv } from "@/tools/getEnv.js"
import store from "@/store/index.js"
import { getCookie } from "@/tools/getCookie"
import { setCookie } from "@/tools/setCookie"
import { apiLoginUserMagicLink } from "@/api/user"
import { apiGetUserRightFromConversation } from "@/api/conversation"
import PUBLIC_ROUTES from "../const/publicRoutes"
import { apiGetQuickSession } from "@/api/session.js"
import { logout } from "../tools/logout"
import { customDebug } from "@/tools/customDebug.js"

const defaultComponents = {
  AppHeader: () => import("@/components/AppHeader.vue"),
  AppNotif: () => import("@/components/AppNotif"),
}

const componentsWithoutHeader = {
  AppNotif: () => import("@/components/AppNotif"),
}

// it's **not** a boolean do describe if the component is displayed or not
// it tells if the route params will be passed to the components as props
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
    { path: "/", redirect: { name: "explore" } },
    { path: "/interface", redirect: { name: "explore" } },
    // BACKOFFICE ROUTES
    {
      path: "/backoffice",
      name: "backoffice",
      components: {
        default: () => import("../views/backoffice/Home.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    {
      path: "/backoffice/users",
      name: "backoffice-userList",
      components: {
        default: () => import("../views/backoffice/UserList.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    {
      path: "/backoffice/users/:userId",
      name: "backoffice-userDetail",
      components: {
        default: () => import("../views/backoffice/UserDetail.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    {
      path: "/backoffice/organizations",
      name: "backoffice-organizationList",
      components: {
        default: () => import("../views/backoffice/OrganizationList.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    {
      path: "/backoffice/organizations/:organizationId",
      name: "backoffice-organizationDetail",
      components: {
        default: () => import("../views/backoffice/OrganizationDetail.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    {
      path: "/backoffice/transcriberProfiles",
      name: "backoffice-transcriberProfilesList",
      components: {
        default: () =>
          import("../views/backoffice/TranscriberProfilesList.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    {
      path: "/backoffice/transcriberProfiles/:transcriberProfileId",
      name: "backoffice-transcriberProfileDetail",
      components: {
        default: () =>
          import("../views/backoffice/TranscriberProfileDetail.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { backoffice: true },
    },
    // PUBLIC ROUTES
    {
      path: "/interface/404",
      name: "not_found",
      components: {
        default: () => import("../views/404.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: { responsive: true },
    },
    {
      path: "/login",
      name: "login",
      components: {
        default: () => import("../views/Login.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: { public: true, authRoute: true },
    },
    {
      path: "/login/oidc",
      name: "oidc-login",
      components: {
        default: () => import("../views/oidc.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: { public: true, authRoute: true },
    },
    {
      path: "/create-account",
      name: "create-account",
      components: {
        default: () => import("../views/CreateAccount.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: { public: true, authRoute: true },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      components: {
        default: () => import("../views/ResetPassword.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: { public: true, authRoute: true },
    },
    {
      path: "/magiclink-auth/:magicId",
      name: "magic-link-login",
      defaultProps,
      meta: { public: true, authRoute: true },
    },
    {
      path: "/magiclink-auth-invalid",
      name: "magic-link-error",
      components: {
        default: () => import("../views/ResetPasswordLogin.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: { public: true, authRoute: true },
    },

    // PRIVATE ROUTES FOR MAIN APP
    {
      path: "/interface/:organizationId?/inbox",
      name: "inbox",
      redirect: (to) => {
        return { name: "explore", params: to.params }
      },
    },
    {
      path: "/interface/:organizationId?/explore",
      name: "explore",
      components: {
        default: () => import("../views/Explore.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { mainListingPage: true },
    },
    {
      path: "/interface/:organizationId?/sessionsList",
      name: "sessionsList",
      components: {
        default: () => import("../views/SessionsList.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { sessionListingPage: true, sessionPage: true },
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
      path: "/interface/:organizationId?/conversations/create",
      name: "conversations create",
      components: {
        default: () => import("../views/ConversationsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId",
      name: "conversations overview",
      components: {
        default: () => import("../views/ConversationsOverview.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: { conversationDetailPage: true },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/transcription",
      name: "conversations transcription",
      components: {
        default: () => import("../views/ConversationsTranscription.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: { conversationDetailPage: true },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/subtitles",
      name: "conversations subtitles",
      components: {
        default: () => import("../views/ConversationsSubtitlesMenu.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { conversationDetailPage: true },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/subtitles/:subtitleId",
      name: "conversations subtitle",
      components: {
        default: () => import("../views/ConversationsSubtitle.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: { conversationDetailPage: true },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/publish",
      name: "conversations publish",
      components: {
        default: () => import("../views/ConversationsPublish.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: { conversationDetailPage: true },
    },
    {
      path: "/interface/:organizationId?/sessions/create",
      name: "sessions create",
      components: {
        default: () => import("../views/SessionsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { sessionPage: true },
    },
    {
      path: "/interface/:organizationId?/sessions/:sessionId",
      name: "sessions live",
      components: {
        default: () => import("../views/SessionLive.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { public: true, sessionPage: true, responsive: true },
    },
    {
      path: "/interface/:organizationId?/sessions/:sessionId/settings",
      name: "sessions settings",
      components: {
        default: () => import("../views/SessionSettings.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { public: false, sessionPage: true },
    },
    {
      path: "/interface/:organizationId?/quick-session",
      name: "quick session",
      components: {
        default: () => import("../views/QuickSession.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { public: true, sessionPage: true },
    },
    {
      path: "/interface/organizations/create",
      name: "organizations create",
      components: {
        default: () => import("../views/OrganizationsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: { userPage: true },
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
      path: "/interface/:organizationId?/tags/settings",
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
  const randomId = Math.random().toString(36).substring(7)
  const routerDebug = customDebug("vue:debug:router:" + randomId)
  const enableSession = getEnv("VUE_APP_ENABLE_SESSION") === "true"
  try {
    routerDebug("beforeEach from", from.fullPath, "to", to.fullPath)
    // Redirections 404
    if (!enableSession && to.meta?.sessionPage) {
      return next({ name: "not_found" })
    }

    // Redirections 404
    if (to.name === "not_found_redirect") {
      return next({ name: "not_found" })
    }

    // -- Magic link authentication --
    if (to.name === "magic-link-login") {
      const conversationId = to?.query?.conversationId
      const magicId = to?.params?.magicId

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
        return next(redirect)
      } else {
        return next({ name: "magic-link-error" })
      }
    }

    // -- User is not authenticated: redirect to login except if public page --
    if (!isAuthenticated()) {
      if (to.meta?.public) {
        return next()
      } else {
        return next({
          name: "login",
          query: { next: from.query.next || to.fullPath },
        })
      }
    }

    // -- User is authenticated --

    // fetch user
    const reqUser = await store.dispatch("user/fetchUser")
    if (reqUser.status === "error") {
      // For now logout
      // TODO: handle error if api is down -> error page. Only logout if user is not found
      logout()
      return next({
        name: "login",
        query: { next: from.query.next || to.fullPath },
      })
    }

    routerDebug("User fetched")

    // fetch organizations
    const reqOrganizations = await store.dispatch(
      "organizations/fetchOrganizations",
    )
    if (reqOrganizations.status === "error") {
      // For now logout
      // TODO: redirect to some error page
      logout()
      return next({
        name: "login",
        query: { next: from.query.next || to.fullPath },
      })
    }

    routerDebug("Organizations fetched")

    if (store.getters["organizations/getOrganizationLength"] === 0) {
      // TODO: page to create organization
      routerDebug("No organization")
      logout()
      return next({
        name: "login",
        query: { next: from.query.next || to.fullPath },
      })
    }

    if (from.query.next && from.query.next !== to.fullPath) {
      routerDebug("Redirect to next", from.query.next)
      return next(from.query.next)
    }

    // If user try to access an auth route > redirect to conversations
    if (
      to.fullPath === "/" ||
      to.fullPath === "/interface" ||
      to.meta?.authRoute
    ) {
      routerDebug("Redirect to explore from auth route or root")
      // organizationId is setted in the next step
      return next({
        name: "explore",
      })
    }

    if (!to.meta?.userPage) {
      routerDebug("Check organizationId in params", to.params.organizationId)
      if (
        !to.params.organizationId ||
        store.getters["organizations/getOrganizationById"](
          to.params.organizationId,
        ) === undefined
      ) {
        const defaultOrganizationId =
          store.getters["organizations/getDefaultOrganizationId"]
        routerDebug("Redirect to default organization", defaultOrganizationId)
        return next({
          ...to,
          params: {
            ...to.params,
            organizationId: defaultOrganizationId,
          },
        })
      } else {
        routerDebug("Set current organization scope", to.params.organizationId)
        store.dispatch(
          "organizations/setCurrentOrganizationScope",
          to.params.organizationId,
        )
      }
    }

    // if quick session is running, redirect to session live
    if (enableSession && to.name !== "quick session") {
      routerDebug("Check quick session")
      const quickSession = await apiGetQuickSession()
      if (quickSession) {
        routerDebug("Quick session found > redirect to quick session")
        return next({
          name: "quick session",
          params: { organizationId: quickSession.organizationId },
          query: { recover: "true" },
        })
      }
    }

    // check if user is allowed to access conversation detail pages
    if (to.meta?.conversationDetailPage) {
      routerDebug("Check conversation detail page")
      const conversationId = to.params.conversationId
      let userRight = 0

      let getUserRight = await apiGetUserRightFromConversation(conversationId)

      if (getUserRight) {
        userRight = getUserRight?.right
      }

      if (userRight > 0) {
        routerDebug("User has right > next")
        return next()
      }

      routerDebug("User has no right > redirect to not found")
      return next({ name: "not_found" })
    } else if (to.meta?.backoffice) {
      routerDebug("Check backoffice route")
      return next()
    } else {
      routerDebug("No specific route > next")
      return next()
    }
  } catch (error) {
    console.error(error)
  }
})
export default router
