<template>
  <div class="flex gap-small flex1 align-center">
    <Avatar :src="userAvatar" size="lg" />
    <div class="flex col flex1 gap-small">
      <span class="user-name">{{ UserName }}</span>
      <div class="flex gap-small">
        <Button
          @click="openOrganizationSelector"
          :label="orgaName"
          size="xs"
          class="organization-name flex1"></Button>
        <span class="user-role">{{ roleToString }}</span>
      </div>
    </div>
    <Button
      icon="gear"
      variant="transparent"
      color="neutral"
      @click="openSettingsModal"></Button>
    <ModalSwitchOrg
      v-model="modalOrganizationSelector"
      @close="modalOrganizationSelector = false" />
  </div>
  <!-- <PopoverList
    :items="navList.userMenu"
    @click="handleClick"
    class="user-account-selector"
    :close-on-click="true"
    width="ref">
    <template #trigger="{ open }">
      <Button
        :avatar="userAvatar"
        :avatar-text="uname"
        :avatar-color="getColorFromText(UserName)"
        :icon-right="open ? 'caret-up' : 'caret-down'"
        variant="outline"
        block>
        {{ UserName }}
      </Button>
    </template>
  </PopoverList> -->
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { userName } from "@/tools/userName"
import userAvatar from "@/tools/userAvatar"
import { getColorFromText } from "@/tools/colors"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"

import UserProfilePicture from "@/components/atoms/UserProfilePicture.vue"

export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
  props: {},
  data() {
    return {
      active: false,
      modalOrganizationSelector: false,
    }
  },
  mounted() {},
  beforeDestroy() {},
  computed: {
    ...mapGetters("user", {
      userInfo: "getUserInfos",
    }),
    ...mapGetters("organizations", {
      organizations: "getOrganizations",
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    UserName() {
      return userName(this.userInfo)
    },
    uname() {
      return this.UserName.length > 2
        ? this.UserName.slice(0, 2)
        : this.UserName
    },
    userAvatar() {
      return userAvatar(this.userInfo)
    },
    orgaName() {
      return this.currentOrganization?.name
    },
  },
  methods: {
    openOrganizationSelector() {
      this.modalOrganizationSelector = true
    },
    openSettingsModal() {
      this.$store.dispatch("settings/setModalOpen", true)
    },
  },
  components: {
    UserProfilePicture,
    ModalSwitchOrg,
  },
}
</script>

<style lang="scss">
.user-name {
  font-weight: bold;
}

.user-account-selector {
  position: relative;
  display: block;
}

.organization-name {
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.25rem;
  text-transform: capitalize;

  .btn-prefix-label {
    overflow: hidden;

    .label {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.user-role {
  color: var(--text-secondary);
}
</style>
