<template>
  <MainContent sidebar>
    <ExploreModalVue
      :value="selectedTags"
      @selectTag="selectTagFilter"
      @unSelectTag="unSelectTagFilter"
      :with-search="false"
      :current-organization-scope="currentOrganizationScope"
      :categories="tagCategoriesUnionSelectedtags"
      :loading-categories="loadingCategoriesUnion"
      v-if="showExploreModal"
      @apply="applyFilters"
      @cancel="closeExploreModal" />

    <template v-slot:sidebar>
      <div class="sidebar-divider"></div>

      <SidebarTagList
        :selected-tags="selectedTags"
        :custom-filters="customFilters"
        @addSearchCriterion="openExploreModal"
        @onUpdateSelectedTags="onUpdateSelectedTags"
        @onUpdateCustomFilters="onUpdateCustomFilters"></SidebarTagList>
    </template>

    <section class="flex col flex1 gap-small reset-overflows">
      <h2>{{ $t("favorites.subtitle") }}</h2>
      <ConversationListSearch
        @searchInConversationsTitle="onSearchInConversationsTitle"
        @searchInConversationsText="onSearchInConversationsText" />
      <ConversationList
        :conversations="conversations"
        :loading="loading"
        :currentOrganizationScope="currentOrganizationScope"
        :indexedTags="tagsDatabase"
        :error="error" />
      <Pagination
        v-model="currentPageNb"
        :pages="totalPagesNumber"
        class="pagination--sticky"
        v-if="totalPagesNumber > 1 && !error" />
    </section>
  </MainContent>
</template>

<script>
import { bus } from "@/main.js"

import ConversationList from "@/components/ConversationList.vue"
import { apiGetFavoritesConversations } from "@/api/conversation.js"
import { apiGetfavoritesCategoriesTree } from "@/api/tag"
import { extractTagsFromCategoryTree } from "@/tools/extractTagsFromCategoryTree"
import { indexTags } from "@/tools/indexTags"

import { debounceMixin } from "@/mixins/debounce"
import { conversationListMixin } from "@/mixins/conversationList"

import MainContent from "@/components/MainContent.vue"
import SidebarTagList from "@/components/SidebarTagList.vue"
import ExploreModalVue from "@/components/ExploreModal.vue"
import ConversationListSearch from "@/components/ConversationListSearch.vue"
import Pagination from "@/components/Pagination.vue"

export default {
  mixins: [debounceMixin, conversationListMixin],
  props: {
    userInfo: { type: Object, required: true },
    currentOrgaPersonal: { type: Boolean, required: true },
    currentOrganizationScope: { type: String, required: true },
  },
  data() {
    return {
      conversations: [],
      tagsDatabase: {},
      loading: true,
      loadingCategoriesUnion: true,
      customFiltersKey: "favoritesCustomFilters",
      selectedTagsKey: "favoritesSelectedTags",
      error: null,
    }
  },
  async mounted() {
    this.tagsDatabase = await this.fetchAllTags()

    this.selectedTags = await this.getSelectedTags()
    this.fetchConversations()
    this.queryCategoriesUnionSelectedtag()
  },
  computed: {},
  methods: {
    async fetchConversations() {
      let res
      try {
        this.loading = true
        res = await apiGetFavoritesConversations(
          this.selectedTags.map((tag) => tag._id),
          this.customFilters?.textConversation?.value,
          this.customFilters?.titleConversation?.value,
          this.currentPageNb
        )
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }

      this.totalElementsNumber = res?.count || 0
      this.conversations = res?.list || []
    },
    async fetchAllTags() {
      const catTree = await apiGetfavoritesCategoriesTree()
      const tags = extractTagsFromCategoryTree(catTree)
      const indexedTags = indexTags(tags)
      return indexedTags
    },
    queryCategoriesUnionSelectedtag() {
      this.loadingCategoriesUnion = true
      apiGetfavoritesCategoriesTree(this.selectedTags.map((tag) => tag._id))
        .then((response) => {
          this.tagCategoriesUnionSelectedtags = response
          this.loadingCategoriesUnion = false
        })
        .catch((error) => {
          this.loadingCategoriesUnion = false
          console.error(error)
        })

      return
    },
  },
  components: {
    ConversationList,
    MainContent,
    SidebarTagList,
    ExploreModalVue,
    ConversationListSearch,
    Pagination,
  },
}
</script>
