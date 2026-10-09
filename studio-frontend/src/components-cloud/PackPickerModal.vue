<template>
  <Modal
    v-model="isOpen"
    isForm
    size="lg"
    :loading="loading"
    custom-modal-class="pack-picker-modal"
    :title="$t('billing.settings.packs.title')"
    :text-action-apply="applyLabel"
    icon-action-apply="credit-card"
    :disabled-action-apply="!selectedPack"
    @submit="submit">
    <div class="pack-picker flex col gap-medium">
      <fieldset
        v-for="group in groups"
        :key="group.kind"
        class="pack-picker__group"
        :style="computeGroupPalette(group.kind)"
        :aria-describedby="computePitchId(group.kind)">
        <legend class="pack-picker__legend">
          <span class="pack-picker__overline">{{
            computeGroupTitle(group.kind)
          }}</span>
          <h3 v-if="computeHeadline(group.kind)" class="pack-picker__headline">
            {{ computeHeadline(group.kind) }}
          </h3>
        </legend>
        <PackKindPitch :id="computePitchId(group.kind)" :kind="group.kind" />
        <div class="pack-picker__options">
          <PackOffer
            v-for="pack in group.packs"
            :key="pack.packKey"
            v-model="selectedPackKey"
            name="pack"
            :pack="pack" />
        </div>
      </fieldset>
    </div>

    <template #actions-left>
      <p class="pack-picker__summary">
        <strong v-if="selectionLabel">{{ selectionLabel }}</strong>
        <span>{{ intro }}</span>
      </p>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import PackKindPitch from "@/components-cloud/PackKindPitch.vue"
import PackOffer from "@/components-cloud/PackOffer.vue"
import { PACK_KIND_PITCHES } from "@/const/packKindPitches"
import { computeDefaultPackKey } from "@/tools/computeDefaultPackKey"
import { computePackGroups } from "@/tools/computePackGroups"
import { computePackLook } from "@/tools/computePackLook"
import { computePackPalette } from "@/tools/computePackPalette"
import { formatPackValidity } from "@/tools/formatPackValidity"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// Picks one prepaid pack to buy: one group per kind, what the kind is for,
// then its packs; the footer sums up the choice and the terms. The purchase
// itself (Checkout redirect) belongs to the parent, which receives the
// chosen packKey on submit.
export default {
  name: "PackPickerModal",
  components: { Modal, PackKindPitch, PackOffer },
  props: {
    value: { type: Boolean, default: false },
    // Packs the organization may buy (see computePurchasablePacks)
    packs: { type: Array, required: true },
    // Catalog loading, or the purchase on its way to the payment page
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      selectedPackKey: computeDefaultPackKey(this.packs),
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    groups() {
      return computePackGroups(this.packs)
    },
    selectedPack() {
      return (
        this.packs.find((pack) => pack.packKey === this.selectedPackKey) || null
      )
    },
    // "File transcription · 5 h and 50 AI credits"
    selectionLabel() {
      if (!this.selectedPack) return null
      const values = {
        kind: this.computeGroupTitle(this.selectedPack.kind),
        duration: formatMinutesDuration(this.selectedPack.minutes),
        credits: this.selectedPack.aiCredits,
      }
      return this.selectedPack.aiCredits > 0
        ? this.$t("billing.settings.packs.selection_with_ai", values)
        : this.$t("billing.settings.packs.selection", values)
    },
    // One-off payment, and the validity every pack shares, if they do
    intro() {
      const validity = formatPackValidity(this.packs, this.$i18n.locale)
      if (!validity) return this.$t("billing.settings.packs.intro")
      return this.$t("billing.settings.packs.intro_with_validity", {
        validity,
      })
    },
    applyLabel() {
      if (!this.selectedPack) return this.$t("billing.settings.packs.confirm")
      return this.$t("billing.settings.packs.pay", {
        price: this.formatAmount(
          this.selectedPack.amountCents,
          this.selectedPack.currency,
        ),
      })
    },
  },
  watch: {
    // The catalog loads after the parent mounts: preselect the first pack shown
    // once it is there, and never keep a pack that left the list.
    packs(packs) {
      if (packs.some((pack) => pack.packKey === this.selectedPackKey)) return
      this.selectedPackKey = computeDefaultPackKey(packs)
    },
  },
  methods: {
    submit() {
      if (this.selectedPackKey) this.$emit("submit", this.selectedPackKey)
    },
    computeGroupPalette(kind) {
      return computePackPalette(computePackLook(kind).color)
    },
    computeHeadline(kind) {
      const headlineKey = PACK_KIND_PITCHES[kind]?.headlineKey
      return headlineKey ? this.$t(headlineKey) : null
    },
    // Ties the group to its features, when the kind has some
    computePitchId(kind) {
      return PACK_KIND_PITCHES[kind] ? `pack-pitch-${kind}` : null
    },
    computeGroupTitle(kind) {
      const titleKey = `billing.settings.packs.group.${kind}`
      return this.$te(titleKey) ? this.$t(titleKey) : kind
    },
    formatAmount(amountCents, currency) {
      return formatCurrencyAmount(amountCents, currency, this.$i18n.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.pack-picker {
  // Groups are told apart by their titles and a rule between them
  &__group {
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

  // The choice and the terms, beside the pay button; above it on a narrow
  // screen
  &__summary {
    display: flex;
    flex-direction: column;
    min-width: 0;
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-secondary);

    @media (max-width: 768px) {
      flex-basis: 100%;
    }

    strong {
      font-size: var(--text-sm);
      color: var(--text-primary);
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

      > * {
        flex-shrink: 0;
        scroll-snap-align: start;
      }
    }
  }
}
</style>

<style lang="scss">
// The modal body is tinted by default: plain here, the cards bring the color
.pack-picker-modal .modal-body {
  background: var(--background-primary);
}

// Lets the summary of the choice take a line of its own on a narrow screen
.pack-picker-modal .modal-footer {
  flex-wrap: wrap;
}
</style>
