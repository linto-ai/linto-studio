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
}

const componentsWithoutHeader = {}

// it's **not** a boolean do describe if the component is displayed or not
// it tells if the route params will be passed to the components as props
const defaultProps = {
  default: true,
  AppHeader: true,
}

Vue.use(Router)

// Helper functions for router guards
const authGuards = {
  isAuthenticated: () => {
    return getCookie("authToken") !== null
  },

  async handleMagicLinkAuth(to, next) {
    const conversationId = to?.query?.conversationId
    const magicId = to?.params?.magicId

    const login = await apiLoginUserMagicLink(magicId)
    if (login.status === "success") {
      setCookie("userId", login.data.user_id, 7)
      setCookie("authToken", login.data.auth_token, 7)
      setCookie("refreshToken", login.data.refresh_token, 14)
      setCookie("cm_orga_scope", "")

      let redirect = conversationId
        ? { path: "/interface/conversations/" + conversationId }
        : { name: "inbox" }

      return next(redirect)
    } else {
      return next({ name: "magic-link-error" })
    }
  },

  async checkUserAuth(next, to, from) {
    const reqUser = await store.dispatch("user/fetchUser")
    if (reqUser.status === "error") {
      logout()
      return next({
        name: "login",
        query: { next: from.query.next || to.fullPath },
      })
    }

    return reqUser
  },

  async handleOrganizationScope(to, next) {
    const defaultOrganizationId =
      store.getters["organizations/getDefaultOrganizationId"]

    if (!to.meta?.userPage && !to.meta?.backoffice) {
      if (
        !to.params.organizationId ||
        store.getters["organizations/getOrganizationById"](
          to.params.organizationId,
        ) === undefined
      ) {
        return {
          redirect: true,
          nextRoute: {
            ...to,
            params: {
              ...to.params,
              organizationId: defaultOrganizationId,
            },
          },
        }
      } else {
        await store.dispatch(
          "organizations/setCurrentOrganizationScope",
          to.params.organizationId,
        )
        return { redirect: false }
      }
    } else {
      store.dispatch(
        "organizations/setCurrentOrganizationScope",
        defaultOrganizationId,
      )
      return { redirect: false }
    }
  },

  async checkQuickSession(to) {
    const enableSession = getEnv("VUE_APP_ENABLE_SESSION") === "true"

    if (enableSession && to.name !== "quick session") {
      const quickSession = await apiGetQuickSession()
      if (quickSession) {
        return {
          redirect: true,
          nextRoute: {
            name: "quick session",
            params: { organizationId: quickSession.organizationId },
            query: { recover: "true" },
          },
        }
      }
    }

    return { redirect: false }
  },

  async checkConversationAccess(to) {
    if (to.meta?.conversationDetailPage) {
      const conversationId = to.params.conversationId
      const getUserRight = await apiGetUserRightFromConversation(conversationId)
      const userRight = getUserRight?.right || 0

      if (userRight > 0) {
        return { hasAccess: true }
      }

      return { hasAccess: false }
    }

    return { hasAccess: true }
  },
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
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "breadcrumb.backoffice",
          parent: null,
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/backoffice/users",
      name: "backoffice-userList",
      components: {
        default: () => import("../views/backoffice/UserList.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "breadcrumb.users",
          parent: "backoffice",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/backoffice/users/:userId",
      name: "backoffice-userDetail",
      components: {
        default: () => import("../views/backoffice/UserDetail.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "",
          parent: "backoffice-userList",
          dynamic: true,
          entity: "user",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/backoffice/organizations",
      name: "backoffice-organizationList",
      components: {
        default: () => import("../views/backoffice/OrganizationList.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "breadcrumb.organizations",
          parent: "backoffice",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/backoffice/organizations/:organizationId",
      name: "backoffice-organizationDetail",
      components: {
        default: () => import("../views/backoffice/OrganizationDetail.vue"),
        ...defaultComponents,
      },
      defaultProps,
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "",
          parent: "backoffice-organizationList",
          dynamic: true,
          entity: "organization",
          showInBreadcrumb: true,
        },
      },
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
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "breadcrumb.transcriberProfiles",
          parent: "backoffice",
          showInBreadcrumb: true,
        },
      },
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
      meta: {
        backoffice: true,
        breadcrumb: {
          label: "",
          parent: "backoffice-transcriberProfilesList",
          dynamic: true,
          entity: "transcriberProfile",
          showInBreadcrumb: true,
        },
      },
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
      meta: {
        responsive: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
    {
      path: "/login",
      name: "login",
      components: {
        default: () => import("../views/Login.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: {
        public: true,
        authRoute: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
    {
      path: "/login/oidc",
      name: "oidc-login",
      components: {
        default: () => import("../views/oidc.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: {
        public: true,
        authRoute: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
    {
      path: "/create-account",
      name: "create-account",
      components: {
        default: () => import("../views/CreateAccount.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: {
        public: true,
        authRoute: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      components: {
        default: () => import("../views/ResetPassword.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: {
        public: true,
        authRoute: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
    {
      path: "/magiclink-auth/:magicId",
      name: "magic-link-login",
      defaultProps,
      meta: {
        public: true,
        authRoute: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
    {
      path: "/magiclink-auth-invalid",
      name: "magic-link-error",
      components: {
        default: () => import("../views/ResetPasswordLogin.vue"),
        ...componentsWithoutHeader,
      },
      defaultProps,
      meta: {
        public: true,
        authRoute: true,
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
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
        default: () => import("../views/NextExplore.vue"),
        ...defaultComponents,
        favorites: false,
      },
      props: {
        ...defaultProps,
      },
      meta: {
        mainListingPage: true,
        breadcrumb: {
          label: "breadcrumb.explore",
          parent: null,
          showInBreadcrumb: true,
          isRoot: true,
        },
      },
    },
    {
      path: "/interface/favorites",
      name: "explore-favorites",
      components: {
        default: () => import("../views/NextExplore.vue"),
        ...defaultComponents,
      },
      props: {
        ...defaultProps,
        default: { favorites: true },
      },
      meta: {
        mainListingPage: true,
        breadcrumb: {
          label: "breadcrumb.favorites",
          parent: null,
          showInBreadcrumb: true,
          isRoot: true,
        },
      },
    },
    {
      path: "/interface/shared",
      name: "explore-shared",
      components: {
        default: () => import("../views/NextExplore.vue"),
        ...defaultComponents,
      },
      props: {
        ...defaultProps,
        default: { shared: true },
      },
      meta: {
        mainListingPage: true,
        breadcrumb: {
          label: "breadcrumb.shared",
          parent: null,
          showInBreadcrumb: true,
          isRoot: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/old-explore",
      name: "explore-old",
      components: {
        default: () => import("../views/OldExplore.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        mainListingPage: true,
        breadcrumb: {
          label: "breadcrumb.exploreOld",
          parent: null,
          showInBreadcrumb: true,
          isRoot: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/sessionsList",
      name: "sessionsList",
      components: {
        default: () => import("../views/SessionsList.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        sessionListingPage: true,
        sessionPage: true,
        breadcrumb: {
          label: "breadcrumb.sessions",
          parent: "explore",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/favorites",
      name: "favorites",
      components: {
        default: () => import("../views/Favorites.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        userPage: true,
        breadcrumb: {
          label: "breadcrumb.favorites",
          parent: null,
          showInBreadcrumb: true,
          isRoot: true,
        },
      },
    },
    // {
    //   path: "/interface/shared",
    //   name: "shared with me",
    //   components: {
    //     default: () => import("../views/SharedWith.vue"),
    //     ...defaultComponents,
    //   },
    //   props: defaultProps,
    //   meta: { userPage: true },
    // },
    {
      path: "/interface/:organizationId?/conversations/create",
      name: "conversations create",
      components: {
        default: () => import("../views/ConversationsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        breadcrumb: {
          label: "breadcrumb.createConversation",
          parent: "explore",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId",
      name: "conversations overview",
      components: {
        default: () => import("../views/ConversationsOverview.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: {
        conversationDetailPage: true,
        breadcrumb: {
          label: "",
          parent: "explore",
          dynamic: true,
          entity: "conversation",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/transcription",
      name: "conversations transcription",
      components: {
        default: () => import("../views/ConversationsTranscription.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: {
        conversationDetailPage: true,
        breadcrumb: {
          label: "breadcrumb.transcription",
          parent: "conversations overview",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/subtitles",
      name: "conversations subtitles",
      components: {
        default: () => import("../views/ConversationsSubtitlesMenu.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        conversationDetailPage: true,
        breadcrumb: {
          label: "breadcrumb.subtitles",
          parent: "conversations overview",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/subtitles/:subtitleId",
      name: "conversations subtitle",
      components: {
        default: () => import("../views/ConversationsSubtitle.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: {
        conversationDetailPage: true,
        breadcrumb: {
          label: "",
          parent: "conversations subtitles",
          dynamic: true,
          entity: "subtitle",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/conversations/:conversationId/publish",
      name: "conversations publish",
      components: {
        default: () => import("../views/ConversationsPublish.vue"),
        ...componentsWithoutHeader,
      },
      props: defaultProps,
      meta: {
        conversationDetailPage: true,
        breadcrumb: {
          label: "breadcrumb.publish",
          parent: "conversations overview",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/sessions/create",
      name: "sessions create",
      components: {
        default: () => import("../views/SessionsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        sessionPage: true,
        breadcrumb: {
          label: "breadcrumb.createSession",
          parent: "sessionsList",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/sessions/:sessionId",
      name: "sessions live",
      components: {
        default: () => import("../views/SessionLive.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        public: true,
        sessionPage: true,
        responsive: true,
        breadcrumb: {
          label: "",
          parent: "sessionsList",
          dynamic: true,
          entity: "session",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/sessions/:sessionId/settings",
      name: "sessions settings",
      components: {
        default: () => import("../views/SessionSettings.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        public: false,
        sessionPage: true,
        breadcrumb: {
          label: "breadcrumb.sessionSettings",
          parent: "sessions live",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/:organizationId?/quick-session",
      name: "quick session",
      components: {
        default: () => import("../views/QuickSession.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        public: true,
        sessionPage: true,
        breadcrumb: {
          label: "breadcrumb.quickSession",
          parent: "explore",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/organizations/create",
      name: "organizations create",
      components: {
        default: () => import("../views/OrganizationsCreate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        userPage: true,
        breadcrumb: {
          label: "breadcrumb.createOrganization",
          parent: "explore",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/organizations/:organizationId",
      name: "organizations update",
      components: {
        default: () => import("../views/OrganizationsUpdate.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        breadcrumb: {
          label: "",
          parent: "explore",
          dynamic: true,
          entity: "organization",
          showInBreadcrumb: true,
        },
      },
    },
    {
      path: "/interface/user/settings",
      name: "user settings",
      components: {
        default: () => import("../views/UserSettings.vue"),
        ...defaultComponents,
      },
      props: defaultProps,
      meta: {
        userPage: true,
        breadcrumb: {
          label: "breadcrumb.userSettings",
          parent: "explore",
          showInBreadcrumb: true,
        },
      },
    },
    // {
    //   path: "/interface/:organizationId?/tags/settings",
    //   name: "tags settings",
    //   components: {
    //     default: () => import("../views/ManageTags.vue"),
    //     ...defaultComponents,
    //   },
    //   props: defaultProps,
    // },
    {
      path: "*",
      name: "not_found_redirect",
      component: () => import("../views/404.vue"),
      props: {
        default: false,
        AppHeader: false,
      },
      meta: {
        breadcrumb: {
          showInBreadcrumb: false,
        },
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const randomId = Math.random().toString(36).substring(7)
  const routerDebug = customDebug("vue:debug:router:" + randomId)
  const enableSession = getEnv("VUE_APP_ENABLE_SESSION") === "true"

  document.nextRoute = to
  document.prevRoute = from

  try {
    routerDebug("beforeEach from", from.fullPath, "to", to.fullPath)

    // Redirect to 404 if sessions are disabled but trying to access session page
    if (!enableSession && to.meta?.sessionPage) {
      return next({ name: "not_found" })
    }

    // Redirect to 404
    if (to.name === "not_found_redirect") {
      return next({ name: "not_found" })
    }

    // Handle magic link authentication
    if (to.name === "magic-link-login") {
      return await authGuards.handleMagicLinkAuth(to, next)
    }

    // Handle non-authenticated users
    if (!authGuards.isAuthenticated()) {
      if (to.meta?.public) {
        return next()
      } else {
        return next({
          name: "login",
          query: { next: from.query.next || to.fullPath },
        })
      }
    }

    // User is authenticated

    // Fetch user data
    routerDebug("Fetching user data")
    await authGuards.checkUserAuth(next, to, from)
    routerDebug("User fetched")

    // Fetch organizations
    await store.dispatch("organizations/fetchOrganizations")
    routerDebug("Organizations fetched")

    // Check if user has organizations
    if (store.getters["organizations/getOrganizationLength"] === 0) {
      routerDebug("No organization")
      logout()
      return next({
        name: "login",
        query: { next: from.query.next || to.fullPath },
      })
    }

    // Handle direct "next" query parameter
    if (from.query.next && from.query.next !== to.fullPath) {
      routerDebug("Redirect to next", from.query.next)
      return next(from.query.next)
    }

    // Redirect auth routes to main app
    if (
      to.fullPath === "/" ||
      to.fullPath === "/interface" ||
      to.meta?.authRoute
    ) {
      routerDebug("Redirect to explore from auth route or root")
      return next({ name: "explore" })
    }

    // Handle organization scope
    const orgScopeResult = await authGuards.handleOrganizationScope(to, next)
    if (orgScopeResult.redirect) {
      routerDebug("Redirect to default organization")
      return next(orgScopeResult.nextRoute)
    }

    // Fetch tags
    await store.dispatch("tags/fetchTags")
    routerDebug("Tags fetched")

    // Check for quick session
    const quickSessionResult = await authGuards.checkQuickSession(to)
    if (quickSessionResult.redirect) {
      routerDebug("Quick session found > redirect to quick session")
      return next(quickSessionResult.nextRoute)
    }

    // Check conversation access permissions
    const conversationAccess = await authGuards.checkConversationAccess(to)
    if (!conversationAccess.hasAccess) {
      routerDebug("User has no right > redirect to not found")
      return next({ name: "not_found" })
    }

    // All checks passed
    routerDebug("All checks passed > next")
    return next()
  } catch (error) {
    console.error(error)
    return next({ name: "not_found" })
  }
})
export default router
