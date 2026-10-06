<template>
  <Modal
    v-model="isOpen"
    isForm
    size="lg"
    custom-modal-class="pack-picker-modal"
    :title="$t('billing.settings.packs.title')"
    :text-action-apply="applyLabel"
    icon-action-apply="credit-card"
    :disabled-action-apply="!selectedPack"
    @submit="submit">
    <div class="pack-picker flex col gap-medium">
      <p class="pack-picker__intro">{{ intro }}</p>
      <fieldset
        v-for="group in groups"
        :key="group.kind"
        class="pack-picker__group">
        <SectionHeading tag="legend" :title="computeGroupTitle(group.kind)" />
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
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import SectionHeading from "@/components/molecules/SectionHeading.vue"
import PackOffer from "@/components-cloud/PackOffer.vue"
import { computeDefaultPackKey } from "@/tools/computeDefaultPackKey"
import { computePackGroups } from "@/tools/computePackGroups"
import { computeValidityDuration } from "@/tools/computeValidityDuration"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// Picks one prepaid pack to buy. The purchase itself (Checkout redirect)
// belongs to the parent, which receives the chosen packKey on submit.
export default {
  name: "PackPickerModal",
  components: { Modal, SectionHeading, PackOffer },
  props: {
    value: { type: Boolean, default: false },
    // Packs the organization may buy (see computePurchasablePacks)
    packs: { type: Array, required: true },
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
    // One-off payment, and the validity every pack shares, if they do
    intro() {
      const oneOff = this.$t("billing.settings.packs.intro")
      const validityDays = [
        ...new Set(this.packs.map((pack) => pack.validityDays)),
      ]
      const duration =
        validityDays.length === 1
          ? computeValidityDuration(validityDays[0])
          : null
      if (!duration) return oneOff
      const validity = new Intl.NumberFormat(this.$i18n.locale, {
        style: "unit",
        unit: duration.unit,
        unitDisplay: "long",
      }).format(duration.value)
      return this.$t("billing.settings.packs.intro_with_validity", {
        validity,
      })
    },
    applyLabel() {
      if (!this.selectedPack) return this.$t("billing.settings.packs.confirm")
      return this.$t("billing.settings.packs.pay", {
        price: this.computePriceLabel(
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
    computeGroupTitle(kind) {
      const titleKey = `billing.settings.packs.group.${kind}`
      return this.$te(titleKey) ? this.$t(titleKey) : kind
    },
    formatAmount(amountCents, currency) {
      return formatCurrencyAmount(amountCents, currency, this.$i18n.locale)
    },
    // Catalog prices are excluding VAT: Stripe Checkout adds the tax.
    computePriceLabel(amountCents, currency) {
      return this.$t("billing.settings.packs.price_excl_tax", {
        price: this.formatAmount(amountCents, currency),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.pack-picker {
  &__intro {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  // Groups are told apart by their titles and the room between them
  &__group {
    display: flex;
    flex-direction: column;
    gap: var(--small-gap);
    min-width: 0;
    margin: 0;
    padding: 0;
    border: none;

    & + & {
      padding-top: var(--medium-gap);
    }

    // A rendered legend sits apart from the group's flex layout: floated,
    // it is laid out as plain content, spaced like the cards.
    > legend {
      float: left;
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
</style>
