<template>
  <div class="organization-billing flex col gap-medium">
    <header class="flex align-center gap-small wrap">
      <h2 class="organization-billing__title">
        {{ $t("app_settings_modal.billing") }}
      </h2>
      <Chip v-if="!loading" :value="planName" :primary="!view.isFree" />
    </header>

    <Loading v-if="loading" block />
    <template v-else>
      <UpcomingInvoiceSummary
        v-if="upcomingInvoice"
        :invoice="upcomingInvoice" />
      <p
        v-else-if="subscriptionEndsAt"
        class="organization-billing__notice flex align-center gap-small">
        <PhIcon name="calendar-x" />
        <time :datetime="subscriptionEndsAt">{{
          $t("billing.settings.upcoming.ends_on", {
            date: formatFullDate(subscriptionEndsAt, $i18n.locale),
          })
        }}</time>
      </p>

      <section class="organization-billing__section flex col gap-small">
        <h3 class="organization-billing__heading">
          {{ $t("billing.settings.usage.title") }}
        </h3>
        <div v-if="usageFailed" class="organization-billing__error">
          <p>{{ $t("billing.settings.usage.load_error") }}</p>
          <Button
            variant="secondary"
            size="sm"
            icon="arrow-clockwise"
            @click="loadBilling">
            {{ $t("billing.settings.retry") }}
          </Button>
        </div>
        <template v-else>
          <p v-if="view.isLocked" class="organization-billing__locked">
            {{ $t("billing.team_plan_required") }}
          </p>
          <div class="organization-billing__tiles">
            <LiveCreditStatus
              v-if="view.liveCredit"
              :balance="view.liveCredit.balance"
              :expires-at-label="liveCreditExpiryLabel"
              :unmetered="view.liveCredit.unmetered" />
            <QuotaMeter
              v-for="meter in view.meters"
              :key="meter.key"
              :label="$t(meter.labelKey)"
              :used="meter.used"
              :limit="meter.limit"
              :unit="meter.unit" />
          </div>
          <p
            v-for="line in periodLines"
            :key="line.labelKey"
            class="organization-billing__period">
            <time :datetime="line.date">{{ line.label }}</time>
          </p>
          <router-link
            v-if="view.isPerSeat"
            :to="memberConsumptionRoute"
            class="organization-billing__link">
            {{ $t("billing.settings.usage.member_consumption_link") }}
          </router-link>
          <div class="flex gap-small wrap">
            <Button
              v-if="!view.isUnmetered"
              variant="secondary"
              size="sm"
              icon="plus"
              :disabled="!canBuyPack"
              :loading="pendingRedirect === 'pack'"
              @click="openPackPicker">
              {{ $t("billing.settings.buy_pack") }}
            </Button>
            <Button
              v-if="view.canUpgradeToPremium"
              variant="primary"
              size="sm"
              icon="sparkle"
              @click="openUpgradeModal()">
              {{ $t("billing.settings.upgrade_premium") }}
            </Button>
            <Button
              v-if="view.canManageSubscription"
              variant="secondary"
              size="sm"
              icon="arrow-square-out"
              :loading="pendingRedirect === 'portal'"
              @click="manageSubscription">
              {{ $t("billing.settings.manage_subscription") }}
            </Button>
          </div>
          <p
            v-if="!view.isUnmetered && !view.isLocked && !canBuyPack"
            class="organization-billing__muted">
            {{ $t("billing.settings.no_pack_available") }}
          </p>
        </template>
      </section>

      <div v-if="overviewFailed" class="organization-billing__error">
        <p>{{ $t("billing.settings.overview_load_error") }}</p>
        <Button
          variant="secondary"
          size="sm"
          icon="arrow-clockwise"
          @click="loadBilling">
          {{ $t("billing.settings.retry") }}
        </Button>
      </div>
      <template v-else>
        <section
          v-if="showPaymentSection"
          class="organization-billing__section flex col gap-small">
          <h3 class="organization-billing__heading">
            {{ $t("billing.settings.payment.title") }}
          </h3>
          <div class="flex align-center justify-between gap-medium wrap">
            <p
              v-if="paymentMethod"
              class="organization-billing__payment-method flex align-center gap-small">
              <PhIcon name="credit-card" />
              <span>{{ paymentMethodLabel }}</span>
              <template v-if="paymentMethod.last4">
                <span aria-hidden="true">••••</span>
                <span>{{ paymentMethod.last4 }}</span>
              </template>
              <span
                v-if="paymentMethod.expiry"
                class="organization-billing__muted">
                {{
                  $t("billing.settings.payment.expires", {
                    expiry: paymentMethod.expiry,
                  })
                }}
              </span>
            </p>
            <p v-else class="organization-billing__muted">
              {{ $t("billing.settings.payment.none") }}
            </p>
            <Button
              variant="secondary"
              size="sm"
              :loading="pendingRedirect === 'payment_method'"
              @click="updatePaymentMethod">
              {{ $t("billing.settings.payment.update") }}
            </Button>
          </div>
        </section>

        <section class="organization-billing__section flex col gap-small">
          <h3 class="organization-billing__heading">
            {{ $t("billing.settings.invoices.title") }}
          </h3>
          <InvoiceTable v-if="invoices.length" :invoices="invoices" />
          <p v-else class="organization-billing__empty">
            {{ $t("billing.settings.invoices.empty") }}
          </p>
        </section>
      </template>
    </template>

    <PackPickerModal
      v-model="isPackPickerOpen"
      :packs="purchasablePacks"
      @submit="buyPack" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"
import {
  apiCreateCreditsCheckout,
  apiCreatePortalSession,
  apiGetBillingOverview,
  apiGetPacks,
} from "@/api/cloud"
import { SETTINGS_QUERY_PARAM } from "@/const/settingsQueryParam"
import { computeBillingReturnUrl } from "@/tools/computeBillingReturnUrl"
import { computeOrganizationBillingView } from "@/tools/computeOrganizationBillingView"
import { computePaymentMethodSummary } from "@/tools/computePaymentMethodSummary"
import { computePurchasablePacks } from "@/tools/computePurchasablePacks"
import { formatFullDate } from "@/tools/formatFullDate"
import LiveCreditStatus from "@/components/molecules/LiveCreditStatus.vue"
import InvoiceTable from "@/components-cloud/InvoiceTable.vue"
import PackPickerModal from "@/components-cloud/PackPickerModal.vue"
import UpcomingInvoiceSummary from "@/components-cloud/UpcomingInvoiceSummary.vue"

// Billing of the current organization (org admins only): usage and packs,
// then what Stripe knows (next invoice, payment method, invoices). Every
// Stripe page opened from here comes back to this tab.
export default {
  name: "OrganizationSettingsBilling",
  components: {
    LiveCreditStatus,
    InvoiceTable,
    PackPickerModal,
    UpcomingInvoiceSummary,
  },
  props: {
    currentOrganization: { type: Object, required: true },
  },
  data() {
    return {
      loading: true,
      usageFailed: false,
      overview: null,
      overviewFailed: false,
      packs: [],
      isPackPickerOpen: false,
      // pack | portal | payment_method: the Stripe page being opened
      pendingRedirect: null,
    }
  },
  computed: {
    ...mapGetters("billing", ["usage", "subscription", "plans"]),
    organizationId() {
      return this.currentOrganization._id
    },
    view() {
      return computeOrganizationBillingView({
        organization: this.currentOrganization,
        usage: this.usage,
        subscription: this.subscription,
        plans: this.plans,
      })
    },
    planName() {
      return (
        this.view.plan?.displayName || this.$t("billing.settings.free_plan")
      )
    },
    purchasablePacks() {
      return computePurchasablePacks(this.packs, this.view.plan)
    },
    // A locked team org can't use any quota, bought minutes included
    canBuyPack() {
      return !this.view.isLocked && this.purchasablePacks.length > 0
    },
    liveCreditExpiryLabel() {
      const expiresAt = this.view.liveCredit?.expiresAt
      return expiresAt ? formatFullDate(expiresAt, this.$i18n.locale) : null
    },
    // A subscription cancelled at period end has no next invoice: its end
    // date takes that place.
    subscriptionEndsAt() {
      return this.view.cancelsAtPeriodEnd ? this.view.renewalAt : null
    },
    // Quotas reset every month while a yearly plan renews once a year: one
    // line per date, merged when they fall on the same day.
    periodLines() {
      const renewal =
        this.view.renewalAt && !this.view.cancelsAtPeriodEnd
          ? this.computePeriod(
              "billing.settings.usage.renews_on",
              this.view.renewalAt,
            )
          : null
      const reset = this.view.quotaResetAt
        ? this.computePeriod(
            "billing.settings.usage.quota_reset_on",
            this.view.quotaResetAt,
          )
        : null
      if (renewal && reset && renewal.dateLabel === reset.dateLabel) {
        return [
          this.computePeriod(
            "billing.settings.usage.renews_and_resets_on",
            this.view.renewalAt,
          ),
        ]
      }
      return [renewal, reset].filter(Boolean)
    },
    // Member usage lives in the Members tab of these settings: the router
    // opens it from the settings query parameter.
    memberConsumptionRoute() {
      return {
        path: this.$route.path,
        query: { ...this.$route.query, [SETTINGS_QUERY_PARAM]: "members" },
      }
    },
    upcomingInvoice() {
      return this.overview?.upcomingInvoice || null
    },
    invoices() {
      return this.overview?.invoices || []
    },
    paymentMethod() {
      return computePaymentMethodSummary(this.overview?.paymentMethod)
    },
    paymentMethodLabel() {
      if (this.paymentMethod.brandLabel) return this.paymentMethod.brandLabel
      const typeKey = `billing.settings.payment.type.${this.paymentMethod.type}`
      return this.$te(typeKey)
        ? this.$t(typeKey)
        : this.$t("billing.settings.payment.type.other")
    },
    // An organization that never paid has nothing to update yet
    showPaymentSection() {
      return !!this.paymentMethod || this.invoices.length > 0
    },
  },
  watch: {
    organizationId() {
      this.loadBilling()
    },
    // Back from a pack Checkout with ?type=credits&status=success|cancel
    "$route.query.status": {
      handler() {
        this.handleCreditsCheckoutReturn()
      },
      immediate: true,
    },
  },
  mounted() {
    this.loadBilling()
  },
  methods: {
    ...mapActions("billing", [
      "fetchUsage",
      "fetchSubscriptions",
      "openUpgradeModal",
    ]),
    formatFullDate,
    async loadBilling() {
      this.loading = true
      const [usage, subscriptions, overview, packs] = await Promise.all([
        this.fetchUsage(this.organizationId),
        this.fetchSubscriptions(this.organizationId),
        apiGetBillingOverview(this.organizationId),
        apiGetPacks(),
      ])
      // Without the subscription or the pack catalog the plan buttons would
      // silently lie (no "Manage", no pack): shown as a failure to retry.
      this.usageFailed = !usage || !Array.isArray(subscriptions) || !packs
      this.overview = overview || null
      this.overviewFailed = !overview
      this.packs = packs || []
      this.loading = false
    },
    computePeriod(labelKey, date) {
      const dateLabel = formatFullDate(date, this.$i18n.locale)
      return {
        labelKey,
        date,
        dateLabel,
        label: this.$t(labelKey, { date: dateLabel }),
      }
    },
    openPackPicker() {
      this.isPackPickerOpen = true
    },
    async buyPack(packKey) {
      this.pendingRedirect = "pack"
      const session = await apiCreateCreditsCheckout(this.organizationId, {
        packKey,
        returnUrl: computeBillingReturnUrl(window.location.href),
      })
      this.redirectToStripe(session)
    },
    manageSubscription() {
      this.pendingRedirect = "portal"
      return this.openPortal()
    },
    updatePaymentMethod() {
      this.pendingRedirect = "payment_method"
      return this.openPortal("payment_method_update")
    },
    async openPortal(flow) {
      const session = await apiCreatePortalSession(this.organizationId, {
        returnUrl: computeBillingReturnUrl(window.location.href),
        flow,
      })
      this.redirectToStripe(session)
    },
    redirectToStripe(session) {
      if (session?.url) {
        window.location.assign(session.url)
        return
      }
      this.pendingRedirect = null
      this.notify("error", this.$t("billing.settings.stripe_error"))
    },
    handleCreditsCheckoutReturn() {
      const { type, status, ...query } = this.$route.query
      if (type !== "credits" || !status) return
      this.$router.replace({ query }).catch(() => {})
      if (status === "success") {
        this.notify("success", this.$t("billing.settings.pack_bought"))
        this.fetchUsage(this.organizationId)
      } else {
        this.notify("info", this.$t("billing.settings.pack_cancelled"))
      }
    },
    notify(status, message) {
      bus.$emit("app_notif", { status, message, timeout: 5000 })
    },
  },
}
</script>

<style lang="scss" scoped>
.organization-billing {
  &__title {
    // Global headings span the whole row: keep the plan chip beside it
    width: auto;
    margin: 0;
  }

  &__heading {
    margin: 0;
    font-size: var(--text-md);
    font-weight: 600;
  }

  &__section + &__section {
    padding-top: var(--medium-gap);
    border-top: 1px solid var(--neutral-20);
  }

  &__tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: var(--small-gap);
  }

  &__notice,
  &__period,
  &__payment-method {
    margin: 0;
  }

  &__notice {
    padding: 0.75em 1em;
    border: 1px solid var(--warning-color);
    border-radius: 4px;
    background: var(--warning-soft);
    color: var(--warning-text);
  }

  &__period,
  &__muted {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  &__link {
    width: fit-content;
    font-size: var(--text-sm);
    color: var(--primary-color);
  }

  &__locked {
    margin: 0;
    color: var(--danger-color);
  }

  &__error,
  &__empty {
    padding: 1em;
    border: 1px dashed var(--neutral-30);
    border-radius: 4px;
    color: var(--text-secondary);
    text-align: center;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--small-gap);

    p {
      margin: 0;
    }
  }

  &__empty {
    margin: 0;
  }
}
</style>
