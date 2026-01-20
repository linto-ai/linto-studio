<template>
  <textarea
    v-model="json_value"
    class="transcriber-profile-editor__plain"
    spellcheck="false"
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
    value: {
      handler(newValue) {
        const newJson = JSON.stringify(newValue, null, 2)
        if (newJson !== this.json_value) {
          this.json_value = newJson
        }
      },
      deep: true,
    },
    json_value(value) {
      try {
        const res = JSON.parse(value)
        this.$emit("input", res)
      } catch (e) {}
    },
  },
  components: {},
}
</script>

<style scoped>
.transcriber-profile-editor__plain {
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: var(--medium-gap);
  background: var(--neutral-100);
  color: var(--neutral-30);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: var(--text-sm);
  line-height: 1.6;
  border: none;
  resize: none;
  tab-size: 2;
}

.transcriber-profile-editor__plain:focus {
  outline: none;
}
</style>
