// Every route is private unless it carries meta.public. The guard
// (authGuard.js) reads that flag; views never check authentication.
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
    component: () => import("@/mobile/views/LivePrepare.vue"),
  },
  {
    path: "*",
    name: "not-found",
    meta: { public: true },
    component: () => import("@/mobile/views/NotFound.vue"),
  },
]
