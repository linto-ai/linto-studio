<template>
  <CustomSelect class="organization-selector" :valueText="name" :value="currentOrganizationScope"
    buttonClass="transparent" icon="work" :iconText="$t('navigation.organisation.title')"
    :aria-label="$t('navigation.organisation.aria_organisations_selector')" :options="navOrganizationList"
    @input="onClickMenu">
    <template slot="button-content">
      <div class="flex1 flex gap-small align-center">
        <OrganizationBadge :organization="currentOrganization"></OrganizationBadge>
        <span class="organization-selector__name flex1">{{ UserName }}</span>
        <UserProfilePicture :hover="false" :user="userInfo" class="organization-selector__profile-picture" />
        <ph-icon name="caret-down"></ph-icon>
      </div>
    </template>
  </CustomSelect>
</template>
<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { userName } from "@/tools/userName"

import CustomSelect from "@/components/molecules/CustomSelect.vue"
import UserProfilePicture from "@/components/atoms/UserProfilePicture.vue"
import OrganizationBadge from "@/components/atoms/OrganizationBadge.vue"

export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
  props: {},
  data() {
    return {
      orgasLoaded: false,
      userOrgasLoaded: false,
      navOrganizationVisible: false,
    }
  },
  mounted() {
    bus.$on("navigation", this.closeMenu)
  },
  beforeDestroy() {
    bus.$off("navigation", this.closeMenu)
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    ...mapGetters("user", {
      userInfo: "getUserInfos",
    }),
    UserName() {
      return userName(this.userInfo)
    },
    name() {
      // if (this.$route.name === "shared with me") {
      //   return this.$t("navigation.tabs.shared")
      // } else if (this.$route.name === "favorites") {
      //   return this.$t("navigation.tabs.favorites")
      // } else if (this.$route.meta.userPage) {
      //   return this.$t("navigation.tabs.user_page")
      // }
      return `${this.currentOrganization?.name} (${this.roleToString})`
    },
    navOrganizationList() {
      const organisationItems = this.userOrganizations.map((orga) => {
        return {
          value: orga._id,
          icon: "work",
          text: `${orga.name}`,
        }
      })
      const settingsItems = [
        {
          value: "settings",
          icon: "settings",
          text: this.$t("navigation.organisation.setting"),
        },
        {
          value: "tags",
          icon: "tag",
          text: this.$t("navigation.tabs.manage_tags"),
        },
      ]

      const userMenu = [
        {
          value: "account",
          text: this.$t("navigation.account.account_link"),
          icon: "speaker",
          iconText: "Account",
          badge: this.badgeValue,
        },
        {
          value: "logout",
          text: this.$t("navigation.account.logout"),
          icon: "logout",
          iconText: "Logout",
        },
      ]

      if (this.isSessionOperator || this.isSystemAdministrator) {
        userMenu.unshift({
          value: "backoffice",
          text: this.$t("navigation.backoffice.link_title"),
          icon: "settings",
          iconText: "Backoffice",
        })
      }

      if (this.isAtLeastOrganizationInitiator) {
        settingsItems.push({
          value: "create",
          icon: "new",
          text: this.$t("navigation.organisation.create"),
        })
      }
      return {
        organisationItems,
        settingsItems,
        userMenu,
      }
    },
  },
  methods: {
    ...mapActions("organizations", ["setCurrentOrganizationScope"]),
    closeMenu() {
      this.navOrganizationVisible = false
    },
    onClickMenu(value) {
      if (value === "settings") {
        this.$router.push({
          name: "organizations update",
          params: { organizationId: this.currentOrganizationScope },
        })
      } else if (value === "create") {
        this.$router.push({
          name: "conversations create",
          params: { organizationId: currentOrganizationScope },
        })
      } else if (value === "tags") {
        this.$router.push(
          `/interface/${this.currentOrganizationScope}/tags/settings`,
        )
      } else {
        this.setCurrentOrganizationScope(value)
        this.$router.push({
          name: "explore",
          params: { organizationId: value },
        })
        this.navOrganizationVisible = false
      }
    },
  },
  components: {
    CustomSelect,
    UserProfilePicture,
    OrganizationBadge,
  },
}
</script>
