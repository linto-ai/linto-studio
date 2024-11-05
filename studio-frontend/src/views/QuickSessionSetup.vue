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
      <button class="btn secondary">
        <span class="label">Retour</span>
      </button>
      <div class="flex1"></div>
      <button class="btn" :disabled="!microphoneWorked" @click="setupSession">
        <span class="icon apply"></span>
        <span class="label">Démarrer la réunion</span>
      </button>
    </div>
  </MainContent>

  <!-- === === === === === === LIVE === === === === === === -->

  <MainContent
    noBreadcrumb
    :organizationPage="false"
    fullwidthContent
    sidebar
    v-else-if="state === 'live'">
    <template v-slot:breadcrumb-actions>
      <button>
        <span class="icon record"></span>
      </button>
      <span class="flex1">Recording...</span>
      <button>
        <span class="label">Save and quit</span>
      </button>
    </template>
    <SessionLiveContent
      :organizationId="currentOrganizationScope"
      displayLiveTranscription
      :session="session"
      :selectedChannel="selectedChannel" />
  </MainContent>
</template>
<script>
import { bus } from "../main.js"
import MainContent from "@/components/MainContent.vue"
import CustomSelect from "../components/CustomSelect.vue"
import WebVoiceSDK from "@linto-ai/webvoicesdk"
import StatusLed from "../components/StatusLed.vue"
import { apiSearchSessionByName, apiCreateSession } from "@/api/session.js"
import SessionLiveContent from "@/components/SessionLiveContent"
import convertFloat32ToInt16 from "../tools/convertFloat32ToInt16.js"

export default {
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
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
    }
  },
  mounted() {
    // this.$route.query
    this.getDeviceList()
    this.recorder = new WebVoiceSDK.Recorder()
    this.downSampler = new WebVoiceSDK.DownSampler()
    this.mic = new WebVoiceSDK.Mic()
    this.vad = new WebVoiceSDK.Vad({
      threshold: 0.85,
      timeAfterStop: 1000,
    })
    this.vad.addEventListener("speakingStatus", this.onVadEvent.bind(this))
    this.websocket = null
  },
  computed: {
    selectedMicroName() {
      return this.optionsDeviceList["devices"].find(
        (device) => device.value == this.selectedDeviceId,
      ).text
    },
  },
  methods: {
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
              translations: [],
              diarization: false,
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
      console.log(this.selectedChannel?.streamEndpoints)
      const url = this.selectedChannel?.streamEndpoints?.ws
      console.log(url)
      if (url) {
        this.closeWebsocket()
        this.websocket = new WebSocket(url)
        this.websocket.onopen = this.setupRecord.bind(this)
      } else {
        console.error("No valid endpoint for websocket connection")
      }
    },
    async closeWebsocket() {
      //this.websocket?.close()
    },
    async setupRecord() {
      //this.recorder.start(this.downSampler)
      //this.recorder.rec()
      await this.downSampler.start(this.mic)
      this.downSampler.addEventListener(
        "downSamplerFrame",
        this.onAudioFrame.bind(this),
      )
    },
    onAudioFrame(e) {
      if (this.vad.speaking) {
        const audioData = e.detail
        const int16AudioData = convertFloat32ToInt16(audioData)
        console.log("sending audio", int16AudioData)
        this.websocket.send(int16AudioData)
      }
    },
  },
  watch: {
    async selectedDeviceId() {
      await this.$nextTick()
      this.connectToMicrophone()
    },
  },
  components: { MainContent, CustomSelect, StatusLed, SessionLiveContent },
}
</script>
