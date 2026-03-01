<template>
  <MainContentConversation
    :conversation="conversation"
    :breadcrumbItems="breadcrumbItems"
    :status="status"
    :dataLoaded="dataLoaded"
    :error="error"
    sidebar>
    <template v-slot:sidebar>
      <div>
        <div class="form-field flex col medium-margin gap-medium">
          <AppEditorChannelsSelector
            v-if="channels && channels.length > 0"
            :channels="channels"
            v-model="selectedChannel" />
          <AppEditorTranslationSelector
            v-if="translations && translations.length > 0"
            :translations="translations"
            v-model="selectedTranslation" />
        </div>

        <div class="form-field flex col medium-margin">
          <label for="transcription-search">{{
            $t("app_editor_search.label")
          }}</label>
          <div class="flex gap-small">
            <input
              class="flex1"
              @keydown="($event) => $event.stopPropagation()"
              type="search"
              id="transcription-search"
              v-model="transcriptionSearch" />
            <Button
              :title="
                $t('conversation.search_in_transcription.exact_word_match')
              "
              :variant="exactMatching ? 'primary' : 'secondary'"
              @click="toggleExactMatching"
              icon="equals" />

            <Button
              v-if="transcriptionSearch"
              variant="secondary"
              intent="destructive"
              :title="$t('conversation.search_in_transcription.clear_search')"
              @click="resetSearch"
              icon="x" />
          </div>

          <SearchResultPaginator
            class="small-padding-top"
            v-if="numberFound"
            :numberFound="numberFound"
            :selectedIndexResult="selectedIndexResult"
            @previousResult="previousResult"
            @nextResult="nextResult" />
        </div>
        <HighlightsList
          v-if="status === 'done' && experimental_highlight"
          :conversation="conversation"
          :hightlightsCategories="hightlightsCategories"
          :hightlightsCategoriesVisibility="hightlightsCategoriesVisibility"
          @hide-category="onHideCategory"
          @show-category="onShowCategory"
          @delete-tag="onDeleteTag"
          @clickOnTag="onClickOnTag"
          :conversationId="conversation._id">
          <template v-slot:content-under-tag="slotProps">
            <SearchResultPaginator
              v-if="slotProps.tag._id === searchedHighlightId"
              :numberFound="totalHighlightResult"
              :selectedIndexResult="currentHighlightResult"
              @previousResult="onPreviousHighlightSearch(slotProps.tag)"
              @nextResult="onNextHighlightSearch(slotProps.tag)" />
          </template>
        </HighlightsList>
      </div>
    </template>

    <div class="action-cards" v-if="conversation && conversation._id">
      <router-link
        class="action-card"
        :to="{ name: 'conversations publish', params: { conversationId: conversation._id } }">
        <div class="action-card__icon action-card__icon--publish">
          <PhIcon name="file-text" size="lg" />
        </div>
        <div class="action-card__content">
          <span class="action-card__title">{{ $t('conversation.publish_document') }}</span>
          <span class="action-card__description">{{ $t('conversation.publish_document_description') }}</span>
        </div>
        <PhIcon name="caret-right" size="sm" class="action-card__arrow" />
      </router-link>
    </div>

    <div class="flex flex1">
      <AppEditor
        :conversation="conversation"
        :rootConversation="rootConversation"
        :channelId="selectedChannel"
        :usersConnected="usersConnected"
        :focusFields="focusFields"
        :conversationUsers="conversationUsers"
        :userInfo="userInfo"
        :turnPages="turnPages"
        :turns="turns"
        :canEdit="canEdit"
        :hightlightsCategories="hightlightsCategories"
        :hightlightsCategoriesVisibility="hightlightsCategoriesVisibility"
        @newHighlight="handleNewHighlight"
        @foundExpression="onFoundExpression"
        @updateSelectedResult="onUpdateSelectedResult"
        @updateSelectedHighlight="onUpdateSelectedHighlight"
        ref="editor"
        v-if="status === 'done'"></AppEditor>
    </div>

    <ModalDeleteTagHighlight
      v-if="showDeleteModal"
      :conversationId="conversationId"
      :tag="tagToDelete"
      @on-cancel="onCancelDeleteTag"
      @on-confirm="onConfirmDeleteTag" />

    <AppEditorMetadataModal
      v-if="showMetadataModal"
      @on-cancel="cancelMetadata"
      @on-confirm="setMetadata" />
  </MainContentConversation>
</template>
<script>
import { formatTimestamp } from "@/tools/formatDate.js"
import { nextTick } from "vue"

import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import { apiPostMetadata, apiUpdateMetadata } from "@/api/metadata.js"
import findExpressionInWordsList from "@/tools/findExpressionInWordsList.js"

import { conversationMixin } from "@/mixins/conversation.js"

import AppEditor from "@/components/AppEditor.vue"
import MainContentConversation from "@/components/MainContentConversation.vue"
import HighlightsList from "@/components/HighlightsList.vue"
import ModalDeleteTagHighlight from "@/components/ModalDeleteTagHighlight.vue"
import AppEditorMetadataModal from "@/components/AppEditorMetadataModal.vue"
import SearchResultPaginator from "@/components/SearchResultPaginator.vue"
import AppEditorChannelsSelector from "@/components/AppEditorChannelsSelector.vue"
import AppEditorTranslationSelector from "../components/AppEditorTranslationSelector.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  mixins: [conversationMixin],
  data() {
    return {
      selfUrl: (convId) => `/interface/conversations/${convId}/transcription`,
      helperVisible: false,
      status: null,
      showDeleteModal: false,
      tagToDelete: null,
      showMetadataModal: false,
      metadataModalData: null,
      transcriptionSearch: "",
      numberFound: 0,
      selectedIndexResult: 0,
      exactMatching: false,
      searchedHighlightId: null,
      currentHighlightResult: 0,
      totalHighlightResult: 0,
      turnsIndexedByid: {},
      turns: [],
      turnPages: [],
      pendingSearchFromUrl: null,
    }
  },
  mounted() {
    bus.$on("open-metadata-modal", (data) => {
      this.showMetadataModal = true
      this.metadataModalData = data
    })

    bus.$on("segment_updated", (data) => {
      this.turnsIndexedByid[data.turnId].segment = data.value
    })

    bus.$on("words_updated", (data) => {
      this.turnsIndexedByid[data.turnId].words = data.value
    })

    bus.$on("turn_speaker_update", (data) => {
      this.turnsIndexedByid[data.turnId].speaker_id = data.value
    })

    bus.$on("refresh_turns", () => {
      this.setupTurns()
    })

    // Apply search from URL parameter if present
    this.applySearchFromUrl()
  },
  beforeDestroy() {
    bus.$off("open-metadata-modal")
    bus.$off("segment_updated")
    bus.$off("words_updated")
    bus.$off("refresh_turns")
    bus.$off("turn_speaker_update")
  },
  watch: {
    dataLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
      }
    },
    status(newVal, oldVal) {
      if (newVal === "done" && this.pendingSearchFromUrl) {
        this.$nextTick(() => {
          this.transcriptionSearch = this.pendingSearchFromUrl
          this.pendingSearchFromUrl = null
        })
      }
    },
    transcriptionSearch(newVal, oldVal) {
      if (newVal != oldVal) {
        bus.$emit("player-pause")
        if (this.$refs.editor) {
          this.$refs.editor.searchInTranscription(newVal, this.exactMatching)
        }
      }
    },
  },
  computed: {
    experimental_highlight() {
      return getEnv("VUE_APP_EXPERIMENTAL_HIGHLIGHT") === "true"
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    dataLoaded() {
      return this.conversationLoaded
    },
    exportFileTitle() {
      return `${this.conversation.name.replace(/\s/g, "_")}_${formatTimestamp()}`
    },
    breadcrumbItems() {
      return [
        {
          label: this.rootConversation?.name ?? "",
        },
      ]
    },
  },
  methods: {
    initConversationHook() {
      this.setupTurns()
    },
    setupTurns() {
      this.turnPages = [[]]
      this.turnsIndexedByid = {}
      this.turns = []

      let currentPage = 0
      let nbCaracters = 0
      let nbTurns = 0
      this.turnPages[currentPage] = []

      for (let shadowTurn of this.conversation.text) {
        if (shadowTurn.words.length === 0) {
          continue
        }
        const turn = structuredClone(shadowTurn)
        this.turnsIndexedByid[turn.turn_id] = turn
        this.turns.push(turn)

        // Split the turns in pages
        this.turnPages[currentPage].push(turn)
        nbCaracters += turn.segment.length
        if (
          nbCaracters > parseInt(getEnv("VUE_APP_MAX_CARACTERS_PER_PAGE"))
        ) {
          nbCaracters = 0
          nbTurns = 0
          currentPage += 1
          this.turnPages[currentPage] = []
        }
        nbTurns += 1
        if (nbTurns > parseInt(getEnv("VUE_APP_TURN_PER_PAGE"))) {
          nbCaracters = 0
          nbTurns = 0
          currentPage += 1
          this.turnPages[currentPage] = []
        }
      }

      if (this.turnPages.at(-1).length === 0) {
        this.turnPages.pop()
      }
    },
    onClickOnTag(tag) {
      this.$refs.editor.nextHighlightSearch(tag._id)
    },
    onNextHighlightSearch(tag) {
      this.$refs.editor.nextHighlightSearch(tag._id)
    },
    onPreviousHighlightSearch(tag) {
      this.$refs.editor.previousHighlightSearch(tag._id)
    },
    onFoundExpression(number) {
      this.numberFound = number
    },
    onUpdateSelectedResult(number) {
      this.selectedIndexResult = number
    },
    nextResult() {
      this.$refs.editor.nextResultFound()
    },
    previousResult() {
      this.$refs.editor.previousResultFound()
    },
    cancelMetadata() {
      this.showMetadataModal = false
    },
    async setMetadata(fields, schema) {
      this.showMetadataModal = false
      apiPostMetadata(
        this.conversationId,
        this.metadataModalData.tag._id,
        schema.name,
        fields.reduce(
          (obj, field) => ({ ...obj, [field.key]: field.value }),
          {},
        ),
      )
      // Todo: only update the right metadata
      await this.fetchHightlightsCategories(this.conversationId)
      //bus.$emit("set-metadata", fields)
    },
    showHelper() {
      this.helperVisible = true
    },
    closeHelper() {
      this.helperVisible = false
    },
    onHideCategory(categoryId) {
      this.hightlightsCategoriesVisibility = {
        ...this.hightlightsCategoriesVisibility,
        [categoryId]: false,
      }
    },
    onShowCategory(categoryId) {
      this.hightlightsCategoriesVisibility = {
        ...this.hightlightsCategoriesVisibility,
        [categoryId]: true,
      }
    },
    onDeleteTag(tag) {
      this.tagToDelete = tag
      this.showDeleteModal = true
    },
    onCancelDeleteTag() {
      this.showDeleteModal = false
    },
    onConfirmDeleteTag() {
      this.showDeleteModal = false
    },
    async handleNewHighlight({ tag, wordsSelected }) {
      const metadata = (tag.metadata ?? []).filter((m) => m.schema == "words")
      let post = false
      let ranges = []
      let metadataId = null

      if (metadata.length == 0) {
        post = true
      } else {
        ranges = metadata[0]?.value?.range_id ?? []
        metadataId = metadata[0]._id
      }

      ranges.push({
        startId: wordsSelected[0].wid,
        endId: wordsSelected[wordsSelected.length - 1].wid,
      })

      if (post) {
        await apiPostMetadata(this.conversationId, tag._id, "words", {
          range_id: ranges,
        })
      } else {
        await apiUpdateMetadata(this.conversationId, tag._id, metadataId, {
          range_id: ranges,
        })
      }

      // reload highlights ?
      await this.fetchHightlightsCategories(this.conversationId)
      await nextTick()
      this.hightlightsCategoriesVisibility = {
        ...this.hightlightsCategoriesVisibility,
        [tag.categoryId]: true,
      }
    },
    toggleExactMatching() {
      this.exactMatching = !this.exactMatching
      this.$refs.editor.searchInTranscription(
        this.transcriptionSearch,
        this.exactMatching,
      )
    },
    resetSearch() {
      this.transcriptionSearch = ""
      this.numberFound = 0
      this.selectedIndexResult = 0
      this.$refs.editor.searchInTranscription("")
    },
    onUpdateSelectedHighlight({ tagId, total, current }) {
      this.searchedHighlightId = tagId
      this.currentHighlightResult = current
      this.totalHighlightResult = total
    },
    applySearchFromUrl() {
      const urlParams = new URLSearchParams(window.location.search)
      const searchTerm = urlParams.get("search")
      if (searchTerm) {
        if (this.status === "done") {
          this.$nextTick(() => {
            this.transcriptionSearch = searchTerm
          })
        } else {
          this.pendingSearchFromUrl = searchTerm
        }
      }
    },
  },
  components: {
    AppEditor,
    MainContentConversation,
    HighlightsList,
    ModalDeleteTagHighlight,
    AppEditorMetadataModal,
    SearchResultPaginator,
    AppEditorChannelsSelector,
    AppEditorTranslationSelector,
    PhIcon,
  },
}
</script>

<style lang="scss" scoped>
.action-cards {
  display: flex;
  gap: 12px;
  padding: 16px 24px 8px;
}

.action-card {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid var(--neutral-20);
  background: var(--background-primary);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  font-size: inherit;
  text-align: left;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-2);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;

    &--publish {
      background-color: var(--primary-soft);
      color: var(--primary-color);
    }

  }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  &__description {
    font-size: 0.8rem;
    color: var(--dark-70);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__arrow {
    flex-shrink: 0;
    color: var(--dark-70);
    transition: transform 0.2s ease;
  }

  &:hover &__arrow {
    transform: translateX(2px);
  }
}

@media (max-width: 800px) {
  .action-cards {
    flex-direction: column;
    padding: 12px 12px 4px;

    .action-card {
      width: 100%;
    }
  }
}
</style>
