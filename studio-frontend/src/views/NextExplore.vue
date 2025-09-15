<template>
  <LayoutV2 customClass="explore-next">
    <MediaExplorer
      v-if="medias"
      :medias="medias"
      :loading="loading || pageIsLoading"
      :loadingNextPage="loadingNextPage"
      enable-pagination
      class="relative"
      @load-more="handleLoadMore">
      <template #header-actions v-if="getCurrentScope == 'organization'">
        <div class="flex gap-small">
          <FilterChip
            label="Ready"
            v-model="filterStatus"
            chipValue="done"
            :count="countDone" />
          <FilterChip
            label="Processing"
            v-model="filterStatus"
            chipValue="processing"
            :count="countProcessing" />
          <FilterChip
            label="In error"
            v-model="filterStatus"
            chipValue="error"
            :count="countError" />
        </div>
      </template>
    </MediaExplorer>
  </LayoutV2>
</template>

<script>
import { mapGetters } from "vuex"

import LayoutV2 from "@/layouts/v2-layout.vue"
import MediaExplorer from "@/components/MediaExplorer.vue"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { mediaScopeMixin } from "@/mixins/mediaScope"
import { getCurrentScope } from "vue"

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
  },
  data() {
    return {
      loading: true,
      loadingNextPage: false,
      currentOperation: null,
      observer: null,
    }
  },
  computed: {
    medias() {
      return this.$store.getters[`${this.storeScope}/all`]
    },
    search() {
      return this.$store.getters[`${this.storeScope}/search`]
    },
    countDone() {
      return this.$store.getters[`${this.storeScope}/countDone`]
    },
    countError() {
      return this.$store.getters[`${this.storeScope}/countError`]
    },
    countProcessing() {
      return this.$store.getters[`${this.storeScope}/countProcessing`]
    },
    filterStatus: {
      get() {
        return this.$store.getters[`${this.storeScope}/getFilterStatus`]
      },
      set(value) {
        this.$store.dispatch(`${this.storeScope}/setFilterStatus`, value)
      },
    },
    ...mapGetters("system", { pageIsLoading: "isLoading" }),
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.$apiEventWS.unSubscribeMediaUdate()
  },
  methods: {
    async init() {
      if (this.getCurrentScope === "organization") {
        this.$apiEventWS.subscribeMediaUpdate(this.currentOrganizationScope)
        this.filterStatus = this.getStatusFromUrl()
      }
      await this.$store.dispatch(`${this.storeScope}/load`, {})
      await this.$store.dispatch(`${this.storeScope}/loadStatusCount`)
      this.loading = false
      this.$store.dispatch("system/setIsLoading", false)
    },
    getStatusFromUrl() {
      const status = this.$route.query.status
      if (!status || ["done", "processing", "error"].indexOf(status) == "-1") {
        return "done"
      }
      return status
    },
    async handleLoadMore() {
      this.loadingNextPage = true
      await this.$store.dispatch(`${this.storeScope}/loadNextPage`)
      this.loadingNextPage = false
    },
  },
  watch: {
    async search() {
      if (this.pageIsLoading) return
      this.loading = true
      await this.$store.dispatch(`${this.storeScope}/load`, {})
      this.loading = false
    },
    async selectedTagsIds(newValue, oldvalue) {
      if (this.pageIsLoading) return
      this.loading = true
      await this.$store.dispatch(`${this.storeScope}/load`, {})
      this.loading = false
    },
    async filterStatus() {
      if (this.pageIsLoading) return
      this.loading = true
      await this.$store.dispatch(`${this.storeScope}/load`, {})
      this.loading = false
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
