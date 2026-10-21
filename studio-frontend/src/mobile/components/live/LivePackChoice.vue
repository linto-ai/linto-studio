<template>
  <fieldset class="m-pack-choice">
    <legend class="m-section-title m-pack-choice__legend">
      {{ $t("mobile.live.pack_legend") }}
    </legend>
    <LivePackOption
      v-for="pack in packs"
      :key="pack.packKey"
      :value="value"
      name="live-pack"
      :pack="pack"
      @input="$emit('input', $event)" />
    <p class="m-muted m-pack-choice__note">
      {{ $t("billing.settings.packs.pitch.live.counting") }}
    </p>
  </fieldset>
</template>

<script>
import LivePackOption from "@/mobile/components/live/LivePackOption.vue"

// The live packs to choose from (v-model: the chosen packKey), and how live
// minutes are counted.
export default {
  name: "LivePackChoice",
  components: { LivePackOption },
  props: {
    // Live packs of computePackGroups, smallest first
    packs: { type: Array, required: true },
    value: { type: String, default: null },
  },
}
</script>

<style scoped>
.m-pack-choice {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
}

.m-pack-choice__legend {
  margin-bottom: var(--m-space-3);
  padding: 0;
}

.m-pack-choice__note {
  margin: 0;
}
</style>
