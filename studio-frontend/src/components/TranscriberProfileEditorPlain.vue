<template>
  <textarea
    v-model="json_value"
    class="transcriber-profile-editor__plain"
    @keydown="keydown"></textarea>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    // transcriberProfile
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      json_value: JSON.stringify(this.value, null, 2),
    }
  },
  mounted() {},
  methods: {
    keydown(e) {
      e.stopPropagation()
    },
    resetValue() {
      this.json_value = JSON.stringify(this.value, null, 2)
    },
  },
  watch: {
    json_value: {
      handler(value) {
        let res
        try {
          res = JSON.parse(value)
          this.$emit("input", res)
        } catch (e) {}
      },
      deep: true,
    },
  },
  components: {},
}
</script>
