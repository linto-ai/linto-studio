export const sessionModelMixin = {
  computed: {
    name() {
      return this?.session?.name
    },
    id() {
      return this?.session?.id
    },
    startTime() {
      return this?.session?.start_time ?? this.$t("session.start_undefined")
    },
    endTime() {
      return this?.session?.end_time ?? this.$t("session.end_undefined")
    },
    isPending() {
      return this?.session?.status === "ready"
    },
    isStarted() {
      return this?.session?.status === "active"
    },
    autoStart() {
      return this?.session?.auto_start ?? false
    },
    publicLink() {
      return "/interface/sessions/" + this.id
    },
    channels() {
      return this?.session?.channels ?? []
    },
    isPublic() {
      return this?.session?.public ?? false
    },
  },
}
