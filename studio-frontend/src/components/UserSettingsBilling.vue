<template>
  <div class="user-billing">
    <header class="user-billing__head">
      <div>
        <h2 class="user-billing__title">{{ $t("billing.account.title") }}</h2>
        <p class="user-billing__subtitle">
          {{ $t("billing.account.subtitle") }}
        </p>
      </div>
      <div
        class="user-billing__total"
        :class="{ 'user-billing__total--paid': hasPaidOrg }">
        <span class="user-billing__total-label">{{
          $t("billing.account.total_monthly")
        }}</span>
        <output class="user-billing__total-amount">{{
          totalMonthlyLabel
        }}</output>
        <span class="user-billing__total-detail">{{ totalDetailLabel }}</span>
      </div>
    </header>

    <section class="user-billing__section">
      <div class="user-billing__section-head">
        <h3>{{ $t("billing.account.your_organizations") }}</h3>
        <Button
          class="no-shrink"
          variant="secondary"
          size="sm"
          icon="plus"
          @click="createBusinessOrganization">
          {{ $t("billing.account.create_business_org") }}
        </Button>
      </div>

      <Loading v-if="loading" block />
      <template v-else>
        <div class="user-billing__orgs">
          <OrgBillingCard
            v-for="org in orgViewModels"
            :key="org.id"
            :org="org"
            :open="org.id === currentOrganizationScope" />
        </div>

        <div v-if="!hasPaidOrg" class="user-billing__upsell">
          <div class="user-billing__upsell-text">
            <strong>{{ $t("billing.account.need_more_minutes") }}</strong>
            <p>{{ $t("billing.account.upsell_hint") }}</p>
          </div>
          <div class="user-billing__upsell-actions">
            <Button
              variant="secondary"
              icon="buildings"
              @click="createBusinessOrganization">
              {{ $t("billing.account.create_business_org") }}
            </Button>
            <Button
              variant="primary"
              icon="sparkle"
              @click="openUpgradeModal(null)">
              {{ $t("billing.account.upgrade_premium") }}
            </Button>
          </div>
        </div>
      </template>
    </section>

    <section class="user-billing__section">
      <div class="user-billing__section-head">
        <h3>{{ $t("billing.account.billing_history") }}</h3>
        <p v-if="paymentMethodLabel" class="user-billing__payment-method">
          {{
            $t("billing.account.payment_method", {
              method: paymentMethodLabel,
            })
          }}
          ·
          <button
            type="button"
            class="user-billing__payment-method-edit"
            @click="editPaymentMethod">
            {{ $t("billing.account.payment_method_edit") }}
          </button>
        </p>
      </div>

      <table v-if="invoiceHistory.length" class="user-billing__table">
        <thead>
          <tr>
            <th>{{ $t("billing.account.table_date") }}</th>
            <th>{{ $t("billing.account.table_organization") }}</th>
            <th>{{ $t("billing.account.table_amount") }}</th>
            <th>{{ $t("billing.account.table_invoice") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoiceHistory" :key="invoice.id">
            <td>
              <time :datetime="invoice.date">{{
                formatInvoiceDate(invoice.date)
              }}</time>
            </td>
            <td>{{ invoice.organizationName }}</td>
            <td>{{ formatCurrencyAmount(invoice.amountCents) }}</td>
            <td>
              <button
                type="button"
                class="user-billing__invoice-link"
                @click="downloadInvoice">
                PDF
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="user-billing__empty">
        {{ $t("billing.account.no_invoice") }}
      </p>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { bus } from "@/main.js"
import { apiGetUsage, apiGetSubscriptions } from "@/api/cloud"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { computeQuotaMeters } from "@/tools/billingMeters"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import OrgBillingCard from "@/components-cloud/OrgBillingCard.vue"

// No invoice-history endpoint yet either.
const MOCK_INVOICE_DATE = "2026-09-01"
// No Stripe Customer Portal wiring yet.
const MOCK_PAYMENT_METHOD = "Visa •••• 4242"

export default {
  name: "UserSettingsBilling",
  components: { OrgBillingCard },
  data() {
    return {
      loading: true,
      orgsBilling: {},
    }
  },
  computed: {
    ...mapGetters("organizations", {
      userOrganizations: "getOrganizationsWithUserContext",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    ...mapGetters("billing", ["plans"]),
    orgViewModels() {
      return this.userOrganizations.map((org) => this.computeOrgViewModel(org))
    },
    paidOrgs() {
      return this.orgViewModels.filter((org) => org.isPaid)
    },
    hasPaidOrg() {
      return this.paidOrgs.length > 0
    },
    totalMonthlyCents() {
      return this.orgViewModels.reduce(
        (sum, org) => sum + (org.priceCents || 0),
        0,
      )
    },
    totalMonthlyLabel() {
      return this.formatCurrencyAmount(this.totalMonthlyCents)
    },
    totalDetailLabel() {
      const count = this.orgViewModels.length
      if (!this.hasPaidOrg) {
        return this.$tc("billing.account.summary_free", count, { n: count })
      }
      const date = this.nextChargeDateLabel
      return date
        ? this.$tc("billing.account.summary_paid", count, { n: count, date })
        : this.$tc("billing.account.summary_free", count, { n: count })
    },
    nextChargeDateLabel() {
      const dates = this.paidOrgs
        .map((org) => org.renewalAt)
        .filter(Boolean)
        .sort()
      return dates.length ? this.formatFullDate(dates[0]) : null
    },
    paymentMethodLabel() {
      return this.hasPaidOrg ? MOCK_PAYMENT_METHOD : null
    },
    invoiceHistory() {
      // Reuses the real per-org price so the amounts shown stay consistent
      // with the cards above; only the invoice date/id are placeholders.
      return this.paidOrgs.map((org) => ({
        id: org.id,
        date: MOCK_INVOICE_DATE,
        organizationName: org.name,
        amountCents: org.priceCents,
      }))
    },
  },
  async mounted() {
    await this.$store.dispatch("billing/fetchPlans")
    await this.loadOrgsBilling()
  },
  methods: {
    ...mapActions("billing", ["openUpgradeModal"]),
    async loadOrgsBilling() {
      this.loading = true
      const entries = await Promise.all(
        this.userOrganizations.map(async (org) => {
          const usage = await apiGetUsage(org._id)
          let subscription = null
          // Subscription detail (price, renewal date) is admin-guarded
          // server-side; skip the call for orgs where the user isn't admin.
          if (org.role >= ORGANIZATION_ROLES.ADMINISTRATOR) {
            const subs = await apiGetSubscriptions(org._id)
            subscription = Array.isArray(subs)
              ? subs.find((s) =>
                  ["active", "trialing", "past_due"].includes(s.status),
                )
              : null
          }
          return [org._id, { usage, subscription }]
        }),
      )
      this.orgsBilling = Object.fromEntries(entries)
      this.loading = false
    },
    computeOrgViewModel(org) {
      const billing = this.orgsBilling[org._id] || {}
      const usage = billing.usage || null
      const subscription = billing.subscription || null
      const planKey = usage?.planKey || "free_payg"
      const plan = this.plans.find((p) => p.planKey === planKey) || null
      const isFree = planKey === "free_payg"
      const isPerSeat = plan?.pricing?.perSeat === true
      const seats = usage?.seats || 1

      const meters = computeQuotaMeters(usage?.capabilities)
      const findMeter = (key) => meters.find((m) => m.key === key) || null
      const offline = findMeter("import.minutes")
      const aiSummary = findMeter("ai.generations")
      const chat = findMeter("ai.chat")
      const displayMeters = [
        offline && { ...offline, labelKey: "billing.account.meter.offline" },
        aiSummary && {
          ...aiSummary,
          labelKey: "billing.account.meter.ai_summary",
        },
        chat && { ...chat, labelKey: "billing.account.meter.chat" },
      ].filter(Boolean)
      const resetAt =
        offline?.resetAt || aiSummary?.resetAt || chat?.resetAt || null

      const priceCents = plan?.pricing?.amountCents
        ? plan.pricing.amountCents * (isPerSeat ? seats : 1)
        : 0

      const members = org.users || []
      const seatsCount = members.filter(
        (u) => u.role >= ORGANIZATION_ROLES.UPLOADER,
      ).length
      const isOrgAdmin = org.role >= ORGANIZATION_ROLES.ADMINISTRATOR

      let subtitleLabel
      if (org.personal) {
        subtitleLabel = this.$tc(
          "billing.account.personal_org_subtitle",
          members.length,
          { n: members.length },
        )
      } else if (isPerSeat) {
        subtitleLabel = this.$tc("billing.account.seats_subtitle", seatsCount, {
          n: seatsCount,
        })
      } else {
        subtitleLabel = this.$tc(
          "billing.account.members_subtitle",
          members.length,
          { n: members.length },
        )
      }

      return {
        id: org._id,
        name: org.displayName,
        icon: org.icon,
        isFree,
        isPaid: !isFree,
        planLabel: plan?.displayName || this.$t("billing.page.free_plan"),
        subtitleLabel,
        priceCents,
        priceLabel: this.formatCurrencyAmount(priceCents),
        priceSubLabel: isFree
          ? null
          : isPerSeat
            ? this.$t("billing.account.price_per_seat_detail", {
                seats,
                unitPrice: this.formatCurrencyAmount(plan.pricing.amountCents),
              })
            : this.$t("billing.account.price_per_month"),
        meters: displayMeters,
        liveCredit: usage?.live
          ? this.computeLiveCredit(usage.live, isOrgAdmin)
          : null,
        resetDateLabel: resetAt ? this.formatFullDate(resetAt) : null,
        renewalAt: subscription?.currentPeriodEnd || null,
        renewalLabel: this.computeRenewalLabel(subscription, isPerSeat, seats),
        showMemberConsumptionLink: isPerSeat,
      }
    },
    // usage.live is an org-wide prepaid credit balance (not a per-seat,
    // per-period quota), so it's kept as its own view model rather than
    // folded into the used/limit meters above.
    computeLiveCredit(live, isOrgAdmin) {
      return {
        balance: live.balance,
        expiresAtLabel: live.expiresAt
          ? this.formatFullDate(live.expiresAt)
          : null,
        lowBalance: live.lowBalance,
        unmetered: live.unmetered,
        admissionMinutes: live.admissionMinutes,
        overdraftMinutes: live.overdraftMinutes,
        purchasable: live.purchasable,
        isOrgAdmin,
      }
    },
    computeRenewalLabel(subscription, isPerSeat, seats) {
      if (!subscription?.currentPeriodEnd) return null
      const date = this.formatFullDate(subscription.currentPeriodEnd)
      return isPerSeat
        ? this.$tc("billing.account.renews_seats", seats, { date, n: seats })
        : this.$t("billing.account.renews", { date })
    },
    formatFullDate(iso) {
      try {
        return new Intl.DateTimeFormat(this.$i18n.locale || "fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(iso))
      } catch {
        return ""
      }
    },
    formatInvoiceDate(iso) {
      try {
        return new Intl.DateTimeFormat(this.$i18n.locale || "fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(iso))
      } catch {
        return ""
      }
    },
    formatCurrencyAmount(amountCents) {
      return formatCurrencyAmount(amountCents, "eur", this.$i18n.locale)
    },
    createBusinessOrganization() {
      // TODO: wire to organization creation with the Business plan preselected.
    },
    editPaymentMethod() {
      // Payment method management goes through the Stripe Customer Portal,
      // not shipped yet.
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.page.portal_soon"),
        timeout: 4000,
      })
    },
    downloadInvoice() {
      // Same limitation: invoice PDFs come from the Stripe Customer Portal.
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.page.portal_soon"),
        timeout: 4000,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.user-billing {
  display: flex;
  flex-direction: column;
  gap: 1.5em;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1em;
  }

  &__title {
    margin: 0 0 0.25em;
  }

  &__subtitle {
    margin: 0;
    color: var(--text-secondary);
  }

  &__total {
    flex-shrink: 0;
    min-width: 220px;
    padding: 0.75em 1em;
    border-radius: 8px;
    border: 1px solid var(--neutral-20);
    background: var(--neutral-10);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;

    &--paid {
      border-color: var(--success-color);
      background: var(--success-soft);
    }
  }

  &__total-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--text-secondary);
  }

  &__total-amount {
    font-size: 1.4rem;
    font-weight: 700;
  }

  &__total-detail {
    font-size: 0.78rem;
    color: var(--text-secondary);
  }

  &__section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    margin-bottom: 0.75em;

    h3 {
      margin: 0;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: var(--text-secondary);
    }
  }

  &__orgs {
    display: flex;
    flex-direction: column;
  }

  &__upsell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    margin-top: 1em;
    padding: 1em;
    border: 1px solid var(--success-color);
    border-radius: 8px;
    background: var(--success-soft);
    flex-wrap: wrap;
  }

  &__upsell-text p {
    margin: 0.25em 0 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  &__upsell-actions {
    display: flex;
    gap: 0.75em;
    flex-wrap: wrap;
  }

  &__payment-method {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  &__payment-method-edit,
  &__invoice-link {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--primary-color);
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th,
    td {
      text-align: left;
      padding: 0.6em 0.75em;
      border-bottom: 1px solid var(--neutral-20);
    }

    th {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.78rem;
      text-transform: uppercase;
    }

    td:nth-child(3),
    th:nth-child(3) {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    td:nth-child(4),
    th:nth-child(4) {
      text-align: right;
    }
  }

  &__empty {
    padding: 1em;
    border: 1px dashed var(--neutral-30);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 0.88rem;
    text-align: center;
  }
}
</style>
