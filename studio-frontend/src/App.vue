<template>
  <div id="app">
    <div id="app-view" class="flex col flex1">
      <div class="app-view-content flex col flex1">
        <router-view
          :userInfo="user"
          :currentOrganizationScope="currentOrganizationScope"
          :currentOrganization="currentOrganization" />
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { mapActions, mapGetters } from "vuex"
import { customDebug } from "@/tools/customDebug.js"

export default {
  props: {},
  data() {
    return {
      appDebug: customDebug("vue:debug:app"),
      noOrganization: false,
    }
  },
  async mounted() {},
  methods: {
    ...mapActions("user", ["fetchUser"]),
    ...mapActions("organizations", ["fetchOrganizations"]),
  },
  computed: {
    ...mapGetters("user", { user: "getUserInfos" }),
    currentOrganizationScope: function () {
      return this.$route.params.organizationId
    },
    currentOrganization: function () {
      return this.$store.getters["organizations/getOrganizationById"](
        this.currentOrganizationScope,
      )
    },
  },
  components: {},
}
</script>
<style lang="scss">
@import "@/style/style.scss";
</style>
