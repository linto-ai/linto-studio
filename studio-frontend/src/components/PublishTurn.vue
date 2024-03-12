<template>
  <div class="publish-turn">
    <span class="publish-turn-speaker">{{ speakerName }} : </span>
    <span class="publish-turn-time"
      >({{ startTime }}s - {{ endTime }}s) :
    </span>
    <span class="publish-turn-segment flex1">
      {{ turn.segment }}
    </span>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    turn: {
      type: Object,
      required: true,
    },
    speakerIndexedBySpeakerId: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    speakerName() {
      return this.speakerIndexedBySpeakerId[this.turn.speaker_id].speaker_name
    },
    startTime() {
      return this.secondsToHHMMSSWithDecimals(this.turn.words[0].stime)
    },
    endTime() {
      return this.secondsToHHMMSSWithDecimals(
        this.turn.words[this.turn.words.length - 1].etime
      )
    },
  },
  mounted() {},
  methods: {
    secondsToHHMMSSWithDecimals(totalSeconds, secondsDecimals = 0) {
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = (totalSeconds % 60).toFixed(secondsDecimals)

      if (hours === 0)
        return `${minutes.toString().padStart(2, "0")}:${seconds}`
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds}`
    },
  },
  components: { Fragment },
}
</script>
