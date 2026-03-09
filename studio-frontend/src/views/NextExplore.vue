<template>
  <LayoutV2 customClass="explore-next">
    <MediaExplorer
      v-if="medias"
      :medias="medias"
      :loading="loading || pageIsLoading"
      :loadingNextPage="loadingNextPage"
      enable-pagination
      class="relative"
      @load-more="handleLoadMore" />
  </LayoutV2>
</template>

<script>
import { mapGetters } from "vuex"

import LayoutV2 from "@/layouts/v2-layout.vue"
import MediaExplorer from "@/components/MediaExplorer.vue"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { mediaScopeMixin } from "@/mixins/mediaScope"

export default {
  name: "NextExplore",
  components: {
    LayoutV2,
    MediaExplorer,
  },
  mixins: [orgaRoleMixin, convRoleMixin, mediaScopeMixin],
  props: {
    userInfo: { type: Object, required: true },
    currentOrganizationScope: { type: String, required: true },
    favorites: { type: Boolean, required: false, default: false },
    shared: { type: Boolean, required: false, default: false },
    processing: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: true,
      loadingNextPage: false,
    }
  },
  computed: {
    medias() {
      return this.$store.getters[`${this.storeScope}/all`]
    },
    search() {
      return this.$store.getters[`${this.storeScope}/search`]
    },
    sidebarFilterTagIds() {
      return this.$store.state[this.storeScope]?.sidebarFilterTagIds ?? []
    },
    sortField() {
      return this.$store.getters[`${this.storeScope}/getSortField`]
    },
    sortOrder() {
      return this.$store.getters[`${this.storeScope}/getSortOrder`]
    },
    ...mapGetters("system", { pageIsLoading: "isLoading" }),
    effectiveFolderId() {
      if (this.hasActiveSearch) return undefined // Global search across all folders
      if (this.processing) return undefined
      const routeFolderId = this.$route.params.folderId
      if (routeFolderId) return routeFolderId
      // In organization scope inbox (no folder selected), show only unfiled conversations
      if (this.getCurrentScope === "organization") return null
      return undefined
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.$apiEventWS.unSubscribeMediaUdate()
  },
  methods: {
    async init() {
      try {
        if (this.getCurrentScope === "organization") {
          this.$apiEventWS.subscribeMediaUpdate(this.currentOrganizationScope)
          this.$store.dispatch(
            "organizations/setCurrentFilterStatus",
            this.processing ? "processing" : "done"
          )
        }
        await this.$store.dispatch(`${this.storeScope}/load`, {
          folderId: this.effectiveFolderId,
        })
      } finally {
        this.loading = false
        this.$store.dispatch("system/setIsLoading", false)
      }
    },
    async handleLoadMore() {
      this.loadingNextPage = true
      await this.$store.dispatch(`${this.storeScope}/loadNextPage`, {
        folderId: this.effectiveFolderId,
      })
      this.loadingNextPage = false
    },
  },
  watch: {
    getCurrentOrganizationScope(newOrgId, oldOrgId) {
      if (newOrgId && newOrgId !== oldOrgId) {
        this.loading = true
        this.$apiEventWS.unSubscribeMediaUdate()
        this.init()
      }
    },
    processing() {
      this.loading = true
      this.init()
    },
    async "$route.params.folderId"() {
      this.loading = true
      this.$store.dispatch(`${this.storeScope}/clearSelectedMedias`)
      this.$store.dispatch(`${this.storeScope}/clearSidebarFilterTagIds`)
      try {
        await this.$store.dispatch(`${this.storeScope}/load`, { folderId: this.effectiveFolderId })
      } finally {
        this.loading = false
        this.$store.dispatch("system/setIsLoading", false)
      }
    },
    async search() {
      if (this.pageIsLoading) return
      this.loading = true
      try {
        await this.$store.dispatch(`${this.storeScope}/load`, {
          folderId: this.effectiveFolderId,
        })
      } finally {
        this.loading = false
      }
    },
    async selectedTagsIds() {
      if (this.pageIsLoading) return
      this.loading = true
      try {
        await this.$store.dispatch(`${this.storeScope}/load`, {
          folderId: this.effectiveFolderId,
        })
      } finally {
        this.loading = false
      }
    },
    async sidebarFilterTagIds() {
      if (this.pageIsLoading) return
      this.loading = true
      try {
        await this.$store.dispatch(`${this.storeScope}/load`, {
          folderId: this.effectiveFolderId,
        })
      } finally {
        this.loading = false
      }
    },
    async sortField() {
      if (this.pageIsLoading) return
      this.loading = true
      try {
        await this.$store.dispatch(`${this.storeScope}/load`, {
          folderId: this.effectiveFolderId,
        })
      } finally {
        this.loading = false
      }
    },
    async sortOrder() {
      if (this.pageIsLoading) return
      this.loading = true
      try {
        await this.$store.dispatch(`${this.storeScope}/load`, {
          folderId: this.effectiveFolderId,
        })
      } finally {
        this.loading = false
      }
    },
    "$apiEventWS.state.connexionRestored"() {
      if (this.getCurrentScope === "organization") {
        this.$apiEventWS.subscribeMediaUpdate(this.currentOrganizationScope)
      }
    },
  },
}
</script>

<style lang="scss">
.explore-next {
  .main__content {
    padding: 0;
  }
}

.explore-next__infinite-loading {
  text-align: center;
  padding: 20px;
  margin-top: 10px;
}

.explore-next__previous-items {
  text-align: center;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;

  .btn.loading {
    opacity: 0.7;
    cursor: wait;
  }
}
</style>
