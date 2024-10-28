import isSessionStarted from "../tools/isSessionStarted"

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
      if (this?.session?.startTime) {
        return new Date(this?.session?.startTime)
      } else {
        return null
      }
    },
    endTime() {
      if (this?.session?.endTime) {
        return new Date(this?.session?.endTime)
      } else {
        return null
      }
    },
    startTimeFormatted() {
      const startTime = this?.session?.startTime

      if (startTime) {
        const options = {
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }

        return new Date(startTime).toLocaleDateString(undefined, options)
      } else {
        return "–"
      }
    },
    endTimeFormatted() {
      const endTime = this?.session?.endTime

      if (endTime) {
        const options = {
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }

        return new Date(endTime).toLocaleDateString(undefined, options)
      } else {
        return "–"
      }
    },
    isPending() {
      return this?.session?.status === "ready"
    },
    isStarted() {
      return isSessionStarted(this.session)
    },
    isActive() {
      return this?.session?.status === "active"
    },
    isTerminated() {
      return this?.session?.status === "terminated"
    },
    autoStart() {
      return this?.session?.autoStart ?? false
    },
    autoStop() {
      return this?.session?.autoStop ?? false
    },
    publicLink() {
      const baseUrl = window.location.origin
      return `${baseUrl}/interface/${this.sessionOrganizationId}/sessions/${this.id}`
    },
    channels() {
      return this?.session?.channels ?? []
    },
    isPublic() {
      return this?.session?.visibility === "public"
    },
    sessionOrganizationId() {
      return this?.session?.organizationId
    },
    conversationId() {
      return this?.session?.conversationId
    },
    room() {
      return this.$t("session.room_undefined")
    },
  },
}
