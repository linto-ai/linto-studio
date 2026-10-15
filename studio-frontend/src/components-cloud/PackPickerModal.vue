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
    <div class="flex col gap-medium">
      <PackOfferGroup
        v-for="group in groups"
        :key="group.kind"
        :title="$t(group.titleKey)"
        :headline-key="group.headlineKey"
        :features="group.features"
        :note-key="group.noteKey"
        :palette="group.palette">
        <PackOffer
          v-for="pack in group.packs"
          :key="pack.packKey"
          v-model="selectedPackKey"
          name="pack"
          :pack="pack" />
        <template v-if="group.aiCredits" #aside>
          <PackAiCreditsIncluded :credits="group.aiCredits" />
        </template>
      </PackOfferGroup>
    </div>

    <template #actions-left>
      <p class="pack-picker-summary">
        <strong v-if="selectionLabel">{{ selectionLabel }}</strong>
        <span>{{ intro }}</span>
      </p>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import PackAiCreditsIncluded from "@/components-cloud/PackAiCreditsIncluded.vue"
import PackOffer from "@/components-cloud/PackOffer.vue"
import PackOfferGroup from "@/components-cloud/PackOfferGroup.vue"
import { computeDefaultPackKey } from "@/tools/billing/pack/computeDefaultPackKey"
import { computePackOfferGroups } from "@/tools/billing/pack/computePackOfferGroups"
import { formatPackValidity } from "@/tools/billing/pack/formatPackValidity"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// Picks one prepaid pack to buy: one group per kind, what the kind is for,
// then its packs and what they all include; the footer sums up the choice
// and the terms. The purchase
// itself (Checkout redirect) belongs to the parent, which receives the
// chosen packKey on submit.
export default {
  name: "PackPickerModal",
  components: { Modal, PackAiCreditsIncluded, PackOffer, PackOfferGroup },
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
      return computePackOfferGroups(this.packs)
    },
    selectedPack() {
      return (
        this.packs.find((pack) => pack.packKey === this.selectedPackKey) || null
      )
    },
    // "File transcription, 5 h and 50 AI credits"
    selectionLabel() {
      if (!this.selectedPack) return null
      const values = {
        kind: this.$t(`billing.settings.packs.group.${this.selectedPack.kind}`),
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
    formatAmount(amountCents, currency) {
      return formatCurrencyAmount(amountCents, currency, this.$i18n.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
// The choice and the terms, beside the pay button; above it on a narrow
// screen
.pack-picker-summary {
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
