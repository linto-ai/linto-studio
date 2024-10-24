<template>
  <MainContent sidebar box>
    <!-- WAITING PERMISSIONS -->
    <div
      class="flex col center-text flex1 align-center justify-center permission-microphone"
      v-if="waitingPermission">
      <h2>Waiting permission to access your microphone</h2>
      <img class="illustration" src="/img/microphone-illustration.svg" />
    </div>
    <!-- ERROR -->
    <div
      v-else-if="error"
      class="flex col center-text flex1 align-center justify-center permission-microphone-error">
      <h2>
        Bonjour, votre ordinateur est muet.<br />
        Vérifiez les permissions de votre microphone.
      </h2>
      <img class="illustration" src="/img/lsf-hello.svg" />
    </div>
    <!-- TEST MICRO-->
    <div v-else class="flex col gap-small">
      <div class="form-field flex col">
        <label>Choix du microphone</label>
        <CustomSelect :options="optionsDeviceList" v-model="selectedDeviceId" />
      </div>
      <div class="flex">
        <button>
          <span class="label">Test</span>
        </button>
        <div class="flex1"></div>
      </div>
    </div>
  </MainContent>
</template>
<script>
import { bus } from "../main.js"
import MainContent from "@/components/MainContent.vue"
import CustomSelect from "../components/CustomSelect.vue"

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
    }
  },
  mounted() {
    // this.$route.query
    this.getDeviceList()
  },
  computed: {},
  methods: {
    async getDeviceList() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()
        this.audioDevices = [...devices.filter((d) => d.kind == "audioinput")]
        this.waitingPermission = false
        this.computeOptionDeviceList()
      } catch (error) {
        this.error = error
        console.error(error)
        this.waitingPermission = false
      }
    },
    computeOptionDeviceList() {
      let res = []
      console.log("toto")
      if (this.audioDevices) {
        res = this.audioDevices.map((d) => ({
          text: d.label,
          value: d.deviceId,
        }))
        console.log(res)
        //console.log(this.devices)
      }
      this.optionsDeviceList = {
        devices: [
          {
            text: "Default computer microphone",
            value: "default",
          },
          ...res,
        ],
      }
    },
    connectToMicrophone() {
      const deviceId =
        this.selectedDeviceId && this.selectedDeviceId !== "default"
          ? { exact: selectedDeviceId }
          : null

      const constraints = {
        audio: {
          deviceId: deviceId,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((microphoneStream) => {
          self.microphoneStream = microphoneStream
        })
        .catch(this.handleError)
    },
  },
  components: { MainContent, CustomSelect },
}
</script>
