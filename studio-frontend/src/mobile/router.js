import Vue from "vue"
import Router from "vue-router"

import { MOBILE_ROUTES } from "@/mobile/router/routes.js"
import { authGuard } from "@/mobile/router/authGuard.js"
import { MOBILE_BASE } from "@/mobile/const/appTarget.js"

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: MOBILE_BASE,
  routes: MOBILE_ROUTES,
})

router.beforeEach(authGuard)

export default router
