<template>
  <PackCard
    class="pack-lot"
    :color="look.color"
    :icon="look.icon"
    :motif="look.motif"
    :variant="lot.isExhausted ? 'faded' : 'default'"
    :label="kindLabel"
    :amount="amount"
    :caption="caption"
    :badge="badge"
    :details="details">
    <template v-if="lot.isCurrent" #header-end>
      <span class="pack-lot__current">{{
        $t("billing.settings.lots.current")
      }}</span>
    </template>
    <BalanceBar :segments="segments" />
    <AiCreditsNote v-if="lot.aiCredits">{{ aiCreditsLabel }}</AiCreditsNote>
  </PackCard>
</template>

<script>
import PackCard from "@/components/atoms/PackCard.vue"
import AiCreditsNote from "@/components-cloud/AiCreditsNote.vue"
import BalanceBar from "@/components/atoms/BalanceBar.vue"
import { computeDurationParts } from "@/tools/computeDurationParts"
import { computePackKindLabelKey } from "@/tools/computePackKindLabelKey"
import { computePluralChoice } from "@/tools/computePluralChoice"
import { computePackLook } from "@/tools/computePackLook"
import { formatShortDate } from "@/tools/formatShortDate"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// Sources of minutes nobody paid for: the welcome lot of a plan, a manual
// grant from the backoffice
const OFFERED_SOURCES = ["welcome", "manual"]

// A prepaid pack being consumed: what is left of it, with the AI credits it
// came with, and when it expires (the purchase date is on the invoices).
export default {
  name: "PackLot",
  components: { AiCreditsNote, PackCard, BalanceBar },
  props: {
    // A lot of computePackLots
    lot: { type: Object, required: true },
  },
  computed: {
    look() {
      return computePackLook(this.lot.kind)
    },
    isOffered() {
      return OFFERED_SOURCES.includes(this.lot.source)
    },
    // What the pack is for; the section title already says it is a pack
    kindLabel() {
      const kindKey = computePackKindLabelKey({
        kind: this.lot.kind,
        hasAiCredits: !!this.lot.aiCredits,
      })
      return this.$te(kindKey) ? this.$t(kindKey) : this.lot.kind
    },
    // The bar shows what is left, like the balances above the packs
    segments() {
      return [
        {
          remaining: this.lot.remaining,
          total: this.lot.minutes,
          pattern: "solid",
        },
      ]
    },
    aiCreditsLabel() {
      const { remaining, total } = this.lot.aiCredits
      return this.$tc(
        "billing.settings.lots.ai_credits_left",
        computePluralChoice(remaining, this.$i18n.locale),
        { remaining, total },
      )
    },
    badge() {
      return this.isOffered ? this.$t("billing.settings.lots.offered") : null
    },
    amount() {
      if (this.lot.isExhausted) {
        return [
          { type: "number", value: this.$t("billing.settings.lots.exhausted") },
        ]
      }
      return computeDurationParts(this.lot.remaining, this.$i18n.locale)
    },
    // "1 h left", "1 h 20 min left"
    caption() {
      if (this.lot.isExhausted) return null
      const isSingular = [1, 60].includes(this.lot.remaining)
      return this.$tc("billing.settings.lots.remaining", isSingular ? 1 : 2)
    },
    details() {
      return [
        {
          label: this.$t("billing.settings.lots.consumed"),
          value: this.$t("billing.settings.lots.consumed_of", {
            consumed: formatMinutesDuration(this.lot.consumed),
            total: formatMinutesDuration(this.lot.minutes),
          }),
        },
        {
          label: this.$t("billing.settings.lots.expires_on"),
          value: this.formatDate(this.lot.expiresAt),
          datetime: this.lot.expiresAt,
        },
      ]
    },
  },
  methods: {
    formatDate(date) {
      return formatShortDate(date, this.$i18n.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
// Taller than a pack to buy, so wider too, to keep its proportions
.pack-lot {
  --balance-bar-fill: var(--pack-accent);
  width: 17.5rem;
  max-width: 100%;
}

.pack-lot__current {
  padding: 0 0.5rem;
  border: 1px solid var(--neutral-30);
  border-radius: 999px;
  background: var(--background-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
