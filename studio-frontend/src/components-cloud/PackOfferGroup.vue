<template>
  <fieldset
    class="pack-offer-group"
    :style="palette"
    :aria-describedby="describedBy">
    <legend class="pack-offer-group__legend">
      <span class="pack-offer-group__overline">{{ title }}</span>
      <h3 v-if="headlineKey" class="pack-offer-group__headline">
        {{ $t(headlineKey) }}
      </h3>
    </legend>

    <ul
      v-if="features.length > 0"
      :id="featuresId"
      class="pack-offer-group__features">
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
          tone="neutral" />
        <span class="pack-offer-group__feature-text">
          <strong>{{ $t(`${feature.key}.title`) }}</strong>
          <span>{{ $t(`${feature.key}.text`) }}</span>
        </span>
      </li>
    </ul>

    <div class="pack-offer-group__body">
      <div class="pack-offer-group__options">
        <slot />
      </div>
      <div v-if="$scopedSlots.aside" class="pack-offer-group__aside">
        <slot name="aside" />
      </div>
    </div>

    <p v-if="noteKey" :id="noteId" class="pack-offer-group__note">
      <PhIcon name="info" />
      <span>{{ $t(noteKey) }}</span>
    </p>
  </fieldset>
</template>

<script>
// The packs of one kind in the purchase modal: the kind name, a headline,
// what the kind is for (features), its packs (default slot, PackOffer
// radios) with what they all include beside them (aside slot), then how the
// kind is counted. Grey but for the kind name and the aside, colored by the
// palette of the kind; the cards bring their own color.
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
    featuresId() {
      return `pack-offer-group-features-${this._uid}`
    },
    noteId() {
      return `pack-offer-group-note-${this._uid}`
    },
    describedBy() {
      const ids = [
        this.features.length > 0 && this.featuresId,
        this.noteKey && this.noteId,
      ].filter(Boolean)
      return ids.length > 0 ? ids.join(" ") : null
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

  &__features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--medium-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__feature {
    display: flex;
    align-items: flex-start;
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

  // Three cards a row, what they include taking the rest of the row (or a
  // row of its own). Padded for the ring of the chosen card. On a narrow
  // screen the cards are one row that scrolls sideways, like the bought packs
  // of the billing tab, and the aside goes under it.
  &__body {
    --pack-offer-gap: var(--medium-gap);
    display: flex;
    flex-wrap: wrap;
    gap: var(--pack-offer-gap);
    padding: var(--tiny-gap);
  }

  &__options {
    display: contents;

    // The cards come from the parent's slot, out of this scope
    > :deep(*) {
      flex: 0 0 calc((100% - 2 * var(--pack-offer-gap)) / 3);
    }
  }

  &__aside {
    display: flex;
    flex: 1 1 12rem;

    > :deep(*) {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    &__options {
      display: flex;
      flex-basis: 100%;
      gap: var(--pack-offer-gap);
      min-width: 0;
      // Room for the ring of the chosen card, inside the scrolled area
      margin: calc(-1 * var(--tiny-gap));
      padding: var(--tiny-gap);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: var(--tiny-gap);

      > :deep(*) {
        flex: 0 0 15rem;
        scroll-snap-align: start;
      }
    }

    &__aside {
      flex-basis: 100%;
    }
  }
}
</style>
