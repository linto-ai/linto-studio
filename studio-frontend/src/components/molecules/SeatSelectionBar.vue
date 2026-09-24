<template>
  <Box
    type="flat"
    border-color="primary-color"
    background-color="primary-soft"
    class="seat-selection-bar flex row wrap align-center gap-medium"
    role="region"
    :aria-label="$t('seats.bar.region_label')">
    <output class="seat-selection-bar__count">
      {{ $tc("seats.bar.selected", count, { count }) }}
    </output>
    <span v-if="caption" class="seat-selection-bar__caption">{{
      caption
    }}</span>
    <div class="flex1"></div>
    <Button
      variant="text"
      size="sm"
      :label="$t('seats.bar.clear')"
      @click="$emit('clear')" />
    <Button
      variant="primary"
      size="sm"
      icon="arrow-fat-up"
      :label="$t('seats.bar.grant')"
      :disabled="disabled"
      @click="$emit('grant')" />
  </Box>
</template>

<script>
import Box from "@/components/atoms/Box.vue"

export default {
  name: "SeatSelectionBar",
  components: { Box },
  props: {
    count: { type: Number, required: true },
    // Seat impact of the current selection, already worded by the parent.
    caption: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.seat-selection-bar {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
}

.seat-selection-bar__count {
  font-weight: 600;
}

.seat-selection-bar__caption {
  color: var(--text-secondary);
  font-size: 0.9em;
}
</style>
