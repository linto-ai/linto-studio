import CONVERSATION_FORMATS from "../const/conversationFormat.js"
import { bus } from "../main.js"
import { ScreenList } from "../models/screenList.js"
import { workerConnect } from "../tools/worker-message.js"
import { genericConversationMixin } from "./genericConversation.js"

export const subtitleMixin = {
  mixins: [genericConversationMixin],
  data() {
    return {
      subtitleObj: null,
      screens: null,
      subtitleLoaded: false,
      selectedVersions: [],
    }
  },
  watch: {
    subtitleLoaded(newVal) {
      if (newVal) {
        let arr = this.subtitleObj?.screens
        if (arr) {
          this.screens = ScreenList.from(arr)
        }
      }
    },
  },
  methods: {
    workerConnect(conversationId, token, userId) {
      workerConnect(
        conversationId,
        token,
        userId,
        CONVERSATION_FORMATS.subtitles
      )
    },
    async specificWorkerOnMessage(event) {
      switch (event.data.action) {
        case "api_error":
          bus.$emit("app_notif", {
            status: "error",
            message: event.data.params,
            timeout: null,
            redirect: false,
          })
          break
        case "subtitles_loaded":
          this.subtitleObj = event.data.params.subtitles
          this.subtitleLoaded = true
          break
        case "new_version":
          this.conversation.subtitleVersions.push(event.data.params)
          break
        case "version_deleted":
          this.deleteVersions(event.data.params)
          break
        case "screen_update":
          console.log("only reciever")
          this.updateScreen(
            event.data.params.screenId,
            event.data.params.changes
          )
          break
        default:
          break
      }
    },
    updateScreen(screenId, changes) {
      let screenObj = this.screens.screens.get(screenId)
      if (screenObj) {
        bus.$emit("refresh_screen", { screenId, changes })
        let screen = screenObj.screen
        for (const [key, value] of Object.entries(changes)) {
          screen[key] = value
        }
      }
    },
    deleteFromArray(elem, array) {
      let index = array.findIndex((e) => e === elem)
      if (index !== -1) {
        array.splice(index, 1)
      }
    },
    deleteVersions(versionIds) {
      for (const versionId of versionIds) {
        let versionIndex = this.conversation.subtitleVersions.findIndex(
          (version) => version._id === versionId
        )
        if (versionIndex !== -1) {
          this.conversation.subtitleVersions.splice(versionIndex, 1)
        }
        this.deleteFromArray(versionId, this.selectedVersions)
      }
    },
    updateConversationTurns(events) {
      this.conversation.text = events.value
      setTimeout(() => {
        bus.$emit("refresh_spk_timebox", {})
      }, 200)
    },
    updateSpeakerName(speakerId, speakerName) {
      this.conversation.speakers.find(
        (spk) => spk.speaker_id === speakerId
      ).speaker_name = speakerName
    },
    updateSpeakerTurn(turnId, speakerId) {
      this.conversation.text.find(
        (turn) => turn.turn_id === turnId
      ).speaker_id = speakerId
    },
  },
}
