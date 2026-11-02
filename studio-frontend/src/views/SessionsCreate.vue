<template>
  <LayoutV2 customClass="explore-next">
    <Loading v-if="loading" block />
    <div v-else class="flex col flex1 medium-margin">
      <SessionCreateContent
        :sessionTemplates="sessionTemplates"
        :transcriberProfiles="transcriberProfiles"
        :currentOrganizationScope="currentOrganizationScope"
        :preloadTemplateId="preloadTemplateId" />
    </div>
  </LayoutV2>
</template>
<script>
import { getEnv } from "@/tools/getEnv.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"

import {
  apiGetSessionTemplates,
  apiGetTranscriberProfilesByOrganization,
} from "@/api/session.js"

import LayoutV2 from "@/layouts/v2-layout.vue"
import SessionCreateContent from "@/components/SessionCreateContent.vue"

export default {
  mixins: [orgaRoleMixin, organizationPermissionsMixin],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      sessionTemplates: null,
      transcriberProfiles: [],
    }
  },
  async created() {
    // In SaaS the session permission depends on the org's plan: know it before
    // deciding whether the page is accessible.
    if (getEnv("VUE_APP_MODE") === "cloud") {
      await this.$store.dispatch(
        "billing/fetchUsage",
        this.currentOrganizationScope,
      )
    }
    if (!this.canCreateSession) {
      this.$router.push({ name: "not_found" })
      return
    }
    // The form reads its templates at creation: render it once they are loaded.
    const [transcriberProfiles, sessionTemplates] = await Promise.all([
      apiGetTranscriberProfilesByOrganization(this.currentOrganizationScope),
      apiGetSessionTemplates(this.currentOrganizationScope),
    ])
    this.transcriberProfiles = transcriberProfiles
    this.sessionTemplates = sessionTemplates
    this.loading = false
  },
  computed: {
    canCreateSession() {
      return (
        this.isAtLeastMeetingManager && this.canSessionInCurrentOrganization
      )
    },
    preloadTemplateId() {
      return this.$route.query.template ?? null
    },
  },
  components: {
    LayoutV2,
    SessionCreateContent,
  },
}
</script>
