<template>
  <MainContent sidebar box>
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
        <!-- <div class="flex gap-small">
          <button class="btn secondary" @click="resetMicrophone">
            <span class="label">
              {{ $t("quick_session.setup_microphone.microphone_reset_button") }}
            </span>
          </button>
          <button @click="connectToMicrophone">
            <span class="label">
              {{
                $t("quick_session.setup_microphone.microphone_select_button")
              }}
            </span>
          </button>
        </div> -->
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
      <button class="btn" :disabled="!microphoneWorked">
        <span class="icon apply"></span>
        <span class="label">Démarrer la réunion</span>
      </button>
    </div>
  </MainContent>
</template>
<script>
import { bus } from "../main.js"
import MainContent from "@/components/MainContent.vue"
import CustomSelect from "../components/CustomSelect.vue"
import WebVoiceSDK from "@linto-ai/webvoicesdk"
import StatusLed from "../components/StatusLed.vue"

export default {
  props: {},
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
    }
  },
  mounted() {
    // this.$route.query
    this.getDeviceList()
    this.recorder = new WebVoiceSDK.Recorder()
    this.mic = new WebVoiceSDK.Mic()
    this.vad = new WebVoiceSDK.Vad({
      threshold: 0.85,
      timeAfterStop: 1000,
    })
    this.vad.addEventListener("speakingStatus", this.onVadEvent.bind(this))
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
      await this.mic.start(deviceId)
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
  },
  watch: {
    async selectedDeviceId() {
      await this.$nextTick()
      this.connectToMicrophone()
    },
  },
  components: { MainContent, CustomSelect, StatusLed },
}
</script>
