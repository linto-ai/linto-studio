import { computeRouteTab } from "@/tools/computeRouteTab.js"
import { computeTabQuery } from "@/tools/computeTabQuery.js"

// Keeps the active tab of a page in the URL (?tab=), to bind with
// <Tabs v-model="activeTab" />. The page defines a `tabs` computed; the first
// tab is the default one.
export const routeTabMixin = {
  computed: {
    activeTab: {
      get() {
        return computeRouteTab(this.tabs, this.$route.query.tab)
      },
      set(tab) {
        // Clicking the current tab is a duplicated navigation, nothing to do
        this.$router
          .replace({
            query: computeTabQuery(this.$route.query, this.tabs, tab),
          })
          .catch(() => {})
      },
    },
  },
}
