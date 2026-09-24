<template>
  <Box
    type="outline"
    border-color="neutral-20"
    background-color="white"
    border-radius="8px"
    class="seats-panel flex row wrap align-center gap-small">
    <span class="seats-panel__icon">
      <PhIcon name="identification-badge" size="md" />
    </span>

    <div class="seats-panel__text flex1 flex col">
      <p class="seats-panel__headline">
        <output class="seats-panel__figure">
          <strong>{{ used }}</strong>
          <span class="seats-panel__capacity">/ {{ capacity }}</span>
        </output>
        <span class="seats-panel__unit">{{ $t("seats.panel.used") }}</span>
      </p>
      <p class="seats-panel__helper">{{ $t("seats.panel.helper") }}</p>
    </div>

    <!-- Destination still to be decided: the button is shown, the event is not
         wired to anything yet. -->
    <Button
      variant="primary"
      icon="gear"
      :label="$t('seats.panel.manage')"
      @click="$emit('manage')" />
  </Box>
</template>

<script>
import Box from "@/components/atoms/Box.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "SeatsPanel",
  components: { Box, PhIcon },
  props: {
    used: { type: Number, required: true },
    capacity: { type: Number, required: true },
  },
}
</script>

<style lang="scss" scoped>
.seats-panel {
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
}

// Anchors the left edge so the text block does not start against the border.
.seats-panel__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--primary-soft);
  color: var(--primary-color);
}

.seats-panel__text {
  min-width: 12rem;
  gap: 0.15rem;
}

.seats-panel__headline {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin: 0;
}

// The spent count carries the weight; the capacity is context, not news.
.seats-panel__figure {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  font-variant-numeric: tabular-nums;

  strong {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.1;
  }
}

.seats-panel__capacity {
  font-size: 1.05rem;
  color: var(--text-secondary);
}

.seats-panel__unit {
  font-weight: 600;
  font-size: 0.95rem;
}

.seats-panel__helper {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
