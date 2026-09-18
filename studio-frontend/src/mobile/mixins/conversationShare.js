import { mapGetters } from "vuex"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"
import {
  loadConversationShare,
  setDefaultRight,
  setUserRight,
  inviteByEmail,
} from "@/mobile/services/share/conversationShare.js"
import { splitOrganizationMembers } from "@/mobile/tools/splitOrganizationMembers.js"
import { describeSearchResults } from "@/mobile/tools/describeSearchResults.js"
import { shouldOfferInvite } from "@/mobile/tools/shouldOfferInvite.js"

// Sharing state of one media (the `media` prop) and the actions of the
// share sheet. Expects the userSearch mixin alongside (searchText, results).
export const conversationShareMixin = {
  props: {
    media: { type: Object, default: null },
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      defaultRight: 0,
      organizationMembers: [],
      externalMembers: [],
      busyIds: {},
    }
  },
  computed: {
    ...mapGetters("organizations", { orgUsers: "getCurrentOrganizationUsers" }),
    roleById() {
      return new Map(this.orgUsers.map((user) => [user._id, user.role]))
    },
    sections() {
      return splitOrganizationMembers(
        this.organizationMembers,
        this.roleById,
        this.defaultRight,
        ORGANIZATION_ROLES.MAINTAINER,
      )
    },
    sharedUsers() {
      return [...this.organizationMembers, ...this.externalMembers]
    },
    searchResults() {
      return describeSearchResults(this.results, {
        roleById: this.roleById,
        sharedById: new Map(this.sharedUsers.map((user) => [user._id, user])),
        defaultRight: this.defaultRight,
        privilegedRole: ORGANIZATION_ROLES.MAINTAINER,
        adminRole: ORGANIZATION_ROLES.ADMINISTRATOR,
      })
    },
    inviteOffered() {
      return shouldOfferInvite(this.searchText, this.results, this.sharedUsers)
    },
  },
  methods: {
    async load() {
      if (!this.media) return
      this.loading = true
      this.defaultRight = this.media.organization?.membersRight ?? 0
      const loaded = await this.reloadMembers()
      if (!loaded) this.notify("showError", "mobile.share.load_failed")
      this.loading = false
    },
    async reloadMembers() {
      const share = await loadConversationShare(this.media._id)
      if (!share) return false
      this.organizationMembers = share.organizationMembers
      this.externalMembers = share.externalMembers
      return true
    },
    async changeDefaultRight(right) {
      const ok = await setDefaultRight(this.media._id, right)
      if (!ok) return this.notify("showError", "mobile.share.update_failed")
      this.defaultRight = right
      // The list item is the shared store object, as in the classic panel.
      if (this.media.organization) this.media.organization.membersRight = right
      await this.reloadMembers()
    },
    async changeUserRight(user, right) {
      if (this.busyIds[user._id]) return
      this.$set(this.busyIds, user._id, true)
      const ok = await setUserRight(
        this.media._id,
        this.organizationId,
        user._id,
        right,
      )
      this.$set(this.busyIds, user._id, false)
      if (!ok) return this.notify("showError", "mobile.share.update_failed")
      this.notify("showSuccess", "share_menu.user_right_updated")
      await this.reloadMembers()
    },
    async invite(email) {
      const ok = await inviteByEmail(this.media._id, this.organizationId, email)
      if (!ok) return this.notify("showError", "mobile.share.invite_failed")
      this.notify("showSuccess", "share_menu.user_has_been_invited")
      this.resetSearch()
      await this.reloadMembers()
    },
    notify(action, key) {
      this.$store.dispatch(`system/${action}`, this.$t(key))
    },
  },
}
