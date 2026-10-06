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
    <UsageBar
      :value="lot.consumed"
      :max="lot.minutes"
      :tone="lot.isExhausted ? 'neutral' : 'status'"
      :aria-label="$t('billing.settings.lots.consumed_label')" />
  </PackCard>
</template>

<script>
import PackCard from "@/components/atoms/PackCard.vue"
import UsageBar from "@/components/atoms/UsageBar.vue"
import { computeDurationParts } from "@/tools/computeDurationParts"
import { computePackLook } from "@/tools/computePackLook"
import { formatShortDate } from "@/tools/formatShortDate"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

// Sources of minutes nobody paid for: the welcome lot of a plan, a manual
// grant from the backoffice
const OFFERED_SOURCES = ["welcome", "manual"]

// A prepaid pack being consumed: what is left of it and when it expires (the
// purchase date is on the invoices).
export default {
  name: "PackLot",
  components: { PackCard, UsageBar },
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
      const kindKey = `billing.settings.packs.kind.${this.lot.kind}`
      return this.$te(kindKey) ? this.$t(kindKey) : this.lot.kind
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
    // "1 h restante", "1 h 20 min restantes"
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
  width: 17.5rem;
  max-width: 100%;
}
</style>
