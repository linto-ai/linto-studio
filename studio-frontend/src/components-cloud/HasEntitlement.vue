<template>
  <fragment v-if="allowed"><slot /></fragment>
  <fragment v-else-if="$slots.locked"><slot name="locked" /></fragment>
</template>

<script>
import { Fragment } from "vue-fragment"
import { mapGetters } from "vuex"
import { getEnv } from "@/tools/getEnv"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

// Render the default slot only when the current plan grants `capability`.
// In non-cloud modes (premise / self-hosted) nothing is gated, so it always
// renders. Optional #locked slot shows a fallback (e.g. an upsell hint).
export default {
  name: "HasEntitlement",
  components: { Fragment },
  props: {
    capability: { type: String, required: true },
  },
  computed: {
    ...mapGetters("billing", ["can"]),
    allowed() {
      if (!IS_MODE_CLOUD) return true
      return this.can(this.capability)
    },
  },
}
</script>
