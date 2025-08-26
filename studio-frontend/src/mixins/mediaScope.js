import { mapGetters } from "vuex"

export const mediaScopeMixin = {
  computed: {
    storeScope() {
      return (
        this.getCurrentScope.replace(
          "organization",
          this.getCurrentOrganizationScope,
        ) + "/conversations"
      )
    },
    ...mapGetters("organizations", [
      "getCurrentScope",
      "getCurrentOrganizationScope",
    ]),
    selectedMedias() {
      return this.$store.state[this.storeScope].selectedMedias
    },
    isSelectAll() {
      return this.$store.state[this.storeScope].autoselectMedias
    },
  },
  methods: {
    clearSelectedMedias() {
      return this.$store.dispatch(`${this.storeScope}/clearSelectedMedias`)
    },
    selectAll() {
      return this.$store.dispatch(`${this.storeScope}/selectAll`)
    },
    toggleMediaSelection(media) {
      return this.$store.dispatch(
        `${this.storeScope}/toggleMediaSelection`,
        media,
      )
    },
    deleteMedias(ids) {
      return this.$store.dispatch(`${this.storeScope}/deleteMedias`, ids)
    },
  },
}
