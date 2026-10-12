<template>
  <fieldset
    class="pack-offer-group"
    :style="palette"
    :aria-describedby="hasPitch ? pitchId : null">
    <legend class="pack-offer-group__legend">
      <span class="pack-offer-group__overline">{{ title }}</span>
      <h3 v-if="headlineKey" class="pack-offer-group__headline">
        {{ $t(headlineKey) }}
      </h3>
    </legend>

    <div v-if="hasPitch" :id="pitchId" class="pack-offer-group__pitch">
      <ul v-if="features.length > 0" class="pack-offer-group__features">
        <li
          v-for="feature in features"
          :key="feature.key"
          class="pack-offer-group__feature">
          <Avatar
            :icon="feature.icon"
            tag="span"
            size="lg"
            circle
            padded
            tone="soft" />
          <span class="pack-offer-group__feature-text">
            <strong>{{ $t(`${feature.key}.title`) }}</strong>
            <span>{{ $t(`${feature.key}.text`) }}</span>
          </span>
        </li>
      </ul>
      <p v-if="noteKey" class="pack-offer-group__note">
        <PhIcon name="info" />
        <span>{{ $t(noteKey) }}</span>
      </p>
    </div>

    <div class="pack-offer-group__options">
      <slot />
    </div>
  </fieldset>
</template>

<script>
// The packs of one kind in the purchase modal: the kind name, a headline,
// what the kind is for (features, counting note), then its packs (default
// slot, PackOffer radios). Colored by the palette of the kind.
export default {
  name: "PackOfferGroup",
  props: {
    // Name of the kind, e.g. "Live transcription"
    title: { type: String, required: true },
    // i18n key of the headline under the name
    headlineKey: { type: String, default: null },
    // What the kind offers: [{icon, key}], key.title and key.text in i18n
    features: { type: Array, default: () => [] },
    // i18n key of how the kind is counted, when that needs saying
    noteKey: { type: String, default: null },
    // --pack-accent custom properties (see computePackPalette)
    palette: { type: Object, required: true },
  },
  computed: {
    hasPitch() {
      return this.features.length > 0 || !!this.noteKey
    },
    pitchId() {
      return `pack-offer-group-pitch-${this._uid}`
    },
  },
}
</script>

<style lang="scss" scoped>
// Groups are told apart by their titles and a rule between them
.pack-offer-group {
  display: flex;
  flex-direction: column;
  gap: var(--medium-gap);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;

  & + & {
    padding-top: var(--medium-gap);
    border-top: 1px solid var(--neutral-20);
  }

  // A rendered legend sits apart from the group's flex layout: floated, it
  // is laid out as plain content, spaced like the cards.
  &__legend {
    display: flex;
    flex-direction: column;
    gap: var(--tiny-gap);
    float: left;
    width: 100%;
    padding: 0;
  }

  &__overline {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pack-accent);
  }

  &__headline {
    // Global headings span the row and carry margins
    width: auto;
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 700;
  }

  &__pitch {
    display: flex;
    flex-direction: column;
    gap: var(--small-gap);
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--medium-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__feature {
    // The icon takes the kind color, on its pale wash
    --avatar-background: var(--pack-accent-soft);
    --avatar-color: var(--pack-accent);
    display: flex;
    align-items: center;
    gap: var(--small-gap);
    font-size: var(--text-xs);
  }

  &__feature-text {
    display: flex;
    flex-direction: column;
    color: var(--text-secondary);

    strong {
      font-size: var(--text-sm);
      color: var(--text-primary);
    }
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: var(--small-gap);
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-secondary);

    .icon-svg {
      flex-shrink: 0;
    }
  }

  // Room around the cards for the ring of the chosen one. On a narrow
  // screen each group is one row that scrolls sideways, like the bought
  // packs of the billing tab.
  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--medium-gap);
    padding: var(--tiny-gap);

    @media (max-width: 768px) {
      flex-wrap: nowrap;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: var(--tiny-gap);

      // The cards come from the parent's slot, out of this scope
      > :deep(*) {
        flex-shrink: 0;
        scroll-snap-align: start;
      }
    }
  }
}
</style>
