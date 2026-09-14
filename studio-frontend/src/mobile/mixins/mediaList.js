import {
  connectRealtime,
  watchOrganizationMedia,
  stopWatchingMedia,
} from "@/mobile/services/realtime/mediaUpdates.js"

// Media list of the current organization, for one status ("done" or
// "processing"). Reads the shared media store modules registered by
// organizations/setCurrentOrganizationScope; realtime updates land there.
export const mediaListMixin = {
  data() {
    return { status: "done", query: "", loading: false, loadingMore: false }
  },
  computed: {
    organizationId() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    storeScope() {
      return `${this.organizationId}/${this.status}/conversations`
    },
    medias() {
      return this.$store.getters[`${this.storeScope}/all`] ?? []
    },
    hasMore() {
      return this.$store.getters[`${this.storeScope}/hasMore`] ?? false
    },
  },
  watch: {
    status: "reloadMedias",
    "$route.params.folderId": "reloadMedias",
    organizationId(newId, oldId) {
      if (newId && newId !== oldId) this.watchAndReload()
    },
  },
  created() {
    this.watchAndReload()
  },
  beforeDestroy() {
    stopWatchingMedia()
  },
  methods: {
    async watchAndReload() {
      await connectRealtime()
      watchOrganizationMedia(this.organizationId)
      await this.reloadMedias()
    },
    // A search spans every folder; otherwise the list follows the route:
    // null = unfiled media at the top level, an id = inside that folder.
    listFolderId() {
      if (this.query) return undefined
      return this.$route.params.folderId ?? null
    },
    async reloadMedias() {
      this.loading = true
      this.$store.commit(`${this.storeScope}/setSearchQuery`, this.query)
      await this.$store.dispatch(`${this.storeScope}/load`, {
        folderId: this.listFolderId(),
      })
      this.loading = false
    },
    async loadMore() {
      if (this.loadingMore || !this.hasMore) return
      this.loadingMore = true
      await this.$store.dispatch(`${this.storeScope}/loadNextPage`, {
        folderId: this.listFolderId(),
      })
      this.loadingMore = false
    },
    searchMedias(query) {
      this.query = query
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(this.reloadMedias, 300)
    },
    async deleteMedia(media) {
      await this.$store.dispatch(`${this.storeScope}/deleteMedias`, {
        ids: [media._id],
      })
    },
  },
}
