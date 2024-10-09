export const sessionModelMixin = {
  data() {
    return {}
  },
  computed: {
    name() {
      return this?.session?.name ?? ""
    },
    id() {
      return this?.session?.id
    },
    startTime() {
      return this?.session?.startTime ?? this.$t("session.start_undefined")
    },
    endTime() {
      return this?.session?.endTime ?? this.$t("session.end_undefined")
    },
    isPending() {
      // with new api, we don't have pending status anymore. The session autostart when audio are sent, and pause when audio are not sent
      return false //this?.session?.status === "ready"
    },
    isStarted() {
      return (
        this?.session?.status === "active" || this?.session?.status === "ready"
      )
    },
    isTerminated() {
      return this?.session?.status === "terminated"
    },
    autoStart() {
      return this?.session?.auto_start ?? false
    },
    publicLink() {
      const baseUrl = window.location.origin
      return `${baseUrl}/interface/${this.sessionOrganizationId}/sessions/${this.id}`
    },
    channels() {
      return this?.session?.channels ?? []
    },
    isPublic() {
      return this?.session?.public ?? false
    },
    sessionOrganizationId() {
      return this?.session?.organizationId
    },
    conversationId() {
      return this?.session?.conversationId
    },
  },
}
