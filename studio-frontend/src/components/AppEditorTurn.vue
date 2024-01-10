<template>
  <div :class="['turn-container', 'flex', 'row', focused ? 'focused' : '']">
    <div class="conversation-speaker flex">
      <span
        :class="[
          'conversation-speaker-name',
          canEdit ? '' : 'disabled',
          'flex1',
        ]"
        @click="handleSpeakerCkick($event)"
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
          <span class="word_content">{{ word.word }}</span>
          <span class="word_space">
            {{ " " }}
          </span>
        </span>
        <AppEditorToolbox
          v-if="editorToolbox.display"
          @close="closeEditorToolbox"
          :turnId="turnId"
          :stime="editorToolbox.stime"
          :style="{
            top: editorToolbox.top - 40 + 'px',
            left: editorToolbox.left + 'px',
          }"></AppEditorToolbox>
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
import findExpressionInWordsList from "@/tools/findExpressionInWordsList.js"
import { ref, nextTick } from "vue"
import { segmentIsCoherentWithWords } from "@/tools/segmentIsCoherentWithWords.js"

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
    keywords: {
      type: Array,
      default: () => [],
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
      highlights: {
        keywords: [],
        search: [],
      },
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
    "highlights.keywords"(data, oldData) {
      if (data.length > 0) {
        data.forEach(this.highlightRange)
      }
    },
    keywords(data) {
      if (data.length > 0) {
        this.computeKeywordsRangeInText()
      }
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

    this.computeKeywordsRangeInText()
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
    computeKeywordsRangeInText() {
      const ranges = findExpressionInWordsList(
        this.keywords,
        this.words,
        (k) => k.name,
        (w) => w.word
      )
      this.highlights.keywords = ranges.map(this.plainRangeToDomRange)
    },
    plainRangeToDomRange(plainRange) {
      const domRange = new Range()
      domRange.setStartBefore(this.$refs.turn.children.item(plainRange.start))
      domRange.setEndAfter(this.$refs.turn.children.item(plainRange.end))
      return domRange
    },
    async highlightRange(range) {
      await nextTick()
      let { startContainer, endContainer, startOffset, endOffset } = range
      let startWord = startContainer.children.item(startOffset)
      let endWord = endContainer.children.item(endOffset)

      if (!endWord) {
        startWord.setAttribute("highlighted", "true")
        return
      }

      do {
        startWord.setAttribute("highlighted", "true")
        startWord = startWord.nextSibling
      } while (startWord !== endWord)
    },
    setSpeakerName() {
      const speaker = this.speakers.find(
        (speaker) => speaker.speaker_id === this.speakerId
      )
      if (speaker) {
        this.speakerName = speaker.speaker_name
        this.speakerColor = speaker.color
      }
    },
    async hightLightText() {
      await nextTick()
      this.computeKeywordsRangeInText()
    },

    customBlur() {
      this.contentEditable = false
    },

    handleSpeakerCkick(e) {
      e.preventDefault()
      if (this.canEdit) {
        this.displaySpeakerToolbox = !this.displaySpeakerToolbox
      }
    },

    handleContentUpdate(content) {
      if (content === this.localText) {
        return
      }
      if (!content) {
        return
      }

      this.localText = content
    },
    handleChange(e) {
      this.debug(
        "Turn edition by '%s' with %s",
        e.inputType,
        e.target.innerText
      )
      if (!e.inputType) {
        return
      }

      if (e.inputType === "insertParagraph") {
        this.splitting = true
        workerSendMessage("turn_insert_paragraph", {
          turnId: this.turnId,
          textBefore:
            e.target.childNodes[0]?.innerText ||
            e.target.childNodes[0]?.textContent,
          textAfter:
            e.target.childNodes[1].innerText ||
            e.target.childNodes[1]?.textContent,
          turn: this.localTurnData,
          index: this.index,
        })
        this.contentEditable = false
        this.disabled = true
      } else {
        if (e.target.innerText.trim().length > 0) {
          workerSendMessage("turn_edit_text", {
            turnId: this.turnId,
            newText: e.target.innerText,
            oldText: this.segment,
            words: this.words,
            index: this.index,
          })
        }
      }
    },
    handleBlur(e) {
      this.focused = false
      this.contentEditable = false
      if (this.splitting) {
        this.splitting = false
        return
      } else {
        workerSendMessage("turn_edit_text", {
          turnId: this.turnId,
          newText: e.target.innerText,
          oldText: this.segment,
          words: this.words,
          index: this.index,
        })
        this.hightLightText()
      }
    },
    handleClick(e) {
      const target = e.target
      if (
        target.classList.contains("word") ||
        target.classList.contains("word_space") ||
        target.classList.contains("word_content")
      ) {
        const selection = window.getSelection()
        if (selection.type == "Caret") {
          const wordElement = this.getParentWord(target)
          if (wordElement) {
            const stime = wordElement?.getAttribute("data-stime")
            if (stime) bus.$emit("player_set_time", { stime })
            this.closeEditorToolbox()
            this.focused = this.canEdit
            this.contentEditable = this.canEdit
            const wordCharIndex = this.getWordCharIndex(
              target,
              wordElement,
              selection
            )

            this.cursorPosition = {
              wordIndex: wordElement.getAttribute("data-index"),
              wordCharIndex: wordCharIndex,
            }
          }
        }
      }

      //this.compareSelection(selection) // To set clickWordIndex
      // if (!isSelection) {
      //   // simple click
      //   if (target.classList.contains("word_content")) {
      //   }
      //   if (target.classList.contains("word")) {
      //     const stime = target?.getAttribute("data-stime")
      //     if (stime) bus.$emit("player_set_time", { stime })
      //     this.closeEditorToolbox()
      //     this.focused = true
      //     this.contentEditable = this.canEdit
      //     this.cursorPosition = {
      //       wordIndex: this.clickWordIndex,
      //       wordCharIndex: firstChar,
      //     }
      //   }
      // } else {
      //   // selection
      //   this.selectWord(target)
      // }
    },
    getWordCharIndex(target, wordElement, selection) {
      let firstChar = 0
      if (target.classList.contains("word_space")) {
        firstChar = wordElement.innerText.length - 1
      } else if (target.classList.contains("word_content")) {
        firstChar = selection.anchorOffset
      }
      return firstChar
    },
    getParentWord(node) {
      if (node.classList.contains("word")) {
        return node
      } else {
        return this.getParentWord(node.parentElement)
      }
    },
    compareSelection(selection) {
      let firstWord = selection?.anchorNode
      let lastWord = selection?.focusNode
      let firstSpan = null
      let lastSpan = null
      let wordsSelected = []
      if (firstWord && lastWord) {
        if (firstWord.nodeName === "#text") {
          firstSpan = firstWord.parentElement.parentElement
        }
        if (lastWord.nodeName === "#text") {
          lastSpan = lastWord.parentElement.parentElement
        }
        let firstSpanId = firstSpan?.getAttribute("id")
        let lastSpanId = lastSpan?.getAttribute("id")

        let firstWordIndex = this.findIndexWithoutEmptyWords(
          this.words,
          (word) => {
            return word?.wid === firstSpanId
          }
        )
        // Click on a word
        if (firstSpanId === lastSpanId) {
          wordsSelected = [this.words.find((word) => word?.wid === firstSpanId)]
        }

        // Selection of multiple words
        else {
          let lastWordIndex = this.words.findIndex(
            (word) => word?.wid === lastSpanId
          )
          // Selection from left to right
          if (firstWordIndex < lastWordIndex) {
            wordsSelected = this.words.slice(firstWordIndex, lastWordIndex + 1)
          }
          // Selection from right to left
          else {
            wordsSelected = this.words.slice(lastWordIndex, firstWordIndex + 1)
            const tmplastWord = lastWord
            lastWord = firstWord
            firstWord = tmplastWord
          }
        }
        this.clickWordIndex = firstWordIndex
      }
      return { wordsSelected, firstWord, lastWord }
    },
    selectWord(target) {
      this.resetWordSelected()
      let selection = window.getSelection()
      let compareWords = this.compareSelection(selection)
      if (compareWords.wordsSelected.length > 0) {
        let left = 0
        let top = 0
        if (compareWords.wordsSelected.length > 1) {
          let firstWord = compareWords.firstWord
          let firstSpan = null
          if (firstWord.nodeName === "#text") {
            firstSpan = firstWord.parentElement
          }
          if (firstSpan) {
            left = firstSpan.offsetLeft - 5
            top = firstSpan.offsetTop - 5
          }
        } else {
          // Force selection of the target/clicked word on simple click
          left = target.offsetLeft - 5
          top = target.offsetTop - 5
        }
        for (let word of compareWords.wordsSelected) {
          this.wordsSelected.push(word?.wid)
        }
        this.editorToolbox = {
          left: left,
          top: top,
          display: true,
          stime: compareWords.wordsSelected[0]?.stime,
        }

        if (
          target.classList.contains("turn") ||
          target.classList.contains("word")
        ) {
          const startRange = compareWords.firstWord
          const endRange = compareWords.lastWord
          window
            .getSelection()
            .setBaseAndExtent(startRange, 1, endRange, endRange.length)
        }
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
    resetWordSelected() {
      if (this.wordsSelected.length > 0) {
        const selection = window.getSelection()
        this.wordsSelected = []
        this.closeEditorToolbox()
      }
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
