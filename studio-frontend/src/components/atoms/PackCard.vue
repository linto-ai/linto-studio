<template>
  <component
    :is="tag"
    class="pack-card"
    :class="`pack-card--${variant}`"
    :style="paletteStyle">
    <svg
      class="pack-card__motif"
      :viewBox="`0 0 ${MOTIF_WIDTH} ${MOTIF_HEIGHT}`"
      :preserveAspectRatio="motifAlignment"
      aria-hidden="true"
      focusable="false">
      <template v-if="motif === 'waves'">
        <circle
          v-for="radius in WAVE_RADII"
          :key="radius"
          :cx="MOTIF_WIDTH - WAVE_INSET"
          :cy="WAVE_INSET"
          :r="radius" />
      </template>
      <template v-else>
        <path
          v-for="offset in CURVE_OFFSETS"
          :key="offset"
          :d="CURVE_PATH"
          :transform="`translate(0 ${offset})`" />
      </template>
    </svg>

    <span class="pack-card__header">
      <Avatar :icon="icon" tag="span" size="md" circle padded />
      <span v-if="label" class="pack-card__label">{{ label }}</span>
      <span v-if="$scopedSlots['header-end']" class="pack-card__header-end">
        <slot name="header-end" />
      </span>
    </span>

    <span class="pack-card__amount">
      <span
        v-for="(part, index) in amount"
        :key="index"
        :class="`pack-card__${part.type}`"
        >{{ part.value }}</span
      >
      <span v-if="caption" class="pack-card__caption">{{ caption }}</span>
      <span v-if="badge" class="pack-card__badge">{{ badge }}</span>
    </span>

    <slot />

    <span v-if="details.length" class="pack-card__details">
      <span
        v-for="detail in details"
        :key="detail.label"
        class="pack-card__detail">
        <span class="pack-card__detail-label">{{ detail.label }}</span>
        <time
          v-if="detail.datetime"
          class="pack-card__detail-value"
          :datetime="detail.datetime"
          >{{ detail.value }}</time
        >
        <span v-else class="pack-card__detail-value">{{ detail.value }}</span>
      </span>
    </span>
  </component>
</template>

<script>
import { computePackPalette } from "@/tools/computePackPalette"

const MOTIF_WIDTH = 240
const MOTIF_HEIGHT = 160
// Sound waves around a point near the top right corner
const WAVE_INSET = 24
const WAVE_RADII = [20, 40, 60, 80, 100, 120]
const CURVE_PATH = "M -10 150 C 60 150, 90 95, 150 100 S 220 70, 260 20"
const CURVE_OFFSETS = [-22, 0, 22]

// Card of a prepaid pack, shared by the pack to buy and the pack in use: a
// light card where shades of text carry the hierarchy and the color of the
// kind of pack only marks the background wash, the icon, the motif and the
// badge. Markup is phrasing content only (spans, time) so that the card can
// be the <label> of a radio. The card styles its own selection: a radio checked
// anywhere inside it rings the card (:has), no prop needed.
export default {
  name: "PackCard",
  props: {
    // label when the card is a choice, article when it is a plain record
    tag: { type: String, default: "article" },
    // Material color family of the kind (teal, blue…): a pale and a deep
    // shade of it, inverted together by the dark theme.
    color: { type: String, required: true },
    icon: { type: String, required: true },
    // Small caps title next to the icon; none when the context names it
    label: { type: String, default: null },
    // faded: a dashed, muted card, for a pack that no longer counts (spent)
    variant: {
      type: String,
      default: "default",
      validator: (value) => ["default", "faded"].includes(value),
    },
    motif: {
      type: String,
      default: "curves",
      validator: (value) => ["waves", "curves"].includes(value),
    },
    // The big figure, as parts typeset differently (see computeDurationParts)
    amount: { type: Array, required: true },
    // Small text after the figure ("remaining")
    caption: { type: String, default: null },
    // Pill after the figure ("−11 %")
    badge: { type: String, default: null },
    // Label/value pairs along the bottom; datetime makes the value a <time>
    details: { type: Array, default: () => [] },
  },
  data() {
    return {
      MOTIF_WIDTH,
      MOTIF_HEIGHT,
      WAVE_INSET,
      WAVE_RADII,
      CURVE_PATH,
      CURVE_OFFSETS,
    }
  },
  computed: {
    paletteStyle() {
      return computePackPalette(this.color)
    },
    // Waves spread from the top right corner, curves rise from the bottom
    motifAlignment() {
      return this.motif === "waves" ? "xMaxYMin slice" : "xMaxYMax slice"
    },
  },
}
</script>

<style lang="scss" scoped>
.pack-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--medium-gap);
  // A width set on the card (by PackOffer, PackLot) is its outer width
  box-sizing: border-box;
  min-width: 0;
  margin: 0;
  padding: var(--medium-gap);
  border: 1px solid var(--neutral-30);
  border-radius: var(--border-radius-lg);
  // A wash of the kind color from the top left corner, fading out
  background: linear-gradient(
    150deg,
    var(--pack-accent-soft),
    var(--background-primary) 75%
  );
  color: var(--text-primary);

  &--faded {
    border-style: dashed;
    background: var(--background-primary);
    color: var(--text-secondary);
  }

  // A card holding a radio is a choice: it lifts on hover and rings when
  // chosen. The checked radio stays visible too, so the choice is never
  // told by the ring alone.
  &:has(input) {
    cursor: pointer;
    transition:
      transform 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;

    &:hover {
      border-color: var(--neutral-40);
      transform: translateY(-2px);
      box-shadow: var(--shadow-3);
    }
  }

  &:has(:checked) {
    border-color: var(--primary-color);
    box-shadow:
      0 0 0 1px var(--primary-color),
      var(--shadow-3);
  }

  &:has(:focus-visible) {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:has(input) {
      transition: none;

      &:hover {
        transform: none;
      }
    }
  }

  &__motif {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    fill: none;
    stroke: var(--pack-accent);
    stroke-width: 1.25;
    opacity: 0.12;
    pointer-events: none;
  }

  &__header {
    // The icon avatar takes the kind color instead of a tone
    --avatar-background: var(--pack-accent);
    --avatar-color: var(--background-primary);
    display: flex;
    align-items: center;
    gap: var(--small-gap);
    min-height: 1.5rem;
  }

  &__label {
    overflow: hidden;
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-secondary);
  }

  &__header-end {
    display: flex;
    margin-left: auto;
  }

  &__amount {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 0.25rem;
    row-gap: var(--tiny-gap);
    line-height: 1;
  }

  &__number {
    font-size: var(--text-3xl);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  &__unit {
    font-size: var(--text-md);
    font-weight: 700;
  }

  // "12 h 20 min": a little air between one amount and the next
  &__unit + &__number {
    margin-left: 0.25rem;
  }

  &__caption {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  &__badge {
    align-self: center;
    margin-left: auto;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: var(--pack-accent);
    color: var(--background-primary);
    font-size: var(--text-xs);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  // Spread along the bottom edge, on one line: a label too long for the card
  // is cut short, a value never is (it is the information)
  &__details {
    display: flex;
    justify-content: space-between;
    gap: var(--small-gap);
    margin-top: auto;
  }

  &__detail {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  &__detail-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  &__detail-value {
    font-size: var(--text-sm);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
}
</style>
