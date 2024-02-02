<template>
  <div :class="['turn-container', 'flex', 'row', focused ? 'focused' : '']">
    <div class="conversation-speaker flex">
      <span
        :class="[
          'conversation-speaker-name',
          canEdit ? '' : 'disabled',
          'flex1',
        ]"
        @click="handleSpeakerClick($event)"
        :style="`color: ${speakerColor};`">
        {{
          speakerName.length > 12
            ? speakerName.substr(0, 12) + "..."
            : speakerName
        }}
      </span>
      <AppEditorSpkToolbox
        v-if="displaySpeakerToolbox"
        :speakers="speakers"
        :speakerId="speakerId"
        :turnId="turnId"
        :turnIndex="index"
        v-click-outside="closeSpkToolbox"></AppEditorSpkToolbox>
      <span
        class="icon warning"
        :title="$t('conversation.turn_sync_error_title')"
        v-if="isLocalTextSync && !segmentIsCoherentWithWords" />
    </div>
    <div class="flex col flex1" style="max-width: 800px">
      <div class="turn-loading">
        <div class="turn-loading-bar" v-if="!isLocalTextSync"></div>
      </div>
      <div
        v-if="!contentEditable || disabled || !canEdit"
        :class="['turn', usersConnectedNames.length > 0 ? 'collab-active' : '']"
        :data-stime="stime"
        :data-etime="etime"
        :id="turnId"
        :contenteditable="contentEditable"
        ref="turn"
        @click="handleClick($event)"
        v-click-outside="resetWordSelected">
        <span
          v-for="(word, index) of nonEmptyWords"
          class="word"
          :key="word.wid"
          :id="word.wid"
          :data-index="index"
          :data-stime="word.stime"
          :data-etime="word.etime">
          <AppEditorToolbox
            v-if="wordsSelected.length > 0 && wordsSelected[0].wid === word.wid"
            :conversationId="conversationId"
            @selectTag="handleNewHighlight"></AppEditorToolbox>
          <span class="word_content">{{ word.word }}</span>
          <span class="word_space">
            {{ " " }}
          </span>
        </span>
      </div>

      <CollaborativeField
        v-else
        :label="false"
        :startValue="plainText"
        :flag="flag"
        :usersConnected="usersConnected"
        :conversationId="conversationId"
        :conversationUsers="conversationUsers"
        :userId="userInfo._id"
        :customClass="'fullwidth turn'"
        :hideUsersConnected="true"
        :editorTurn="true"
        :canEdit="canEdit"
        :turnWords="nonEmptyWords"
        :cursorPosition="cursorPosition"
        :disabledEnter="!isLocalTextSync"
        @blur="handleBlur($event)"
        @contentUpdate="handleContentUpdate($event)"
        @input="handleChange($event)">
      </CollaborativeField>

      <div
        class="flex row user-connected-container align-center"
        ref="turn-users-connected">
        <span
          v-for="user in usersConnectedNames"
          class="user-connected"
          :key="user"
          >{{ user }}
        </span>
      </div>
      <div class="turn-actions flex row">
        <button
          v-if="!lastTurn && canEdit"
          class="turn-action-btn"
          @click="mergeTurn"
          data-info="Fusionner les tours">
          <span class="icon icon-merge"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from "../main.js"
import { workerSendMessage } from "../tools/worker-message.js"
import CollaborativeField from "@/components/CollaborativeField.vue"
import AppEditorSpkToolbox from "@/components/AppEditorSpkToolbox.vue"
import AppEditorToolbox from "@/components/AppEditorToolbox.vue"
import Vue, { ref, nextTick } from "vue"
import { segmentIsCoherentWithWords } from "@/tools/segmentIsCoherentWithWords.js"

import _displayHighlights from "@/components/AppEditorTurn.d/displayHighlights.js"
import _highlightRange from "@/components/AppEditorTurn.d/highlightRange.js"
import _unhighlightRange from "@/components/AppEditorTurn.d/unhighlightRange.js"
import _hightlightAllText from "@/components/AppEditorTurn.d/hightlightAllText.js"
import _unHighlightAllText from "@/components/AppEditorTurn.d/unHighlightAllText.js"
import _getParentWord from "@/components/AppEditorTurn.d/getParentWord.js"
import _getSelectedWordsFromDomSelection from "@/components/AppEditorTurn.d/getSelectedWordsFromDomSelection.js"
import _getWordCharIndex from "@/components/AppEditorTurn.d/getWordCharIndex.js"
import _handleBlur from "@/components/AppEditorTurn.d/handleBlur.js"
import _handleChange from "@/components/AppEditorTurn.d/handleChange.js"
import _handleClick from "@/components/AppEditorTurn.d/handleClick.js"
import _handleContentUpdate from "@/components/AppEditorTurn.d/handleContentUpdate.js"
import _handleSpeakerClick from "@/components/AppEditorTurn.d/handleSpeakerClick.js"
import _setSpeakerName from "@/components/AppEditorTurn.d/setSpeakerName.js"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    conversationUsers: {
      type: Array,
      required: true,
      default: () => [],
    },
    usersConnected: {
      type: Array,
      default: () => [],
    },
    turnData: {
      type: Object,
      required: true,
    },
    speakers: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    conversationIsFiltered: {
      type: Boolean,
      required: true,
    },
    lastTurn: {
      type: Boolean,
    },
    hightlightsCategories: {
      type: Array,
      default: () => [],
    },
    hightlightsCategoriesVisibility: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      localTurnData: this.turnData,
      contentEditable: false,
      clickTimer: null,
      clickNb: 0,
      focused: false,
      plainText: "",
      speakerName: "",
      disabled: false,
      displaySpeakerToolbox: false,
      speakerColor: "",
      wordsSelected: [],
      clickWordIndex: null,
      editorToolbox: {
        display: false,
        left: 0,
        top: 0,
        stime: 0,
      },
      cursorPosition: {
        wordIndex: null,
        wordCharIndex: null,
      },
      highlightsRanges: {}, // {cat_name: {ranges:[range1, ranges2], color: 'color'}, ...},
      selectedRange: null,
      splitting: false,
      localText: "",
    }
  },
  computed: {
    turnId: {
      get: function () {
        return this.localTurnData.turn_id
      },
      set: function (value) {
        this.localTurnData.turn_id = value
      },
    },
    segment: {
      get: function () {
        return this.localTurnData.segment
      },
      set: function (value) {
        this.localTurnData.segment = value
      },
    },
    speakerId: {
      get: function () {
        return this.localTurnData.speaker_id
      },
      set: function (value) {
        this.localTurnData.speaker_id = value
      },
    },
    words: {
      get: function () {
        return this.localTurnData.words
      },
      set: function (value) {
        this.localTurnData.words = value
      },
    },
    stime: {
      get: function () {
        return this.localTurnData.words[0].stime
      },
      set: function (value) {
        console.warn("Cannot set stime")
      },
    },
    etime: {
      get: function () {
        return this.localTurnData.words[this.localTurnData.words.length - 1]
          .etime
      },
      set: function (value) {
        console.warn("Cannot set etime")
      },
    },
    flag() {
      return "conversationTurn/" + this.turnId
    },
    usersConnectedNames() {
      let usersConnectedNames = []
      if (this.conversationUsers && this.conversationUsers.length > 0) {
        this.usersConnected.map((user) => {
          if (user.inputField === this.flag) {
            let userOnField = this.conversationUsers.find(
              (usr) => usr._id === user.userId
            )
            if (userOnField) {
              usersConnectedNames.push(
                userOnField.firstname + " " + userOnField.lastname
              )
            }
          }
        })
      }
      return usersConnectedNames
    },
    nonEmptyWords() {
      return this.words.filter((word) => word.word !== "")
    },
    segmentIsCoherentWithWords() {
      return segmentIsCoherentWithWords(this.segment, this.words)
    },
    isLocalTextSync() {
      return this.localText === this.segment
    },
  },
  watch: {
    contentEditable(data) {
      if (data) {
        this.plainText = this.segment
      }
    },
    hightlightsCategories(data, oldData) {
      if (data.length > 0) {
        this.displayHighlights()
      }
    },
    hightlightsCategoriesVisibility: {
      handler(data, oldData) {
        this.displayHighlights()
      },
      deep: true,
    },
  },
  mounted() {
    this.setSpeakerName()
    bus.$on("conversation_user_update", (data) => {
      let changes = data.value
      if (changes.speaker_id === this.speakerId) {
        this.setSpeakerName()
        this.displaySpeakerToolbox = false
      }
    })

    bus.$on("words_updated", (data) => {
      if (data.turnId === this.turnId) {
        this.words = data.value
      }
    })

    bus.$on("segment_updated", (data) => {
      if (data.turnId === this.turnId) {
        this.segment = data.value

        if (!this.contentEditable) {
          this.localText = this.segment
        }
      }
    })

    bus.$on("turn_speaker_update", (data) => {
      if (data.turnId === this.turnId) {
        this.speakerId = data.value
        this.setSpeakerName()
        this.displaySpeakerToolbox = false
        bus.$emit("refresh_spk_timebox", {})
      }
    })

    bus.$on("speaker_name_updated", (data) => {
      if (data.value.speaker_id === this.speakerId) {
        this.setSpeakerName()
        this.displaySpeakerToolbox = false
        bus.$emit("refresh_spk_timebox", {})
      }
    })

    this.displayHighlights()
    this.localText = this.segment
  },
  beforeDestroy() {
    bus.$off("conversation_user_update")
    bus.$off("words_updated")
    bus.$off("segment_updated")
    bus.$off("turn_speaker_update")
    bus.$off("speaker_name_updated")
  },
  methods: {
    displayHighlights: _displayHighlights,
    highlightRange: _highlightRange,
    unhighlightRange: _unhighlightRange,
    hightlightAllText: _hightlightAllText,
    unHighlightAllText: _unHighlightAllText,
    getParentWord: _getParentWord,
    getSelectedWordsFromDomSelection: _getSelectedWordsFromDomSelection,
    getWordCharIndex: _getWordCharIndex,
    handleBlur: _handleBlur,
    handleChange: _handleChange,
    handleClick: _handleClick,
    handleContentUpdate: _handleContentUpdate,
    handleSpeakerClick: _handleSpeakerClick,
    setSpeakerName: _setSpeakerName,
    handleNewHighlight(tag) {
      this.$emit("newHighlight", {
        tag,
        wordsSelected: [...this.wordsSelected],
      })
      this.resetWordSelected()
    },
    plainRangeToDomRange(plainRange) {
      try {
        const domRange = new Range()
        domRange.setStartBefore(this.$refs.turn.children.item(plainRange.start))
        domRange.setEndAfter(this.$refs.turn.children.item(plainRange.end))
        domRange._tag = plainRange.expressionObject
        return domRange
      } catch (error) {
        return null
      }
    },
    customBlur() {
      this.contentEditable = false
    },
    async selectWord() {
      this.resetWordSelected()
      await nextTick()
      let domSelection = window.getSelection()
      let selection = this.getSelectedWordsFromDomSelection(domSelection)
      const startRange = selection.firstWord
      const endRange = selection.lastWord
      window
        .getSelection()
        .setBaseAndExtent(startRange, 0, endRange, endRange.length)

      this.wordsSelected = selection.wordsSelected

      const domRange = new Range()
      domRange.setStartBefore(startRange)
      domRange.setEndAfter(endRange)
      this.selectedRange = domRange
      await this.highlightRange(
        { range: this.selectedRange, category: { color: "blue" } },
        false
      )
      // if (
      //   target.classList.contains("turn") ||
      //   target.classList.contains("word")
      // ) {

      // }
    },
    resetWordSelected() {
      this.wordsSelected = []
      if (this.selectedRange) {
        this.unhighlightRange({ range: this.selectedRange })
      }
    },
    findIndexWithoutEmptyWords(words, callback) {
      let index = -1
      for (let item of words) {
        if (item.word !== "") {
          index += 1
          if (callback(item, index, words)) {
            return index
          }
        }
      }
      return -1
    },
    closeEditorToolbox() {
      this.editorToolbox.display = false
      this.resetWordSelected()
    },
    closeSpkToolbox() {
      this.displaySpeakerToolbox = false
    },
    mergeTurn() {
      this.$emit("mergeTurns", this.turnId)
    },
  },
  components: {
    CollaborativeField,
    AppEditorSpkToolbox,
    AppEditorToolbox,
  },
}
</script>
