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
    ...mapGetters("system", { pageIsLoading: "isLoading" }),
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.$store.dispatch(`${this.storeScope}/load`, {})
      this.loading = false
      this.$store.dispatch("system/setIsLoading", false)
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
