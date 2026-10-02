<template>
  <Modal
    v-model="isOpen"
    isForm
    :title="$t('billing.settings.packs.title')"
    :subtitle="subtitle"
    :text-action-apply="applyLabel"
    icon-action-apply="credit-card"
    :disabled-action-apply="!selectedPack"
    @submit="submit">
    <div class="pack-picker flex col gap-medium">
      <fieldset
        v-for="group in groups"
        :key="group.kind"
        class="pack-picker__group">
        <legend class="pack-picker__legend flex align-center gap-small">
          <Avatar
            v-if="packIcons[group.kind]"
            :icon="packIcons[group.kind]"
            size="md"
            tone="soft" />
          <span>{{ computeGroupTitle(group.kind) }}</span>
        </legend>
        <p v-if="groupHints[group.kind]" class="pack-picker__hint">
          {{ $t(groupHints[group.kind]) }}
        </p>
        <div class="pack-picker__options">
          <label
            v-for="pack in group.packs"
            :key="pack.packKey"
            class="pack-picker__option flex col">
            <span class="flex align-center gap-small">
              <input
                v-model="selectedPackKey"
                type="radio"
                name="pack"
                class="pack-picker__radio no-shrink"
                :value="pack.packKey" />
              <span class="pack-picker__duration">{{
                formatDuration(pack.minutes)
              }}</span>
              <Chip
                v-if="pack.savingPercent"
                class="pack-picker__saving"
                primary
                :value="
                  $t('billing.settings.packs.saving', {
                    percent: pack.savingPercent,
                  })
                " />
            </span>
            <span class="pack-picker__price">{{
              computePriceLabel(pack.amountCents, pack.currency)
            }}</span>
            <span class="pack-picker__hourly">{{
              $t("billing.settings.packs.per_hour", {
                price: formatAmount(pack.hourlyCents, pack.currency),
              })
            }}</span>
          </label>
        </div>
      </fieldset>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import { computePackGroups } from "@/tools/computePackGroups"
import { computeValidityDuration } from "@/tools/computeValidityDuration"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// What a pack buys, by its kind: live sessions or file imports
const PACK_ICONS = {
  live: "microphone",
  transcription: "file-audio",
}

// When a kind of pack is used, for the kinds that need saying
const GROUP_HINTS = {
  transcription: "billing.settings.packs.hint.transcription",
}

// Picks one prepaid pack to buy. The purchase itself (Checkout redirect)
// belongs to the parent, which receives the chosen packKey on submit.
export default {
  name: "PackPickerModal",
  components: { Modal },
  props: {
    value: { type: Boolean, default: false },
    // Packs the organization may buy (see computePurchasablePacks)
    packs: { type: Array, required: true },
  },
  data() {
    return {
      selectedPackKey: this.packs[0]?.packKey ?? null,
      packIcons: PACK_ICONS,
      groupHints: GROUP_HINTS,
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
    // The validity every pack shares, if they do
    subtitle() {
      const oneOff = this.$t("billing.settings.packs.subtitle")
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
      return this.$t("billing.settings.packs.subtitle_with_validity", {
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
    // The catalog loads after the parent mounts: preselect the first pack
    // once it is there, and never keep a pack that left the list.
    packs(packs) {
      if (packs.some((pack) => pack.packKey === this.selectedPackKey)) return
      this.selectedPackKey = packs[0]?.packKey ?? null
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
    formatDuration(minutes) {
      return formatMinutesDuration(minutes)
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
  &__group {
    display: flex;
    flex-direction: column;
    gap: var(--small-gap);
    margin: 0;
    padding: 0;
    border: none;
  }

  &__legend {
    margin-bottom: var(--small-gap);
    padding: 0;
    font-weight: 600;
  }

  &__hint {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: var(--small-gap);
  }

  &__option {
    gap: 0.25em;
    padding: 0.75em 1em;
    border: 1px solid var(--neutral-20);
    border-radius: 4px;
    background: var(--background-primary);
    cursor: pointer;

    &:hover {
      border-color: var(--neutral-40);
    }

    // The modal body is already primary-soft: the chosen card stays white
    // and gets a thicker primary ring instead of a tint.
    &:has(:checked) {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    &:has(:focus-visible) {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  }

  &__radio {
    margin: 0;
    accent-color: var(--primary-color);
  }

  &__duration {
    font-size: var(--text-xl);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__saving {
    margin-left: auto;
  }

  &__price {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__hourly {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-variant-numeric: tabular-nums;
  }
}
</style>
