<template>
  <div class="organization-billing flex col gap-medium">
    <header class="flex align-center gap-small wrap">
      <h2 class="organization-billing__title">
        {{ $t("app_settings_modal.billing") }}
      </h2>
      <Chip v-if="!loading" :value="planName" :primary="!view.isFree" />
      <div
        v-if="!loading && !usageFailed"
        class="organization-billing__plan-actions flex gap-small wrap">
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
    </header>

    <Loading v-if="loading" block />
    <template v-else>
      <!-- A cancelled subscription is an alert: it stays on top, where the
           next invoice it replaces is not -->
      <p
        v-if="!upcomingInvoice && subscriptionEndsAt"
        class="organization-billing__notice flex align-center gap-small">
        <PhIcon name="calendar-x" />
        <time :datetime="subscriptionEndsAt">{{
          $t("billing.settings.upcoming.ends_on", {
            date: formatFullDate(subscriptionEndsAt, $i18n.locale),
          })
        }}</time>
      </p>

      <section class="organization-billing__section flex col gap-small">
        <SectionHeading
          :title="$t('billing.settings.balances.title')"
          :subtitle="balancesSubtitle" />
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
          <div class="organization-billing__balances">
            <BalanceCard
              v-for="balance in balances"
              :key="balance.key"
              :balance="balance"
              :title="$t(BALANCE_LOOKS[balance.key].titleKey)"
              :icon="BALANCE_LOOKS[balance.key].icon"
              :planName="offerName">
              <AiCreditCosts
                v-if="balance.key === 'ai' && balance.costs"
                :costs="balance.costs" />
              <LiveBalanceHelp
                v-else-if="balance.key === 'live' && !balance.isUnlimited"
                :available="balance.available"
                :offer="liveOffer"
                @buy="openPackPurchase('live')" />
              <PackOfferShortcut
                v-else-if="
                  balance.key === 'transcription' &&
                  !balance.isUnlimited &&
                  hasTranscriptionShortcut
                "
                :offer="transcriptionOffer"
                @select="openPackPurchase" />
            </BalanceCard>
          </div>
          <router-link
            v-if="view.isPerSeat"
            :to="memberConsumptionRoute"
            class="organization-billing__link">
            {{ $t("billing.settings.usage.member_consumption_link") }}
          </router-link>
        </template>
      </section>

      <section
        v-if="!usageFailed && !view.isUnmetered"
        class="organization-billing__section flex col gap-small">
        <SectionHeading
          :title="$t('billing.settings.lots.title')"
          :subtitle="packsSubtitle">
          <template #actions>
            <Button
              variant="secondary"
              size="sm"
              icon="plus"
              :disabled="!canBuyPack"
              @click="openPackPurchase()">
              {{ $t("billing.settings.buy_pack") }}
            </Button>
          </template>
        </SectionHeading>
        <p
          v-if="!view.isLocked && !canBuyPack"
          class="organization-billing__muted">
          {{ $t("billing.settings.no_pack_available") }}
        </p>
        <HorizontalScroller
          v-if="packLots.length"
          tag="ul"
          class="organization-billing__lot-list"
          :label="$t('billing.settings.lots.title')">
          <li v-for="lot in packLots" :key="lot.id">
            <PackLot :lot="lot" />
          </li>
        </HorizontalScroller>
        <p v-else class="organization-billing__empty">
          {{ $t("billing.settings.lots.empty") }}
        </p>
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
          v-if="upcomingInvoice"
          class="organization-billing__section flex col gap-small">
          <SectionHeading :title="$t('billing.settings.upcoming.title')" />
          <UpcomingInvoiceSummary :invoice="upcomingInvoice" />
        </section>

        <section
          v-if="showPaymentSection"
          class="organization-billing__section flex col gap-small">
          <SectionHeading :title="$t('billing.settings.payment.title')" />
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
          <SectionHeading :title="$t('billing.settings.invoices.title')" />
          <InvoiceTable v-if="invoices.length" :invoices="invoices" />
          <p v-else class="organization-billing__empty">
            {{ $t("billing.settings.invoices.empty") }}
          </p>
        </section>
      </template>
    </template>

    <PackPurchaseModal
      v-model="isPackPurchaseOpen"
      :kind="packPurchaseKind"
      :returnUrl="packPurchaseReturnUrl" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"
import {
  apiCreatePortalSession,
  apiGetBillingOverview,
  apiGetCredits,
} from "@/api/cloud"
import { SETTINGS_QUERY_PARAM } from "@/const/settingsQueryParam"
import { computeAvailableBalances } from "@/tools/computeAvailableBalances"
import { computeBillingReturnUrl } from "@/tools/computeBillingReturnUrl"
import { computeOrganizationBillingView } from "@/tools/computeOrganizationBillingView"
import { computePackKindOffers } from "@/tools/computePackKindOffers"
import { computePackLots } from "@/tools/computePackLots"
import { computePaymentMethodSummary } from "@/tools/computePaymentMethodSummary"
import { formatFullDate } from "@/tools/formatFullDate"
import { formatPackValidity } from "@/tools/formatPackValidity"
import AiCreditCosts from "@/components-cloud/AiCreditCosts.vue"
import BalanceCard from "@/components-cloud/BalanceCard.vue"
import InvoiceTable from "@/components-cloud/InvoiceTable.vue"
import HorizontalScroller from "@/components/molecules/HorizontalScroller.vue"
import LiveBalanceHelp from "@/components-cloud/LiveBalanceHelp.vue"
import SectionHeading from "@/components/molecules/SectionHeading.vue"
import PackLot from "@/components-cloud/PackLot.vue"
import PackOfferShortcut from "@/components-cloud/PackOfferShortcut.vue"
import PackPurchaseModal from "@/components-cloud/PackPurchaseModal.vue"
import UpcomingInvoiceSummary from "@/components-cloud/UpcomingInvoiceSummary.vue"

// Title and icon of each balance of computeAvailableBalances
const BALANCE_LOOKS = {
  transcription: {
    titleKey: "billing.settings.meter.import",
    icon: "file-audio",
  },
  live: { titleKey: "billing.settings.meter.live", icon: "microphone" },
  ai: { titleKey: "billing.settings.meter.ai", icon: "sparkle" },
}

// Billing of the current organization (org admins only): what is left to
// use and the packs, then what is paid, as Stripe knows it (next invoice,
// payment method, invoices). Every Stripe page opened from here comes back
// to this tab.
export default {
  name: "OrganizationSettingsBilling",
  components: {
    AiCreditCosts,
    BalanceCard,
    InvoiceTable,
    HorizontalScroller,
    LiveBalanceHelp,
    SectionHeading,
    PackLot,
    PackOfferShortcut,
    PackPurchaseModal,
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
      creditLots: [],
      isPackPurchaseOpen: false,
      // Kind of pack offered by the purchase modal, every kind when null
      packPurchaseKind: null,
      packPurchaseReturnUrl: null,
      BALANCE_LOOKS,
      // portal | payment_method: the Stripe page being opened
      pendingRedirect: null,
    }
  },
  computed: {
    ...mapGetters("billing", [
      "usage",
      "subscription",
      "plans",
      "packs",
      "purchasablePacks",
    ]),
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
      if (this.view.isUnmetered)
        return this.$t(`billing.mode.${this.view.mode}`)
      return (
        this.view.plan?.displayName || this.$t("billing.settings.free_plan")
      )
    },
    // The plan itself, for the balance lines: a comp or managed org still
    // has one ("Business plan · Unlimited")
    offerName() {
      return (
        this.view.plan?.displayName || this.$t("billing.settings.free_plan")
      )
    },
    packLots() {
      return computePackLots(this.creditLots, {
        consumedKinds: this.consumedLotKinds,
      })
    },
    // Kinds of lots the plan draws on: a file pack bought on Free is left
    // untouched by Premium
    consumedLotKinds() {
      return this.balances
        .filter((balance) => balance.consumesLots)
        .map((balance) => balance.lotKind)
    },
    // A locked team org can't use any quota, bought minutes included
    canBuyPack() {
      return !this.view.isLocked && this.purchasablePacks.length > 0
    },
    // A subscription cancelled at period end has no next invoice: its end
    // date is shown on top instead, as an alert.
    subscriptionEndsAt() {
      return this.view.cancelsAtPeriodEnd ? this.view.renewalAt : null
    },
    balances() {
      return computeAvailableBalances({
        usage: this.usage,
        lots: this.creditLots,
      })
    },
    balancesSubtitle() {
      if (this.view.isUnmetered) return null
      return this.$t("billing.settings.balances.subtitle")
    },
    packsSubtitle() {
      const validity = formatPackValidity(this.packs, this.$i18n.locale)
      if (!validity) return this.$t("billing.settings.lots.subtitle")
      return this.$t("billing.settings.lots.subtitle_with_validity", {
        validity,
      })
    },
    // A locked team org can't buy anything, so it is offered nothing
    kindOffers() {
      if (!this.canBuyPack) return []
      return computePackKindOffers(this.purchasablePacks)
    },
    liveOffer() {
      return this.findKindOffer("live")
    },
    transcriptionOffer() {
      return this.findKindOffer("transcription")
    },
    // The file pack is offered in its balance until one is in use
    hasTranscriptionShortcut() {
      if (!this.transcriptionOffer) return false
      return !this.packLots.some(
        (lot) => lot.kind === "transcription" && !lot.isExhausted,
      )
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
  },
  mounted() {
    this.loadBilling()
  },
  methods: {
    ...mapActions("billing", [
      "fetchUsage",
      "fetchSubscriptions",
      "fetchPacks",
      "openUpgradeModal",
    ]),
    formatFullDate,
    async loadBilling() {
      this.loading = true
      const [usage, subscriptions, overview, packs, hasLots] =
        await Promise.all([
          this.fetchUsage(this.organizationId),
          this.fetchSubscriptions(this.organizationId),
          apiGetBillingOverview(this.organizationId),
          this.fetchPacks(),
          this.loadCreditLots(),
        ])
      // Without the subscription or the pack catalog the plan buttons would
      // silently lie (no "Manage", no pack), without the lots the balances
      // would: shown as a failure to retry.
      this.usageFailed =
        !usage || !Array.isArray(subscriptions) || !packs || !hasLots
      this.overview = overview || null
      this.overviewFailed = !overview
      this.loading = false
    },
    // Whether the lots could be read
    async loadCreditLots() {
      const credits = await apiGetCredits(this.organizationId)
      this.creditLots = credits?.lots || []
      return !!credits
    },
    findKindOffer(kind) {
      return this.kindOffers.find((offer) => offer.kind === kind) || null
    },
    manageSubscription() {
      this.pendingRedirect = "portal"
      return this.openPortal()
    },
    updatePaymentMethod() {
      this.pendingRedirect = "payment_method"
      return this.openPortal("payment_method_update")
    },
    // Every Stripe page opened from here comes back to this tab
    openPackPurchase(kind = null) {
      this.packPurchaseKind = kind
      this.packPurchaseReturnUrl = computeBillingReturnUrl(window.location.href)
      this.isPackPurchaseOpen = true
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

  // Plan actions sit at the end of the title row
  &__plan-actions {
    margin-left: auto;
  }

  // The card sets its own width; the item only passes the row height on
  &__lot-list li {
    display: flex;
  }

  &__section + &__section {
    padding-top: var(--medium-gap);
    border-top: 1px solid var(--neutral-20);
  }

  // Cards of a row share their height, their footers aligned at the bottom
  &__balances {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: var(--medium-gap);
  }

  &__notice,
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
