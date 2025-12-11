<template>
  <MainContentBackoffice :loading="loading">
    <template v-slot:header>
      <div class="flex align-center">
        <h1 v-if="organization">{{ organization.name }}</h1>
      </div>
    </template>
    <Tabs :tabs="tabs" v-model="currentTab" />
    <div class="flex gap-large" v-if="currentTab == 'settings'">
      <div class="flex1">
        <div>
          <UpdateOrganizationForm :currentOrganization="organization" />
          <UpdateOrganizationMatchingUsers
            :currentOrganization="organization" />
          <UpdateOrganizationPermissions :currentOrganization="organization" />
        </div>

        <UpdateOrganizationUsers
          :currentOrganization="organization"
          :userInfo="userInfo" />

        <UpdateOrganizationTranscriberProfiles
          :organizationId="organizationId" />
        <section>
          <ApiTokenSettings :organizationId="organizationId" />
        </section>
        <section>
          <h2 class="medium-margin-bottom">Danger zone</h2>
          <Button
            @click="openDeleteModal"
            variant="primary"
            icon="trash"
            :label="$t('organisation.delete_organization')"
            intent="destructive" />
          <!-- <button @click="openDeleteModal" class="btn tertiary outline">
        <ph-icon name="trash"></ph-icon>
        <span class="label">{{ $t("organisation.delete_organization") }}</span>
      </button> -->
        </section>
      </div>
      <div style="width: 450px">
        <OrganizationStats :organizationId="organizationId" />
      </div>
    </div>
    <div v-if="currentTab == 'sessions'">
      <OrganizationSessionsKpi
        v-if="organization"
        :organizationId="organizationId"
        :organization="organization" />
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

import { apiGetOrganizationById } from "@/api/organisation.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UpdateOrganizationForm from "@/components/UpdateOrganizationForm.vue"
import UpdateOrganizationUsers from "@/components/UpdateOrganizationUsers.vue"
import ModalDeleteOrganization from "@/components/ModalDeleteOrganization.vue"
import UpdateOrganizationPermissions from "@/components/UpdateOrganizationPermissions.vue"
import UpdateOrganizationMatchingUsers from "@/components/UpdateOrganizationMatchingUsers.vue"
import OrganizationStats from "@/components/OrganizationStats.vue"
import UpdateOrganizationTranscriberProfiles from "@/components/UpdateOrganizationTranscriberProfiles.vue"
import ApiTokenSettings from "@/components/ApiTokenSettings.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import OrganizationSessionsKpi from "@/components/OrganizationSessionsKpi.vue"

export default {
  mixins: [platformRoleMixin],
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
      tabs: [
        { name: "settings", label: "Settings", icon: "gear" },
        {
          name: "sessions",
          label: "Statistique des sessions",
          icon: "broadcast",
        },
      ],
      currentTab: "settings",
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
  methods: {
    async fetchOrganization() {
      this.loading = true
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
    UpdateOrganizationTranscriberProfiles,
    UpdateOrganizationMatchingUsers,
    ModalDeleteOrganization,
    OrganizationStats,
    ApiTokenSettings,
    Tabs,
    OrganizationSessionsKpi,
  },
}
</script>
