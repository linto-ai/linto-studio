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
import { Throttle } from "@/lib/throttle.js"

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
    return {
      currentValue: this.screen.text.join("\n"),
    }
  },
  created() {
    // Plain instance fields: the throttle is kept to flush on destroy.
    this.textUpdateThrottle = new Throttle()
    this.throttleChange = this.textUpdateThrottle.createThrottle(
      this.handleChange,
      500,
    )
  },
  beforeDestroy() {
    // Send the edit still waiting for its delay, otherwise it is lost when
    // the editor closes within 500ms of the last keystroke.
    this.textUpdateThrottle.executeNow()
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
    handleChange() {
      this.$emit("textUpdate", this.screenId, this.currentValue)
    },
  },
}
</script>
