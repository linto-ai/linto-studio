<template>
  <li class="relative">
    <FormInput
      :field="field"
      v-model="field.value"
      :disabled="disabled"
      inputFullWidth>
      <button class="btn black" @click="deleteFile" v-if="!disabled" type="button">
        <span class="icon delete"></span>
      </button>
      <button
        type="button"
        class="btn black"
        @click="playOrStopFile"
        v-if="!disabled">
        <span :class="`icon ${isPlaying ? 'pause' : 'play'}`"></span>
      </button>
    </FormInput>
    <progress
      v-if="disabled"
      class="hoverInput fullwidth audio-upload-list__progress"
      max="100"
      :value="field.progress"></progress>
  </li>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import FormInput from "@/components/FormInput.vue"

export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    deleteFile(event) {
      event.preventDefault()
      this.$emit("deleteFile", event)
    },
    stopFile(event) {
      event.preventDefault()
      this.$emit("stopFile", event)
    },
    playFile(event) {
      event.preventDefault()
      
      this.$emit("playFile", event)
    },
    playOrStopFile(event) {
      event.preventDefault()
      if (this.isPlaying) {
        this.stopFile(event)
      } else {
        this.playFile(event)
      }
    },
  },
  components: { Fragment, FormInput },
}
</script>
