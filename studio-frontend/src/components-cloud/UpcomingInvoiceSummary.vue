<template>
  <div class="upcoming-invoice flex col gap-small">
    <div class="flex align-center wrap gap-medium">
      <output class="upcoming-invoice__amount">{{
        formatAmount(invoice.totalCents)
      }}</output>
      <time class="upcoming-invoice__date" :datetime="invoice.date">{{
        $t("billing.settings.upcoming.charged_on", { date: dateLabel })
      }}</time>
    </div>
    <p v-if="hasBalanceDeduction" class="upcoming-invoice__note">
      {{
        $t("billing.settings.upcoming.amount_due", {
          amount: formatAmount(invoice.amountDueCents),
        })
      }}
    </p>

    <details v-if="invoice.lines.length" class="upcoming-invoice__details">
      <summary>{{ $t("billing.settings.upcoming.details") }}</summary>
      <table class="upcoming-invoice__lines">
        <tbody>
          <tr v-for="(line, index) in invoice.lines" :key="index">
            <td>{{ line.description || "—" }}</td>
            <td>{{ formatAmount(line.amountCents) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr v-if="invoice.taxCents != null">
            <th scope="row">{{ $t("billing.settings.upcoming.tax") }}</th>
            <td>{{ formatAmount(invoice.taxCents) }}</td>
          </tr>
          <tr>
            <th scope="row">{{ $t("billing.settings.upcoming.total") }}</th>
            <td>{{ formatAmount(invoice.totalCents) }}</td>
          </tr>
        </tfoot>
      </table>
    </details>
  </div>
</template>

<script>
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { formatFullDate } from "@/tools/formatFullDate"

// Stripe's preview of the next invoice (proration, tax and discounts
// included): the amounts are shown as Stripe computed them, never recomputed.
// The section around it carries its title.
export default {
  name: "UpcomingInvoiceSummary",
  props: {
    // upcomingInvoice of GET /cloud/billing
    invoice: { type: Object, required: true },
  },
  computed: {
    dateLabel() {
      return formatFullDate(this.invoice.date, this.$i18n.locale)
    },
    // A customer balance (credit from a downgrade…) lowers what is charged
    hasBalanceDeduction() {
      return (
        this.invoice.amountDueCents != null &&
        this.invoice.amountDueCents !== this.invoice.totalCents
      )
    },
  },
  methods: {
    formatAmount(amountCents) {
      return formatCurrencyAmount(
        amountCents,
        this.invoice.currency,
        this.$i18n.locale,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.upcoming-invoice {
  padding: 1em;
  border: 1px solid var(--neutral-20);
  border-radius: 4px;
  background: var(--background-primary);

  &__amount {
    font-size: var(--text-2xl);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__date,
  &__note {
    margin: 0;
    color: var(--text-secondary);
  }

  &__details summary {
    width: fit-content;
    color: var(--primary-color);
    cursor: pointer;
  }

  &__lines {
    width: 100%;
    margin-top: var(--small-gap);
    border-collapse: collapse;
    font-size: var(--text-sm);

    th,
    td {
      padding: 0.4em 0;
      border-bottom: 1px solid var(--neutral-20);
      text-align: left;
      font-weight: normal;
    }

    td:last-child {
      padding-left: 1em;
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    tfoot tr:last-child > * {
      border-bottom: none;
      font-weight: 600;
    }
  }
}
</style>
