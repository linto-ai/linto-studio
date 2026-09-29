// Every route is private unless it carries meta.public. Routes carrying
// meta.upload or meta.live also need those rights in the current
// organization. The guard (authGuard.js) reads these flags; views never check
// access themselves.
export const MOBILE_ROUTES = [
  {
    path: "/",
    name: "home",
    component: () => import("@/mobile/views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: { public: true },
    component: () => import("@/mobile/views/Login.vue"),
  },
  {
    path: "/record",
    name: "record",
    meta: { upload: true },
    component: () => import("@/mobile/views/Record.vue"),
  },
  {
    path: "/media/:folderId?",
    name: "media",
    component: () => import("@/mobile/views/Media.vue"),
  },
  {
    path: "/conversations/:conversationId",
    name: "conversation",
    component: () => import("@/mobile/views/Conversation.vue"),
  },
  {
    path: "/live",
    name: "live",
    meta: { live: true },
    component: () => import("@/mobile/views/LivePrepare.vue"),
  },
  {
    path: "/live/session",
    name: "live-session",
    meta: { live: true },
    component: () => import("@/mobile/views/LiveSession.vue"),
  },
  {
    path: "*",
    name: "not-found",
    meta: { public: true },
    component: () => import("@/mobile/views/NotFound.vue"),
  },
]
