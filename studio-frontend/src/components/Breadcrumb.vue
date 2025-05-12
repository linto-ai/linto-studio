<template>
  <nav class="flex row breadcrumb align-center" aria-label="breadcrumbs">
    <!-- <router-link :to="{ name: 'inbox' }" class="breadcrumb__element">
      <span class="icon home"></span>
      <span>Studio</span>
    </router-link> -->
    <OrganizationSelector
      :currentOrganizationScope="currentOrganizationScope"
      :currentOrganization="currentOrganization" />
    <!-- <span class="icon right-arrow breadcrumb__separator" />
    <span class="breadcrumb__element">{{ userName }} – {{ RoleToString }}</span> -->
    <span
      class="icon right-arrow breadcrumb__separator"
      v-if="
        (mainListingPage || sessionListingPage) &&
        isAtLeastUploader &&
        (canUploadInCurrentOrganization || canSessionInCurrentOrganization)
      " />
    <!-- <span class="breadcrumb__element">{{ currentRoute.name }}</span> -->
    <router-link
      id="upload-media-button"
      :title="createTitle"
      :to="{
        name: 'conversations create',
        params: { organizationId: currentOrganizationScope },
      }"
      class="btn nav-link green no-shrink"
      tag="button"
      v-if="
        (mainListingPage || sessionListingPage) &&
        isAtLeastUploader &&
        (canUploadInCurrentOrganization || canSessionInCurrentOrganization)
      ">
      <span class="icon new"></span>
      <!-- <span class="label">{{ $t("navigation.conversation.create") }}</span> -->
      <span class="label">{{ $t("navigation.conversation.start") }}</span>
    </router-link>
  </nav>
</template>
<script>
import { Fragment } from "vue-fragment"
import { mapGetters } from "vuex"
import { userName } from "@/tools/userName"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"

import OrganizationSelector from "@/components/OrganizationSelector.vue"

export default {
  mixins: [orgaRoleMixin, organizationPermissionsMixin],
  data() {
    return {}
  },
  computed: {
    currentRoute() {
      return this.$route
    },
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    userName() {
      return userName(this.user)
    },
    isUserPage() {
      return this.$route.meta?.userPage
    },
    mainListingPage() {
      return this.$route.meta?.mainListingPage
    },
    sessionListingPage() {
      return this.$route.meta?.sessionListingPage
    },
    createTitle() {
      if (!this.isAtLeastUploader) {
        return this.$t("navigation.conversation.create_no_rights_error")
      } else {
        return this.$t("navigation.conversation.create")
      }
    },
    createSessionTitle() {
      if (!this.isAtLeastUploader) {
        return this.$t("navigation.session.create_no_rights_error")
      } else {
        return this.$t("navigation.session.create")
      }
    },
  },
  methods: {},
  components: { Fragment, OrganizationSelector },
}
</script>
