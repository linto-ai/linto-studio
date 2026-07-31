<template>
  <div v-if="screen" @click="(e) => $emit('click', e)">
    <div class="flex align-center">
      <label
        class="form-label flex1"
        :id="isCurrent ? 'current-screen-label' : ''"
        :for="flag">
        {{ label }}
      </label>
    </div>
    <div
      v-if="!isCurrent || !canEdit"
      :class="['screen-preview', isCurrent ? 'current' : '']">
      <p v-for="line of screen.text">
        {{ line }}
      </p>
    </div>
    <textarea
      v-else
      wrap="off"
      :id="flag"
      @input="onInput"
      v-model="currentValue"
      :class="['screen-preview', isCurrent ? 'current' : '', 'fullwidth']"
      >{{ startValue }}
    </textarea>
  </div>
</template>
<script>
import { Throttle } from "../tools/throttle.js"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    screen: {
      type: Object,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    const throttleObjectChange = new Throttle()
    return {
      throttleChange: throttleObjectChange.createThrottle(
        this.handleChange,
        500,
      ),
      currentValue: this.screen.text.join("\n"),
    }
  },
  watch: {
    screen: {
      handler() {
        this.currentValue = this.startValue
      },
      deep: true,
    },
  },
  computed: {
    screenId() {
      return this.screen.screen_id
    },
    flag() {
      return `screen-${this.screenId}`
    },
    startValue() {
      return this.screen.text.join("\n")
    },
  },
  methods: {
    onInput() {
      this.throttleChange()
    },
    handleChange(value) {
      this.$emit("textUpdate", this.screenId, this.currentValue)
    },
  },
}
</script>
