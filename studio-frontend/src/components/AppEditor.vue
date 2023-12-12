<template>
  <div class="flex1 flex col">
    <div id="conversation" class="flex1">
      <div id="tanscript-editor-conversation">
        <div v-for="turn in turnPages[currentPageNb]" :key="turn.turn_id">
          <AppEditorTurn
            v-if="turn.words.length > 0"
            :turnData="turn"
            :speakers="speakers"
            :index="turns.findIndex((turn) => turn.turn_id === turn.turn_id)"
            :usersConnected="usersConnected"
            :conversationId="conversationId"
            :conversationUsers="conversationUsers"
            :userInfo="userInfo"
            :canEdit="canEdit"
            :conversationIsFiltered="conversationIsFiltered"
            :keywords="keywords"
            :lastTurn="
              turns.findIndex((t) => t.turn_id === turn.turn_id) ===
              turns.length - 1
            "
            @mergeTurns="mergeTurns" />
        </div>
      </div>
    </div>

    <AppEditorPlayer
      v-if="conversation.metadata.audio.filename && !noPlayer"
      :audio="conversation.metadata.audio"
      :speakers="speakers"
      :speakersTurnsTimebox="speakersTurnsTimebox"
      :conversationId="conversationId"
      :filterSpeakers="filterSpeakers"
      ref="editorPlayer">
      <AppEditorPagination
        v-model="currentPageNb"
        :pages="pages"></AppEditorPagination>
    </AppEditorPlayer>
  </div>
</template>
<script>
import { bus } from "../main.js"
import AppEditorTurn from "@/components/AppEditorTurn.vue"
import AppEditorPlayer from "@/components/AppEditorPlayer.vue"
import AppEditorPagination from "@/components/Pagination.vue"
import { workerSendMessage } from "../tools/worker-message.js"

export default {
  props: {
    canEdit: {
      type: Boolean,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    conversationUsers: {
      type: Array,
      required: true,
      default: () => [],
    },
    usersConnected: {
      type: Array,
      required: true,
      default: () => [],
    },
    conversation: {
      type: Object,
      required: true,
    },
    filterSpeakers: {
      required: false,
    },
    turnPages: {
      type: Array,
      required: true,
    },
    turns: {
      type: Array,
      required: true,
    },
    noPlayer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      conversationId: this.conversation._id,
      //speakers: this.conversation.speakers,
      currentTime: 0,
      spkColors: [
        "#23C4ED",
        "#00AC61",
        "#8D3DAF",
        "#E07C24",
        "#DB0B5F",
        "#1B98F5",
      ],
      speakersTurnsTimebox: [],
      currentPageNb: 0,
    }
  },
  computed: {
    pages() {
      return this.turnPages.length
    },
    speakers() {
      let speakers = this.conversation.speakers
      let i = 1
      speakers.map((spk) => {
        spk.color = this.spkColors[i % this.spkColors.length]
        i++
      })
      return speakers
    },
    conversationIsFiltered() {
      return this.filterSpeakers != "default"
    },
    keywords() {
      const keywordsTags = []
      const keywordsCat = this.conversation?.keywords || []
      for (let cat of keywordsCat) {
        keywordsTags.push(...cat.tags)
      }
      return keywordsTags
    },
  },
  watch: {
    filterSpeakers() {
      this.speakersTurnsTimebox = this.getSpkTimebox()
    },
  },
  mounted() {
    this.speakersTurnsTimebox = this.getSpkTimebox()
    bus.$on("player-audioprocess", (time) => {
      this.updateCurrentTime(time)
    })
    bus.$on("player-seek", (time) => {
      this.updateCurrentTime(time)
    })

    bus.$on("refresh_spk_timebox", () => {
      this.speakersTurnsTimebox = this.getSpkTimebox()
      bus.$emit("refresh_audio_regions", this.speakersTurnsTimebox)
    })
  },
  beforeDestroy() {
    bus.$off("player-audioprocess")
    bus.$off("player-seek")
    bus.$off("refresh_spk_timebox")
  },
  methods: {
    getSpkTimebox() {
      let spkTimebox = []
      for (let turn of this.turns) {
        if (turn.words.length > 0) {
          let spk = this.speakers.find(
            (spk) => spk.speaker_id === turn.speaker_id
          )
          if (spk) {
            let item = {
              turn_id: turn.turn_id,
              speakerId: turn.speaker_id,
              speakerName: spk.speaker_name,
              stime: turn.words[0].stime,
              etime: turn.words[turn.words.length - 1].etime,
              color: spk.color,
            }
            spkTimebox.push(item)
          }
        }
      }
      return spkTimebox
    },
    showSpeakerModal() {
      bus.$emit("showSpeakerModal")
    },
    updateCurrentTime(time) {
      this.currentTime = time
      // Remove playing class from all words
      let activeWords = Array.from(
        document.getElementsByClassName("word playing")
      ) // need Array.from else it's a HTMLCollection (which will be updated when removing class)
      if (activeWords.length > 0) {
        for (let word of activeWords) {
          word.classList.remove("playing")
        }
      }

      // Find current page
      for (let i = 0; i < this.turnPages.length; i++) {
        if (
          time >= this.turnPages[i][0].words[0].stime &&
          time <=
            this.turnPages[i][this.turnPages[i].length - 1].words[
              this.turnPages[i][this.turnPages[i].length - 1].words.length - 1
            ].etime
        ) {
          this.currentPageNb = i
          break
        }
      }

      // Find current Turn
      for (let turn of this.turnPages[this.currentPageNb]) {
        if (
          time >= turn.words[0].stime &&
          time <= turn.words[turn.words.length - 1].etime
        ) {
          // Find current word
          for (let word of turn.words) {
            if (time >= word.stime && time <= word.etime) {
              let wordElement = document.getElementById(word.wid)
              if (wordElement) {
                wordElement.classList.add("playing")
                wordElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
                })
              }
            }
          }
          break
        }
      }
    },
    mergeTurns(index) {
      const baseTurn = this.turns.find((turn) => turn.turn_id === index)
      const baseTurnIndex = this.turns.findIndex(
        (turn) => turn.turn_id === index
      )
      if (baseTurnIndex === this.turns.length + 1) {
        return
      }

      const baseTurnTextLength = baseTurn.segment.length
      const nextTurnTextLength = this.turns[baseTurnIndex + 1].segment.length
      const totalTextLenght = baseTurnTextLength + nextTurnTextLength
      if (totalTextLenght >= process.env.VUE_APP_TURN_SIZE) {
        bus.$emit("app_notif", {
          status: "error",
          message: "Too much characters, turns can't be merged",
          timeout: 3000,
          redirect: false,
        })
      } else {
        workerSendMessage("turn_merge_paragraph", {
          startTurn: baseTurn,
          endTurn: this.turns[baseTurnIndex + 1],
          indexEnd: baseTurnIndex + 1,
        })
      }
    },
  },
  components: {
    AppEditorTurn,
    AppEditorPlayer,
    AppEditorPagination,
  },
}
</script>
