import {
  apiGetAudioFileFromConversation,
  apiGetUserRightFromConversation,
} from "../api/conversation.js"
import { bus } from "../main.js"
import { getCookie } from "../tools/getCookie.js"
import { workerDisconnect } from "../tools/worker-message.js"
import EditorWorker from "../workers/collaboration-worker"

export const genericConversationMixin = {
  props: {
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
      audioFile: "",
      conversationLoaded: false,
      userId: getCookie("userId"),
      usersConnected: [],
      focusFields: {},
      conversationUsersLoaded: false,
      conversation: null,
      conversationId: "",
      userRight: 0,
      error: false,
      hightlightsCategories: [],
    }
  },
  async created() {
    this.debug("Creating generic conversation component")
    this.conversationId = this.$route.params.conversationId
    this.fetchUserRight()
    await this.workerConnect(
      this.conversationId,
      this.userInfo.token,
      this.userInfo._id
    )
    // Load conversation by asking worker
    EditorWorker.workerSingleton.getWorker().onmessage = async (event) => {
      if (event.data.action !== "user_focus_field") {
        this.debug("Message from worker: %s", event.data.action)
      }
      switch (event.data.action) {
        case "error":
          this.error = true
        case "disconnected":
          this.userRight = 0
          bus.$emit("show_modal", {
            title: this.$i18n.t("conversation.websocket_error_title"),
            content: this.$i18n.t("conversation.websocket_error_content"),
            actionBtnLabel: "ok",
            cancelButton: false,
          })
          break
        case "conversation_loaded":
          this.conversation = event.data.params
          await this.dispatchConversationUsers()
          this.$store.commit(
            "SET_CURRENT_CONVERSATION_NAME",
            this.conversation.name
          )

          if (
            this.conversation?.metadata?.channel?.channel_count &&
            this.conversation?.metadata?.channel?.channel_count > 0 &&
            this.conversation.type.mode !== "child"
          ) {
            const firstChannelId = this.conversation.type.child_conversations[0]
            console.log("firstChannelId", firstChannelId)
            // go to 1st channel
            this.$router.replace(this.selfUrl(firstChannelId))
          } else {
            this.conversationLoaded = true
          }

          break
        case "title_updated":
          bus.$emit("update_field", {
            ...event.data.params,
            flag: "conversationName",
          })
          bus.$emit("update_conversation_name", {})
          break
        case "description_updated":
          bus.$emit("update_field", {
            ...event.data.params,
            flag: "conversationDescription",
          })
          break
        case "user_focus_field":
          this.usersConnected = event.data.params.users
          this.focusFields = event.data.params.focusFields
          break
        case "user_right_updated":
          await this.dispatchConversationUsers()
          await this.fetchUserRight()
          break
        case "conv_orga_updated":
          this.organizationMemberAccess = event.data.params.value.membersRight
          await this.dispatchConversationUsers()
          await this.fetchUserRight()
          break
        case "job_transcription_update":
          const transcriptionState = event.data.params?.state ?? "pending"
          if (!this.conversation.jobs) this.conversation.jobs = {}
          this.conversation.jobs.transcription = {
            state: transcriptionState,
            steps: event.data.params.steps,
            job_logs: event.data.params.job_logs,
          }
          bus.$emit("job_transcription_update", {})

          if (transcriptionState === "done" || transcriptionState === "error")
            window.location.reload()
          break
        default:
          this.specificWorkerOnMessage(event)
          break
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.debug("Leaving conversation component")
    // disconnect worker + socket
    workerDisconnect()
    next()
  },
  computed: {
    userRights() {
      return this.$store.state.userRights
    },
    conversationUsers() {
      if (this.conversationUsersLoaded) {
        let convUsers = this.$store.state.conversationUsers
        return (
          [...convUsers.organization_members, ...convUsers.external_members] ||
          []
        )
      } else return []
    },
  },
  methods: {
    async fetchUserRight() {
      this.userRight = (
        await apiGetUserRightFromConversation(this.conversationId)
      ).right
    },
    updateConversationObj(data) {
      if (data.flag === "conversationName") {
        this.conversation.name = data.value
      }
    },
    getUserById(userId) {
      return this.$store.getters.getUserInConvById(userId)
    },
    timeToHMS(time) {
      return this.$options.filters.timeToHMS(time)
    },
    dateToJMYHMS(date) {
      return this.$options.filters.dateToJMYHMS(date)
    },
    getTimeDiffText(dateVal) {
      return this.$options.filters.getTimeDiffText(dateVal)
    },
    async dispatchConversationUsers() {
      this.conversationUsersLoaded = await this.$options.filters.dispatchStore(
        "getUsersByConversationId",
        { conversationId: this.conversationId }
      )
    },
    async getAudioFile() {
      if (this.audioFile === "") {
        let req = await apiGetAudioFileFromConversation(
          this.conversationId,
          false
        )
        if (req?.status === "success") {
          this.audioFile = URL.createObjectURL(req.data)
        }
      } else {
        this.audioFile = ""
      }
    },
    computeStatus(job) {
      if (!job) return "pending"
      if (job.state === "done" || job.state === "error") {
        return job.state
      }
      const steps = job?.steps
      if (steps) {
        switch (true) {
          case steps?.preprocessing?.status === "started" ||
            steps?.preprocessing?.status === "StepState.STARTED":
            return "preprocessing"
          case steps?.transcription?.status === "started" ||
            steps?.transcription?.status === "StepState.STARTED":
            return "transcription"
          case steps?.diarization?.status === "started" ||
            steps?.diarization?.status === "StepState.STARTED":
            return "diarization"
          case steps?.punctuation?.status === "started" ||
            steps?.punctuation?.status === "StepState.STARTED":
            return "punctuation"
          case steps?.postprocessing?.status === "started" ||
            steps?.postprocessing?.status === "StepState.STARTED":
            return "postprocessing"
          default:
            return job.state
        }
      }
    },
  },
}
