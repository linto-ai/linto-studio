<template>
  <div class="context-menu__element flex gap-small" @click="copyEndpoint">
    <pre class="flex1 overflow-horizontal-auto">{{ endpoint }}</pre>
    <Button
      :icon="endpointHasbeenCopied ? 'check' : 'clipboard'"
      iconWeight="regular" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      endpointHasbeenCopied: false,
    }
  },
  mounted() {},
  methods: {
    copyEndpoint() {
      const endpoint = this.endpoint
      navigator.clipboard.writeText(endpoint)
      this.endpointHasbeenCopied = true
      setTimeout(() => {
        this.endpointHasbeenCopied = false
      }, 2000)
    },
  },
  components: { Fragment },
}
</script>
