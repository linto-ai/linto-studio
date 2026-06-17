<template>
  <div v-if="show" class="saas-watermark">
    <span class="saas-watermark__mark">LinTO Free</span>
    <span class="saas-watermark__hint">{{ $t("billing.watermark_hint") }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getEnv } from "@/tools/getEnv"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

// Shown on free-tier AI output. The free plan keeps `ai.output.watermark`
// enabled; Premium clears it. Never shows outside cloud mode.
export default {
  name: "SaasWatermark",
  computed: {
    ...mapGetters("billing", ["can"]),
    show() {
      return IS_MODE_CLOUD && this.can("ai.output.watermark")
    },
  },
}
</script>

<style lang="scss" scoped>
.saas-watermark {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.35em 0.6em;
  margin-bottom: 0.5em;
  border: 1px dashed var(--neutral-40);
  border-radius: 4px;
  background: var(--neutral-10);
  font-size: 0.72rem;

  &__mark {
    font-weight: 700;
    color: var(--neutral-60);
    letter-spacing: 0.04em;
  }
  &__hint {
    color: var(--neutral-60);
  }
}
</style>
