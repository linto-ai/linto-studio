<template>
  <div class="invoice-table-wrapper">
    <!-- Scrolls sideways on narrow screens rather than squeezing columns -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th scope="col">{{ $t("billing.settings.invoices.date") }}</th>
          <th scope="col">{{ $t("billing.settings.invoices.number") }}</th>
          <th scope="col">{{ $t("billing.settings.invoices.amount") }}</th>
          <th scope="col">
            {{ $t("billing.settings.invoices.status_header") }}
          </th>
          <th scope="col">{{ $t("billing.settings.invoices.document") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>
            <time :datetime="row.date">{{ row.dateLabel }}</time>
          </td>
          <td>{{ row.number || "—" }}</td>
          <td>{{ row.amountLabel }}</td>
          <td>
            <Chip :value="row.statusLabel" v-bind="row.statusChipProps" />
          </td>
          <td>
            <a
              v-if="row.link"
              :href="row.link.href"
              target="_blank"
              rel="noopener"
              class="invoice-table__link"
              :aria-label="row.link.description">
              {{ row.link.label }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { formatFullDate } from "@/tools/formatFullDate"

// Statuses that need the admin's attention stand out; the label always
// says the status, the color only doubles it.
const STATUS_CHIP_PROPS = {
  open: { yellow: true },
  uncollectible: { red: true },
}

export default {
  name: "InvoiceTable",
  props: {
    // invoices of GET /cloud/billing, most recent first
    invoices: { type: Array, required: true },
  },
  computed: {
    rows() {
      return this.invoices.map((invoice) => this.computeRow(invoice))
    },
  },
  methods: {
    computeRow(invoice) {
      const dateLabel = formatFullDate(invoice.date, this.$i18n.locale)
      return {
        id: invoice.id,
        date: invoice.date,
        dateLabel,
        number: invoice.number,
        amountLabel: formatCurrencyAmount(
          invoice.totalCents,
          invoice.currency,
          this.$i18n.locale,
        ),
        statusLabel: this.computeStatusLabel(invoice.status),
        statusChipProps: STATUS_CHIP_PROPS[invoice.status] || {},
        link: this.computeDocumentLink(invoice, invoice.number || dateLabel),
      }
    },
    computeStatusLabel(status) {
      const key = `billing.settings.invoices.status.${status}`
      return this.$te(key) ? this.$t(key) : status
    },
    // An unpaid invoice links to the page Stripe hosts to pay it; otherwise
    // the PDF when Stripe has one, else that same hosted page.
    computeDocumentLink(invoice, name) {
      if (invoice.status === "open" && invoice.hostedUrl) {
        return {
          href: invoice.hostedUrl,
          label: this.$t("billing.settings.invoices.pay"),
          description: this.$t("billing.settings.invoices.pay_of", { name }),
        }
      }
      if (invoice.pdfUrl) {
        return {
          href: invoice.pdfUrl,
          label: this.$t("billing.settings.invoices.download_pdf"),
          description: this.$t("billing.settings.invoices.download_pdf_of", {
            name,
          }),
        }
      }
      if (invoice.hostedUrl) {
        return {
          href: invoice.hostedUrl,
          label: this.$t("billing.settings.invoices.view"),
          description: this.$t("billing.settings.invoices.view_of", { name }),
        }
      }
      return null
    },
  },
}
</script>

<style lang="scss" scoped>
.invoice-table-wrapper {
  overflow-x: auto;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);

  th,
  td {
    padding: 0.6em 0.75em;
    border-bottom: 1px solid var(--neutral-20);
    text-align: left;
  }

  th {
    font-weight: 600;
    color: var(--text-secondary);
  }

  th:nth-child(3),
  td:nth-child(3) {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  th:last-child,
  td:last-child {
    text-align: right;
  }

  &__link {
    color: var(--primary-color);

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
