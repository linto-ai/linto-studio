import { ORGANIZATION_PERMISSIONS } from "@/const/organizationPermissions"

export const organizationPermissionsMixin = {
  methods: {
    hasNoPermission(permission) {
      return permission === 0
    },
    hasPermission: (userRight, desiredRight) =>
      (userRight & desiredRight) == desiredRight,
    hasUploadPermission(permission) {
      return this.hasPermission(permission, ORGANIZATION_PERMISSIONS.UPLOAD)
    },
    hasSummaryPermission(permission) {
      return this.hasPermission(permission, ORGANIZATION_PERMISSIONS.SUMMARY)
    },
    hasSessionPermission(permission) {
      return this.hasPermission(permission, ORGANIZATION_PERMISSIONS.SESSION)
    },
    hasMicrophonePermission(permission) {
      return this.hasPermission(permission, ORGANIZATION_PERMISSIONS.MICROPHONE)
    },
    hasBotPermission(permission) {
      return this.hasPermission(permission, ORGANIZATION_PERMISSIONS.BOT)
    },
    computePermissionsNumber({
      upload = false,
      summary = false,
      session = false,
      microphone = false,
      bot = false,
    }) {
      return (
        (upload ? ORGANIZATION_PERMISSIONS.UPLOAD : 0) +
        (summary ? ORGANIZATION_PERMISSIONS.SUMMARY : 0) +
        (session ? ORGANIZATION_PERMISSIONS.SESSION : 0) +
        (microphone ? ORGANIZATION_PERMISSIONS.MICROPHONE : 0) +
        (bot ? ORGANIZATION_PERMISSIONS.BOT : 0)
      )
    },
  },
  computed: {
    organizationPermissions() {
      return this.$store.getters["organizations/getCurrentOrganization"]
        .permissions
    },
    canUploadInCurrentOrganization() {
      return this.hasUploadPermission(this.organizationPermissions)
    },
    canSummaryInCurrentOrganization() {
      return this.hasSummaryPermission(this.organizationPermissions)
    },
    canSessionInCurrentOrganization() {
      return this.hasSessionPermission(this.organizationPermissions)
    },
    canMicrophoneInCurrentOrganization() {
      return this.hasMicrophonePermission(this.organizationPermissions)
    },
    canBotInCurrentOrganization() {
      return this.hasBotPermission(this.organizationPermissions)
    },
    canStartConversationInCurrentOrganization() {
      return (
        this.canUploadInCurrentOrganization ||
        this.canSessionInCurrentOrganization ||
        this.canMicrophoneInCurrentOrganization ||
        this.canBotInCurrentOrganization
      )
    },
  },
}
