<template>
    <textarea v-model="transcriberProfile" class="transcriber-profile-editor__plain"></textarea>
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
    return {}
  },
  mounted() {
  },
  methods: {},
  computed: {
    transcriberProfile: {
      get() {
        return JSON.stringify(this.value, null, 2)
      },
      set(value) {
        let res;
        try {
          res = JSON.parse(value)
          this.$emit("input", res)
        } catch (e) {}
        
      },
    },
  },
  components: {},
}
</script>