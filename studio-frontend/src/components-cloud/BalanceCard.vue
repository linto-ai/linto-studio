<template>
  <article class="balance-card">
    <header class="balance-card__header">
      <Avatar :icon="icon" tag="span" size="md" padded tone="soft" />
      <h4 class="balance-card__title">{{ title }}</h4>
    </header>

    <p class="balance-card__amount">
      <span v-if="balance.isUnlimited" class="balance-card__number">{{
        $t("billing.unlimited")
      }}</span>
      <template v-else>
        <span
          v-for="(part, index) in amountParts"
          :key="index"
          :class="`balance-card__${part.type}`"
          >{{ part.value }}</span
        >
        <span class="balance-card__caption">{{ availableCaption }}</span>
      </template>
    </p>

    <BalanceBar :segments="segments" />

    <ul v-if="sourceLines.length" class="balance-card__sources">
      <li
        v-for="line in sourceLines"
        :key="line.type"
        class="balance-card__source">
        <span
          class="balance-card__swatch"
          :class="`balance-card__swatch--${line.pattern}`"
          aria-hidden="true"></span>
        <span class="balance-card__source-name">{{ line.name }}</span>
        <span class="balance-card__source-value">{{ line.value }}</span>
        <span
          v-if="line.usedLabel || line.date"
          class="balance-card__source-date">
          <template v-if="line.usedLabel">{{ line.usedLabel }}</template>
          <template v-if="line.usedLabel && line.date"> · </template>
          <time v-if="line.date" :datetime="line.date">{{
            line.dateLabel
          }}</time>
        </span>
      </li>
    </ul>

    <div v-if="$slots.default" class="balance-card__footer">
      <slot />
    </div>
  </article>
</template>

<script>
import BalanceBar from "@/components/atoms/BalanceBar.vue"
import { computeDurationParts } from "@/tools/computeDurationParts"
import { computePluralChoice } from "@/tools/computePluralChoice"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"
import { formatShortDate } from "@/tools/formatShortDate"

// What is left of one kind of usage (file transcription, live, AI credits):
// the total available, then one line per source (the plan quota, then the
// packs bought, then what was offered). An unlimited balance has nothing
// left to count: it shows what was used, a full bar and its plan. The
// default slot holds what goes with the balance: AI costs, an offer, a help
// text.
export default {
  name: "BalanceCard",
  components: { BalanceBar },
  props: {
    // A balance of computeAvailableBalances
    balance: { type: Object, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    // Name of the organization's plan, for its source line
    planName: { type: String, required: true },
  },
  computed: {
    isMinutes() {
      return this.balance.unit === "minutes"
    },
    amountParts() {
      if (this.isMinutes) {
        return computeDurationParts(this.balance.available, this.$i18n.locale)
      }
      return [
        { type: "number", value: this.formatAmount(this.balance.available) },
      ]
    },
    availableCaption() {
      return this.computeAgreeingLabel(
        `billing.settings.balances.available_${this.balance.unit}`,
        this.balance.available,
      )
    },
    // The plan quota is plain, what packs add is hatched, like the swatches;
    // an unlimited plan fills the bar
    segments() {
      if (this.balance.isUnlimited) {
        return [{ remaining: 1, total: 1, pattern: "solid" }]
      }
      return this.balance.sources.map((source) => ({
        remaining: source.remaining,
        total: source.total,
        pattern: this.computePattern(source),
      }))
    },
    sourceLines() {
      if (this.balance.isUnlimited) return [this.computeUnlimitedLine()]
      return this.balance.sources.map((source) => ({
        type: source.type,
        pattern: this.computePattern(source),
        name: this.computeSourceName(source),
        value: this.$t("billing.settings.balances.remaining_of", {
          remaining: this.formatAmount(source.remaining),
          total: this.formatAmount(source.total),
        }),
        ...this.computeSourceDate(source),
      }))
    },
  },
  methods: {
    // "Business plan · Unlimited", then what was used and when it resets
    // ("0 min used · resets on 11/09/2026")
    computeUnlimitedLine() {
      const { used, resetAt } = this.balance
      return {
        type: "plan",
        pattern: "solid",
        name: this.$t("billing.settings.balances.source.plan", {
          plan: this.planName,
        }),
        value: this.$t("billing.unlimited"),
        usedLabel:
          used === null
            ? null
            : `${this.formatAmount(used)} ${this.computeAgreeingLabel(
                `billing.settings.balances.used_${this.balance.unit}`,
                used,
              )}`,
        date: resetAt,
        dateLabel: resetAt
          ? this.$t("billing.settings.balances.resets_on_inline", {
              date: this.formatDate(resetAt),
            })
          : null,
      }
    },
    // A word agreeing with an amount as read: "1 h" is one hour
    computeAgreeingLabel(key, amount) {
      const rounded = Math.round(amount)
      const count = this.isMinutes && rounded === 60 ? 1 : rounded
      return this.$tc(key, computePluralChoice(count, this.$i18n.locale))
    },
    computePattern(source) {
      return source.type === "plan" ? "solid" : "hatched"
    },
    computeSourceName(source) {
      if (source.type === "plan") {
        return this.$t("billing.settings.balances.source.plan", {
          plan: this.planName,
        })
      }
      const choice = source.count > 1 ? 2 : 1
      if (source.type === "offered") {
        return this.$tc(
          `billing.settings.balances.source.offered_${this.balance.unit}`,
          choice,
        )
      }
      // AI credits are no pack of their own: they come with file packs
      if (this.balance.key === "ai") {
        return this.$tc("billing.settings.balances.source.ai_packs", choice)
      }
      return this.$tc("billing.settings.balances.source.packs", choice, {
        count: source.count,
      })
    },
    // When a source changes: the plan quota resets, a pack expires
    computeSourceDate(source) {
      if (source.type === "plan") {
        if (!source.resetAt) return {}
        return {
          date: source.resetAt,
          dateLabel: this.$t("billing.settings.balances.resets_on", {
            date: this.formatDate(source.resetAt),
          }),
        }
      }
      const key =
        source.count > 1
          ? "billing.settings.balances.next_expiry_on"
          : "billing.settings.balances.expires_on"
      return {
        date: source.expiresAt,
        dateLabel: this.$t(key, { date: this.formatDate(source.expiresAt) }),
      }
    },
    formatAmount(value) {
      if (this.isMinutes) return formatMinutesDuration(value)
      return new Intl.NumberFormat(this.$i18n.locale).format(
        Math.round(value || 0),
      )
    },
    formatDate(date) {
      return formatShortDate(date, this.$i18n.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.balance-card {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
  min-width: 0;
  padding: var(--medium-gap);
  border: 1px solid var(--neutral-20);
  border-radius: var(--border-radius-lg);
  background: var(--background-primary);

  &__header {
    display: flex;
    align-items: center;
    gap: var(--small-gap);
  }

  &__title {
    // Global headings span the row and carry margins
    width: auto;
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 600;
  }

  &__amount {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 0.25rem;
    margin: var(--small-gap) 0 0;
    line-height: 1.1;
  }

  &__number {
    font-size: var(--text-2xl);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  &__unit {
    font-size: var(--text-md);
    font-weight: 700;
  }

  // "4 h 5 min": a little air between one amount and the next
  &__unit + &__number {
    margin-left: 0.25rem;
  }

  &__caption {
    margin-left: 0.25rem;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  &__sources {
    display: flex;
    flex-direction: column;
    gap: var(--small-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  // swatch | name | value, the date under the name
  &__source {
    display: grid;
    // The global li margin would space the lines twice
    margin: 0;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: var(--small-gap);
    font-size: var(--text-sm);
  }

  &__source-name {
    font-weight: 600;
  }

  &__source-value {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__source-date {
    grid-column: 2 / -1;
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  // Same fills as BalanceBar's segments, so a line names its segment
  &__swatch {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 2px;
    background: var(--primary-color);

    &--hatched {
      background: repeating-linear-gradient(
        -45deg,
        var(--primary-color) 0 2px,
        transparent 2px 3px
      );
    }
  }

  // What goes with the balance sits at the bottom, cards of a row aligned
  &__footer {
    display: flex;
    flex-direction: column;
    gap: var(--small-gap);
    margin-top: auto;
    padding-top: var(--small-gap);
  }
}
</style>
