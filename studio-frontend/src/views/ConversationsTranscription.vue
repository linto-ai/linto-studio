<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="dataLoaded"
    :error="error"
    sidebar>
    <template v-slot:sidebar>
      <div>
        <div class="form-field flex col medium-margin">
          <label for="transcription-search">Rechercher</label>
          <input
            @keydown="($event) => $event.stopPropagation()"
            type="search"
            id="transcription-search"
            v-model="transcriptionSearch" />
          <div
            v-if="numberFound"
            class="flex small-padding-top gap-small align-center">
            <span class="flex1"
              >{{ selectedIndexResult + 1 }} /
              {{
                $tc("conversation.search_in_transcription.n_found", numberFound)
              }}</span
            >
            <button class="icon-only small" @click="previousResult">
              <span class="icon previous"></span>
            </button>
            <button class="icon-only small" @click="nextResult">
              <span class="icon next"></span>
            </button>
          </div>
        </div>
        <HighlightsList
          v-if="status === 'done'"
          :conversation="conversation"
          :hightlightsCategories="hightlightsCategories"
          :hightlightsCategoriesVisibility="hightlightsCategoriesVisibility"
          @hide-category="onHideCategory"
          @show-category="onShowCategory"
          @delete-tag="onDeleteTag"
          :conversationId="conversation._id" />
      </div>
    </template>

    <template v-slot:breadcrumb-actions>
      <router-link :to="conversationListRoute" class="btn">
        <span class="icon close"></span>
        <span class="label">{{ $t("conversation.close_editor") }}</span>
      </router-link>

      <h1
        class="flex1 center-text text-cut"
        style="padding-left: 1rem; padding-right: 1rem">
        {{ conversation.name }}
      </h1>

      <router-link
        :to="{
          name: 'conversations publish',
          params: { conversationId: conversation._id },
        }"
        class="btn green">
        <span class="icon document"></span>
        <span class="label">{{ $t("conversation.publish_document") }}</span>
      </router-link>
    </template>

    <div class="flex flex1">
      <AppEditor
        :conversation="conversation"
        :usersConnected="usersConnected"
        :focusFields="focusFields"
        :conversationUsers="conversationUsers"
        :userInfo="userInfo"
        :filterSpeakers="filterSpeakers"
        :turnPages="turnPages"
        :turns="turns"
        :canEdit="userRights.hasRightAccess(userRight, userRights.WRITE)"
        :hightlightsCategories="hightlightsCategories"
        :hightlightsCategoriesVisibility="hightlightsCategoriesVisibility"
        @newHighlight="handleNewHighlight"
        @foundExpression="onFoundExpression"
        @updateSelectedResult="onUpdateSelectedResult"
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
import moment from "moment"
import { nextTick } from "vue"

import { bus } from "../main.js"
import { apiPostMetadata, apiUpdateMetadata } from "@/api/metadata.js"

import { conversationMixin } from "@/mixins/conversation.js"

import Loading from "@/components/Loading.vue"
import Modal from "@/components/Modal.vue"
import UserInfoInline from "@/components/UserInfoInline.vue"
import AppEditor from "@/components/AppEditor.vue"
import MainContentConversation from "@/components/MainContentConversation.vue"
import HighlightsList from "@/components/HighlightsList.vue"
import MenuToolbox from "@/components/MenuToolbox.vue"
import ModalDeleteTagHighlight from "@/components/ModalDeleteTagHighlight.vue"
import ConversationShare from "@/components/ConversationShare.vue"
import TranscriptionHelper from "@/components/TranscriptionHelper.vue"
import AppEditorMetadataModal from "@/components/AppEditorMetadataModal.vue"
import ErrorView from "./Error.vue"

export default {
  mixins: [conversationMixin],
  data() {
    return {
      filterSpeakers: "default",
      helperVisible: false,
      status: null,
      showDeleteModal: false,
      tagToDelete: null,
      showMetadataModal: false,
      metadataModalData: null,
      transcriptionSearch: "",
      numberFound: 0,
      selectedIndexResult: 0,
    }
  },
  mounted() {
    bus.$on("open-metadata-modal", (data) => {
      this.showMetadataModal = true
      this.metadataModalData = data
    })
  },
  beforeDestroy() {
    bus.$off("open-metadata-modal")
  },
  watch: {
    "conversation.speakers"(newVal, oldVal) {
      if (
        this.filterSpeakers != "default" &&
        newVal.filter((spk) => spk.speaker_id == this.filterSpeakers).length ==
          0
      ) {
        this.filterSpeakers = "default"
      }
    },
    dataLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
      }
    },
    transcriptionSearch(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$refs.editor.searchInTranscription(newVal)
      }
    },
  },
  computed: {
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    dataLoaded() {
      return this.conversationLoaded
    },
    exportFileTitle() {
      return `${this.conversation.name.replace(/\s/g, "_")}_${moment().format(
        "YYYYMMDDHHmmss"
      )}`
    },
    turns() {
      if (!this.conversation) return []
      if (this.filterSpeakers && this.filterSpeakers != "default") {
        const filterTurns = this.conversation.text.filter(
          (turn) => turn.speaker_id == this.filterSpeakers
        )
        return filterTurns
      } else {
        // TODO:
        // some words can be empty so this rule is not enough check segment instead ?
        // it breaks turn merge. So we need to fix it but empty turns should not be in the conversation.
        return this.conversation.text.filter((turn) => turn.words.length > 0)
      }
    },
    turnPages() {
      if (!this.turns) return []
      let res = [[]]
      let currentPage = 0
      let nbCaracters = 0
      let nbTurns = 0
      res[currentPage] = []
      this.turns.forEach((turn, index) => {
        res[currentPage].push(turn)
        nbCaracters += turn.segment.length
        if (
          nbCaracters > parseInt(process.env.VUE_APP_MAX_CARACTERS_PER_PAGE)
        ) {
          nbCaracters = 0
          nbTurns = 0
          currentPage += 1
          res[currentPage] = []
        }
        nbTurns += 1
        if (nbTurns > parseInt(process.env.VUE_APP_TURN_PER_PAGE)) {
          nbTurns = 0
          nbCaracters = 0
          currentPage += 1
          res[currentPage] = []
        }
      })
      if (res[res.length - 1].length === 0) {
        res.pop()
      }
      return res
    },
  },
  methods: {
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
      console.log("set-metadata", fields, schema, this.metadataModalData)
      apiPostMetadata(
        this.conversationId,
        this.metadataModalData.tag._id,
        schema.name,
        fields.reduce(
          (obj, field) => ({ ...obj, [field.key]: field.value }),
          {}
        )
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
  },
  components: {
    ConversationShare,
    TranscriptionHelper,
    Loading,
    Modal,
    UserInfoInline,
    AppEditor,
    ErrorView,
    MainContentConversation,
    HighlightsList,
    MenuToolbox,
    ModalDeleteTagHighlight,
    AppEditorMetadataModal,
  },
}
</script>
