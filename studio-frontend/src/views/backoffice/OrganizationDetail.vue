<template>
  <MainContentBackoffice :loading="loading">
    <template v-slot:header>
      <div class="flex1 flex align-center gap-small">
        <h1 v-if="organization" class="flex1">{{ organization.name }}</h1>
        <Button
          @click="viewAsOrganization(organizationId)"
          variant="tertiary"
          icon="eye"
          style="white-space: nowrap"
          :label="$t('impersonation.browse_button_label')" />
        <Button
          :to="{
            name: 'backoffice-activityList',
            query: { tab: 'sessions_kpi', org: organizationId },
          }"
          variant="tertiary"
          icon="chart-pie"
          style="white-space: nowrap"
          :label="$t('organisation.sessions_kpi_link')" />
      </div>
    </template>
    <div class="flex gap-large">
      <div class="flex1">
        <Tabs v-model="activeTab" :tabs="tabs" />

        <template v-if="activeTab === 'general'">
          <UpdateOrganizationForm :currentOrganization="organization" />
          <UpdateOrganizationMatchingUsers
            :currentOrganization="organization" />
          <section>
            <h2 class="medium-margin-bottom">Danger zone</h2>
            <Button
              @click="openDeleteModal"
              variant="primary"
              icon="trash"
              :label="$t('organisation.delete_organization')"
              intent="destructive" />
          </section>
        </template>

        <template v-if="activeTab === 'permissions'">
          <UpdateOrganizationPermissions :currentOrganization="organization" />
          <UpdateOrganizationSecurityLevel
            v-if="enableSecurityLevel"
            :currentOrganization="organization" />
        </template>

        <UpdateOrganizationUsers
          v-if="activeTab === 'members'"
          :currentOrganization="organization"
          :userInfo="userInfo" />

        <UpdateOrganizationTranscriberProfiles
          v-if="activeTab === 'profiles'"
          :organizationId="organizationId" />

        <section v-if="activeTab === 'billing'">
          <BackofficeOrgBilling :organizationId="organizationId" />
        </section>

        <section v-if="activeTab === 'api'">
          <ApiTokenSettings :organizationId="organizationId" />
        </section>
      </div>
      <!-- <div style="width: 450px">
        <OrganizationStats :organizationId="organizationId" />
      </div> -->
    </div>
    <ModalDeleteOrganization
      v-if="displayDeleteModal"
      :currentOrganization="organization"
      :currentOrganizationScope="organizationId"
      @on-confirm="confirmDeletion"
      @on-cancel="closeDeleteModal" />
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"

import { apiGetOrganizationById } from "@/api/organisation.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { impersonationMixin } from "@/mixins/impersonation.js"
import { routeTabMixin } from "@/mixins/routeTab.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UpdateOrganizationForm from "@/components/UpdateOrganizationForm.vue"
import UpdateOrganizationUsers from "@/components/UpdateOrganizationUsers.vue"
import ModalDeleteOrganization from "@/components/ModalDeleteOrganization.vue"
import UpdateOrganizationPermissions from "@/components/UpdateOrganizationPermissions.vue"
import UpdateOrganizationSecurityLevel from "@/components/UpdateOrganizationSecurityLevel.vue"
import UpdateOrganizationMatchingUsers from "@/components/UpdateOrganizationMatchingUsers.vue"
import UpdateOrganizationTranscriberProfiles from "@/components/UpdateOrganizationTranscriberProfiles.vue"
import ApiTokenSettings from "@/components/ApiTokenSettings.vue"
import Button from "@/components/atoms/Button.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import BackofficeOrgBilling from "@/components-cloud/BackofficeOrgBilling.vue"

export default {
  mixins: [platformRoleMixin, impersonationMixin, routeTabMixin],
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      organizationId: this.$route.params.organizationId,
      organization: null,
      displayDeleteModal: false,
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    bus.$on("user_orga_update", this.fetchOrganization)
    this.fetchOrganization()
  },
  beforeDestroy() {
    bus.$off("user_orga_update", this.fetchOrganization)
  },
  computed: {
    enableSecurityLevel() {
      return getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true"
    },
    tabs() {
      const tabs = [
        { name: "general", icon: "gear" },
        { name: "permissions", icon: "shield-check" },
        { name: "members", icon: "users" },
        { name: "profiles", icon: "waves" },
      ]
      if (getEnv("VUE_APP_MODE") === "cloud") {
        tabs.push({ name: "billing", icon: "credit-card" })
      }
      tabs.push({ name: "api", icon: "key" })
      return tabs.map((tab) => ({
        ...tab,
        label: this.$t(`backoffice.organisation_detail.tab.${tab.name}`),
      }))
    },
  },
  methods: {
    // A reload after an edit replaces the data in place: unmounting the page
    // would reset every block and send the scroll back to the top.
    async fetchOrganization() {
      this.loading = this.organization === null
      this.organization = await apiGetOrganizationById(this.organizationId)
      this.loading = false
    },
    closeDeleteModal() {
      this.displayDeleteModal = false
    },
    openDeleteModal() {
      this.displayDeleteModal = true
    },
    confirmDeletion() {
      this.$router.push({ name: "backoffice-organizationList" })
    },
  },
  components: {
    MainContentBackoffice,
    UpdateOrganizationForm,
    UpdateOrganizationUsers,
    UpdateOrganizationPermissions,
    UpdateOrganizationSecurityLevel,
    UpdateOrganizationTranscriberProfiles,
    UpdateOrganizationMatchingUsers,
    ModalDeleteOrganization,
    ApiTokenSettings,
    Button,
    Tabs,
    BackofficeOrgBilling,
  },
}
</script>
