import {
  apiGetAudioFileFromConversation,
  apiGetUserRightFromConversation,
  apiGetConversationById,
  apiGetConversationByIdExcluding,
  apiGetConversationChild,
} from "@/api/conversation.js"
import { apiGetUsersByConversationId } from "@/api/user.js"

import USER_RIGHTS from "@/const/userRights.js"
import { getCookie } from "@/tools/getCookie.js"
import { conversationModelMixin } from "./conversationModel.js"

export const genericConversationMixin = {
  mixins: [conversationModelMixin],
  props: {
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
      audioFile: "",
      conversationLoaded: false,
      userId: getCookie("userId"),
      conversationUsersLoaded: false,
      conversationUsers: [],
      conversation: null,
      rootConversation: null,
      canonicalConversation: null,
      channels: [],
      translations: [],
      conversationId: "",
      selectedChannel: "",
      selectedTranslation: "",
      userRight: 0,
      error: false,
    }
  },
  async created() {
    this.debug("Creating generic conversation component")
    this.conversationId = this.$route.params.conversationId
    await this.fetchUserRight()

    await this.setupConversationTree()

    await this.loadConversation()
  },
  computed: {
    userRights() {
      return USER_RIGHTS
    },
    canEdit() {
      if (!this.userRights || !this.userRight) return false

      if (this.conversation?.owner == this.userInfo._id) return true

      return this.userRights.hasRightAccess(
        this.userRight,
        this.userRights.WRITE,
      )
    },
  },
  methods: {
    async setupConversationTree() {
      /* TODO: check for errors */
      // request conv infos
      const conversation = await apiGetConversationById(this.conversationId, {
        text: 0,
        type: 1,
        _id: 1,
      })
      let canonicalConversation

      if (conversation.type.mode != "canonical") {
        canonicalConversation = await apiGetConversationById(
          conversation.type.from_canonical_id,
          { text: 0, type: 1, _id: 1 },
        )
      } else {
        canonicalConversation = conversation
      }

      this.rootConversation = canonicalConversation

      const childs = await apiGetConversationChild(canonicalConversation._id, [
        "_id",
        "name",
        "type.mode",
        "locale",
        "metadata.transcription",
        "jobs.transcription.state",
      ])

      const childsType = childs.map((child) => child.type.mode)

      switch (childsType[0]) {
        case "child": // multitple channels
          this.channels = childs
          const doneChild =
            childs.find((c) => !this.isChannelProcessing(c)) || childs[0]
          this.translations = await apiGetConversationChild(doneChild._id, [
            "_id",
            "name",
            "type.mode",
            "locale",
          ])
          this.conversationId = doneChild._id
          this.selectedChannel = doneChild._id
          this.selectedTranslation = "original"
          break
        case "translation": // one channel, only translation
          this.channels = []
          this.translations = childs
          this.selectedTranslation = "original"
          this.conversationId = canonicalConversation._id
          break
        default:
          break
      }
    },
    async switchChannel(channelId) {
      this.conversationId = channelId
      this.translations = await apiGetConversationChild(channelId, [
        "_id",
        "name",
        "type.mode",
        "locale",
      ])
      this.selectedTranslation = "original"
      await this.loadConversation()
    },
    async switchTranslation(id) {
      let nextId = id
      if (id == "original") {
        nextId = this.conversation.type.from_parent_id
      }
      this.conversationId = nextId
      await this.loadConversation()
    },
    async loadConversation() {
      this.conversationLoaded = false
      // The subtitle pages never read the transcription text: skip it
      const conversation = await apiGetConversationByIdExcluding(
        this.conversationId,
        ["text"],
      )
      if (!conversation) {
        this.error = true
        return
      }
      this.conversation = conversation
      await this.initConversation()
    },
    async initConversation() {
      await this.dispatchConversationUsers()

      if (this.initConversationHook) {
        await this.initConversationHook()
      }
      this.conversationLoaded = true
    },

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
      this.conversationUsersLoaded = false
      let convUsers = await apiGetUsersByConversationId(this.conversationId)
      this.conversationUsers = [
        ...convUsers.organization_members,
        ...convUsers.external_members,
      ]
      this.conversationUsersLoaded = true
    },
    async getAudioFile() {
      if (this.audioFile === "") {
        let req = await apiGetAudioFileFromConversation(
          this.conversationId,
          false,
        )
        if (req?.status === "success") {
          this.audioFile = URL.createObjectURL(req.data)
        }
      } else {
        this.audioFile = ""
      }
    },
    isChannelProcessing(channel) {
      const state = channel.jobs?.transcription?.state
      return !!state && state !== "done" && state !== "error"
    },
    updateChannelJobState(conversationId, state) {
      const channel = this.channels.find((c) => c._id === conversationId)
      if (!channel) return
      if (channel.jobs?.transcription?.state === state) return
      if (!channel.jobs) channel.jobs = {}
      if (!channel.jobs.transcription) channel.jobs.transcription = {}
      channel.jobs.transcription.state = state
      this.channels = [...this.channels]
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
  watch: {
    selectedChannel(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== "") {
        this.switchChannel(newVal)
      }
    },
    selectedTranslation(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== "") {
        this.switchTranslation(newVal)
      }
    },
  },
}
