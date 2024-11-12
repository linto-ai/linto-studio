<template>
  <!-- === === === === === MICROPHONE SETUP === === === === === -->
  <MainContent sidebar box v-if="state === 'microphone-setup'">
    <!-- WAITING PERMISSIONS -->
    <div
      class="flex col center-text flex1 align-center justify-center permission-microphone"
      v-if="waitingPermission">
      <h2>
        {{ $t("quick_session.setup_microphone.waiting_permission_title") }}
      </h2>
      <img class="illustration" src="/img/microphone-illustration.svg" />
    </div>
    <!-- ERROR -->
    <div
      v-else-if="error"
      class="flex col center-text flex1 align-center justify-center permission-microphone-error">
      <h2>
        {{ $t("quick_session.setup_microphone.microphone_error_first_line") }}
        <br />
        {{ $t("quick_session.setup_microphone.microphone_error_second_line") }}
      </h2>
      <img class="illustration" src="/img/lsf-hello.svg" />
    </div>
    <div v-else class="flex col">
      <!-- SELECTION MICRO-->
      <section class="flex col gap-small">
        <div class="form-field flex col medium-margin-top">
          <label>{{
            $t("quick_session.setup_microphone.microphone_select_label")
          }}</label>
          <CustomSelect
            :options="optionsDeviceList"
            v-model="selectedDeviceId"
            class="fullwidth" />
        </div>
      </section>
      <!-- TEST MICROPHONE SECTION-->
      <section class="flex col gap-small">
        <h2>{{ selectedMicroName }}</h2>
        <div>
          {{ $t("quick_session.setup_microphone.sound_detector_headline") }}
        </div>

        <div
          class="microphone-sound-detector"
          :microphoneWorked="microphoneWorked">
          <div class="form-field flex col">
            <div class="flex align-center gap-small">
              <label>
                {{ $t("quick_session.setup_microphone.sound_detector_label") }}
              </label>
              <StatusLed :on="speaking" />
            </div>
            <div v-if="microphoneWorked">
              {{ $t("quick_session.setup_microphone.sound_detector_value_ok") }}
              <span class="icon apply microphone-sound-detector__ok-icon" />
            </div>
            <div v-else>
              {{
                $t("quick_session.setup_microphone.sound_detector_value_wait")
              }}
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="flex medium-margin-top">
      <button class="btn secondary" @click="backToStart">
        <span class="label">Retour</span>
      </button>
      <div class="flex1"></div>
      <button class="btn" :disabled="!microphoneWorked" @click="setupSession">
        <span class="icon apply"></span>
        <span class="label">Démarrer la réunion</span>
      </button>
    </div>
  </MainContent>

  <!-- === === === === === === = LIVE = === === === === === -->

  <MainContent
    noBreadcrumb
    :organizationPage="false"
    fullwidthContent
    sidebar
    v-else-if="state === 'live'">
    <template v-slot:sidebar>
      <div class="flex col medium-padding gap-medium">
        <SessionTranslationSelection
          :selectedChannel="selectedChannel"
          v-model="selectedTranslations"></SessionTranslationSelection>
        <h3>{{ $t("session.detail_page.title_interface_settings") }}</h3>
        <FormCheckbox
          :field="displayLiveTranscriptionField"
          switchDisplay
          v-model="displayLiveTranscriptionField.value" />
        <FormCheckbox
          :field="displaySubtitlesField"
          switchDisplay
          v-model="displaySubtitlesField.value" />

        <FormInput
          :field="fontSizeField"
          v-model="fontSizeField.value"
          v-if="displaySubtitlesField.value" />
      </div>
    </template>

    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <button @click="toggleMicrophone">
          <span
            class="icon record"
            v-if="isRecording && isConnectedToWS"></span>
          <span class="icon record-off" v-else></span>
        </button>
        <StatusLed :on="speaking" />
        <span v-if="!isConnectedToWS">
          {{ $t("quick_session.live.status_no_websocket") }}
        </span>
        <span class="flex1" v-else-if="isRecording">{{
          $t("quick_session.live.status_recording")
        }}</span>
        <span class="flex1" v-else>
          {{ $t("quick_session.live.status_muted") }}
        </span>
      </div>

      <button @click="onSaveSession" :disabled="isSavingSession">
        <span class="label">{{ $t("quick_session.live.save_button") }}</span>
      </button>
    </template>
    <SessionLiveContent
      :organizationId="currentOrganizationScope"
      displayLiveTranscription
      :session="session"
      :displaySubtitles="displaySubtitlesField.value"
      :displayLiveTranscription="displayLiveTranscriptionField.value"
      :fontSize="fontSizeField.value"
      customTitle="Quick meeting"
      :selectedTranslations="selectedTranslations"
      :selectedChannel="selectedChannel" />
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import WebVoiceSDK from "@linto-ai/webvoicesdk"

import convertFloat32ToInt16 from "@/tools/convertFloat32ToInt16.js"
import { customDebug } from "@/tools/customDebug.js"
import { userName } from "@/tools/userName.js"

import {
  apiSearchSessionByName,
  apiCreateSession,
  apiUpdateSession,
  apiDeleteSession,
} from "@/api/session.js"

import EMPTY_FIELD from "@/const/emptyField"

import MainContent from "@/components/MainContent.vue"
import CustomSelect from "@/components/CustomSelect.vue"
import StatusLed from "@/components/StatusLed.vue"
import SessionLiveContent from "@/components/SessionLiveContent"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"

export default {
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    userInfo: { type: Object, required: true },
  },
  data() {
    const source = this.$route.query.source
    return {
      debugQuickSession: customDebug("vue:debug:quickSession"),
      waitingPermission: true,
      error: null,
      audioDevices: null,
      selectedDeviceId: "default",
      optionsDeviceList: {},
      microphoneStream: null,
      speaking: false,
      microphoneWorked: false,
      state: "microphone-setup", // microphone-setup, live
      session: null,
      selectedChannel: null,
      mediaProcessor: null,
      mediaProcessorReader: null,
      hasReceivedACK: false,
      sendRawAudio: true,
      isRecording: false,
      isSavingSession: false,
      isConnectedToWS: false,
      fontSizeField: {
        ...EMPTY_FIELD,
        value: "40",
        label: this.$t("session.detail_page.font_size_label"),
        type: "number",
        customParams: {
          min: 12,
          max: 68,
        },
      },
      displaySubtitlesField: {
        ...EMPTY_FIELD,
        value: true,
        label: this.$t("session.detail_page.display_subtitles_label"),
      },
      displayLiveTranscriptionField: {
        ...EMPTY_FIELD,
        value: true,
        label: this.$t("session.detail_page.display_live_transcription_label"),
      },
      selectedTranslations: null,
    }
  },
  mounted() {
    // this.$route.query
    this.getDeviceList()
    this.recorder = new WebVoiceSDK.Recorder()
    this.downSampler = new WebVoiceSDK.DownSampler({
      targetSampleRate: 16000,
      targetFrameSize: 4096,
      Int16Convert: true,
    })
    this.mic = new WebVoiceSDK.Mic({
      frameSize: 4096,
    })
    this.vad = new WebVoiceSDK.Vad({
      threshold: 0.85,
      timeAfterStop: 1000,
    })
    this.vad.addEventListener("speakingStatus", this.onVadEvent.bind(this))
    this.websocket = null
    this.audioEncoder = null
  },
  destroyed() {
    this.close()
  },
  computed: {
    selectedMicroName() {
      return this.optionsDeviceList["devices"].find(
        (device) => device.value == this.selectedDeviceId,
      ).text
    },
  },
  methods: {
    async close() {
      await this.mic.stop()
      await this.vad.stop()
      await this.downSampler.stop()
      this.closeWebsocket()
    },
    async backToStart() {
      await this.close()
      this.$router.replace({ name: "conversations create" })
    },
    async onSaveSession() {
      this.isSavingSession = true
      const now = new Date()
      const conversationName = `Meeting from ${userName(this.userInfo)}, ${now.toLocaleString()} `
      await this.close()

      await apiDeleteSession(this.currentOrganizationScope, this.session.id, {
        name: conversationName,
      })
      this.$router.replace({ name: "inbox" })
    },
    async getDeviceList() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()
        this.audioDevices = [...devices.filter((d) => d.kind == "audioinput")]
        this.waitingPermission = false
        this.computeSelectOptionFromDeviceList()
        this.connectToMicrophone()
      } catch (error) {
        this.error = error
        console.error(error)
        this.waitingPermission = false
      }
    },
    computeSelectOptionFromDeviceList() {
      let res = []
      if (this.audioDevices) {
        res = this.audioDevices.map((d) => ({
          text: d.label,
          value: d.deviceId,
        }))
      }
      this.optionsDeviceList = {
        devices: [
          {
            text: this.$t(
              "quick_session.setup_microphone.microphone_default_value",
            ),
            value: "default",
          },
          ...res,
        ],
      }
    },
    async connectToMicrophone() {
      const deviceId =
        this.selectedDeviceId && this.selectedDeviceId !== "default"
          ? { exact: this.selectedDeviceId }
          : null

      await this.mic.stop()
      await this.vad.stop()
      await this.downSampler.stop()
      await this.mic.start(deviceId)
      //
      this.vad.start(this.mic)
      this.microphoneWorked = false
    },
    resetMicrophone() {
      this.selectedDeviceId = "default"
      this.connectToMicrophone()
    },
    onVadEvent(e) {
      const speaking = !!e.detail
      this.speaking = speaking
      this.microphoneWorked = this.microphoneWorked || this.speaking
    },
    async setupSession(e) {
      e.preventDefault()

      try {
        const sessionName = `@${this.userInfo._id}`
        const alreadyCreatedPersonalSessions = await apiSearchSessionByName(
          this.currentOrganizationScope,
          sessionName,
        )

        if (alreadyCreatedPersonalSessions.length > 0) {
          this.session = alreadyCreatedPersonalSessions[0]
        } else {
          const channels = [
            {
              name: "Main",
              transcriberProfileId: this.$route.query.transcriberProfileId,
              translations: this.$route.query.translations ?? [],
              diarization: this.$route.query.diarization ?? false,
            },
          ]
          const res = await apiCreateSession(this.currentOrganizationScope, {
            name: sessionName,
            channels: channels,
            visibility: "private",
          })

          if (res.status == "success") {
            this.session = res.data
          } else {
            throw new Error("api error")
          }
        }

        this.selectedChannel = this.session.channels[0]
        this.state = "live"
        this.selectedTranslations = "original"
        this.connectToWebsocket()
      } catch (error) {
        console.error(error)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t("session.create_page.error_message"),
          timeout: null,
        })
      }
      // check if session exists
    },
    async connectToWebsocket() {
      const url = this.selectedChannel?.streamEndpoints?.ws
      this.debugQuickSession(`Connecting WS to ${url}...`)
      if (url) {
        this.closeWebsocket()
        await this.$nextTick()
        this.websocket = new WebSocket(url)
        this.websocket.binaryType = "arraybuffer"
        this.websocket.onopen = this.sendWSInitMessage.bind(this) //this.setupRecord.bind(this)
        this.websocket.onmessage = this.onWebsocketMessage.bind(this)
      } else {
        console.error("No valid endpoint for websocket connection")
      }
    },
    onWebsocketMessage(message) {
      const msg = JSON.parse(message.data)
      if (msg.type === "ack") {
        this.debugQuickSession("Received ACK")
        //self.hasReceivedACK = true
        this.setupRecord()
      }
    },
    async closeWebsocket() {
      this.websocket?.close()
      this.isConnectedToWS = true
    },
    sendWSInitMessage() {
      const initMessage = {
        type: "init",
        sampleRate: 16000,
        encoding: "pcm", // Spécifie que les données sont en PCM brut
      }
      this.websocket.send(JSON.stringify(initMessage))
    },
    async setupRecord() {
      this.debugQuickSession(`WS is connected`)
      this.isConnectedToWS = true

      if (!this.sendRawAudio) {
        this.debugQuickSession("Start recording setup")

        this.audioEncoder = new AudioEncoder({
          output: this.processEncodedAudio.bind(this),
          error: this.errorOnEncodedAudio.bind(this),
        })

        this.debugQuickSession(
          "Audio encoder created. Start encoder configuration...",
        )

        let config = {
          codec: "opus",
          sampleRate: 16000,
          numberOfChannels: 1,
        }

        this.audioEncoder.configure(config)
      }

      this.debugQuickSession("Starting downsampler")
      await this.downSampler.start(this.mic)
      this.downSampler.addEventListener(
        "downSamplerFrame",
        this.onAudioFrame.bind(this),
      )
      this.isRecording = true
    },
    onAudioFrame(e) {
      if (!this.isRecording) {
        return
      }

      if (this.sendRawAudio) {
        if (this.vad.speaking) {
          const data = e.detail
          this.websocket.send(data)
        }
      } else {
        const data = e.detail
        const audioData = new AudioData({
          format: "s16",
          sampleRate: "16000",
          numberOfFrames: "4096",
          numberOfChannels: 1,
          timestamp: 0,
          data,
        })

        this.encodeAudioToCodec(audioData)
      }
    },
    encodeAudioToCodec(value) {
      this.audioEncoder.encode(value)
    },
    processEncodedAudio(chunk) {
      // let newBuffer

      const buffer = new ArrayBuffer(chunk.byteLength * 2)

      chunk.copyTo(buffer)

      const int16array = new Int16Array(buffer)

      // const int16array = new Int16Array(chunk.byteLength / 2 + 1)

      this.websocket.send(int16array)
    },
    errorOnEncodedAudio(error) {
      console.error("encoding failed", error)
    },
    toggleMicrophone() {
      if (this.isConnectedToWS) {
        this.isRecording = !this.isRecording
      }
    },
  },
  watch: {
    async selectedDeviceId() {
      await this.$nextTick()
      this.connectToMicrophone()
    },
  },
  components: {
    MainContent,
    CustomSelect,
    StatusLed,
    SessionLiveContent,
    FormInput,
    FormCheckbox,
    SessionTranslationSelection,
  },
}
</script>
