import { mapGetters } from "vuex"

export const mediaScopeMixin = {
  computed: {
    storeScope() {
      return (
        this.getCurrentScope.replace(
          "organization",
          this.getCurrentOrganizationScope + "/" + this.getCurrentFilterStatus,
        ) + "/conversations"
      )
    },
    ...mapGetters("organizations", [
      "getCurrentScope",
      "getCurrentOrganizationScope",
      "getCurrentFilterStatus",
    ]),
    selectedMedias() {
      return this.$store.state[this.storeScope].selectedMedias ?? []
    },
    isSelectAll() {
      const value = this.$store.state[this.storeScope].autoselectMedias ?? false
      return value
    },
    selectedTagsIds() {
      return this.$store.state[this.storeScope].selectedTagIds ?? []
    },
    searchValue() {
      return this.$store.getters[`${this.storeScope}/search`]
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
    toggleSelectedTag(tag) {
      return this.$store.dispatch(
        `${this.storeScope}/toggleSelectedTagId`,
        tag._id,
      )
    },
    mediaRight(mediaId) {
      const right =
        this.$store.getters[`${this.storeScope}/getSelfMediaRight`](mediaId)
      return right
    },
  },
}
