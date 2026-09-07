<template>
  <IsCloud>
    <BareModal
      v-if="needsOnboarding"
      v-model="isOpen"
      size="xl"
      :aria-label="$t('onboarding.welcome_title')"
      :overlay-close="false"
      :cancel-on-escape="false">
      <div class="onboarding">
        <div class="onboarding__intro">
          <p class="onboarding__kicker">{{ $t("onboarding.kicker") }}</p>
          <h1 class="onboarding__title">{{ $t("onboarding.title") }}</h1>
          <p class="onboarding__subtitle">{{ $t("onboarding.subtitle") }}</p>

          <SegmentedControl
            class="onboarding__period"
            v-model="billingPeriod"
            :options="periodOptions"
            :aria-label="$t('onboarding.billing_period.label')" />
        </div>

        <Loading v-if="plansLoading" block />
        <template v-else>
          <div class="onboarding__plans">
            <PlanCard
              v-for="plan in displayPlans"
              :key="plan.key"
              :icon="plan.icon"
              :name="plan.name"
              :tagline="plan.tagline"
              :badge="plan.badge"
              :price-label="plan.priceLabel"
              :price-suffix="plan.priceSuffix"
              :price-note="plan.priceNote"
              :features="plan.features"
              radio-name="onboarding-plan"
              :radio-value="plan.key"
              :selected-value="selectedPlan"
              @select="selectedPlan = $event" />
          </div>
          <p class="onboarding__fair-use-note">
            {{ $t("onboarding.fair_use_note") }}
          </p>
        </template>

        <footer class="onboarding__footer">
          <p class="onboarding__payment-note">
            <ph-icon name="info" size="sm" />
            <span>{{ $t("onboarding.payment_note") }}</span>
          </p>
          <Button
            variant="primary"
            icon-right="arrow-right"
            :disabled="plansLoading"
            @click="confirmPlan">
            {{ $t("onboarding.continue", { plan: selectedPlanName }) }}
          </Button>
        </footer>
      </div>
    </BareModal>
  </IsCloud>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
import IsCloud from "@/components/atoms/IsCloud.vue"
import BareModal from "@/components/molecules/BareModal.vue"
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"
import PlanCard from "@/components/molecules/PlanCard.vue"
import { computeQuotaMonthlyEquivalent } from "@/tools/computeQuotaMonthlyEquivalent"
import { computeTranscriptionQuotaLabel } from "@/tools/computeTranscriptionQuotaLabel"
import { computeAnnualPriceInfo } from "@/tools/computeAnnualPriceInfo"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
// Button and Loading are registered globally by the atoms plugin (components/atoms/index.js).

// Plan catalog keys (linto-studio-cloud-service/src/plans/catalog.js), in
// display order. "free_payg" is the engine's historical slug for Free.
const PLAN_ORDER = ["free_payg", "premium", "business"]
const PLAN_ICON = { free_payg: "prohibit", premium: "sparkle", business: "users" }
const PLAN_LOCALE_KEY = { free_payg: "free", premium: "premium", business: "business" }

export default {
  name: "OnboardingWizard",
  components: { IsCloud, BareModal, SegmentedControl, PlanCard },
  data() {
    return {
      billingPeriod: "monthly",
      selectedPlan: "premium",
      plansLoading: true,
      // BareModal's own open state (v-model). needsOnboarding (server) still
      // gates whether the wizard mounts at all; this only lets confirmPlan()
      // close it locally for the free plan, without touching the server flag.
      isOpen: true,
    }
  },
  computed: {
    ...mapGetters("user", ["needsOnboarding"]),
    ...mapGetters("billing", ["plans"]),
    periodOptions() {
      return [
        {
          name: "monthly",
          label: this.$t("onboarding.billing_period.monthly"),
        },
        { name: "annual", label: this.$t("onboarding.billing_period.annual") },
      ]
    },
    // Display-ready plans: real pricing and quotas from the catalog API,
    // marketing copy (tagline, static feature lines) from local i18n.
    displayPlans() {
      return PLAN_ORDER.map((key) =>
        this.buildPlanDisplay(this.plans.find((p) => p.planKey === key)),
      ).filter(Boolean)
    },
    selectedPlanName() {
      return this.displayPlans.find((plan) => plan.key === this.selectedPlan)
        ?.name
    },
    // "free_payg" is the catalog's historical slug for Free (see
    // store/billing/getters.js isFree, same convention reused here).
    isFreePlanSelected() {
      return this.selectedPlan === "free_payg"
    },
  },
  watch: {
    // Fetch the catalog once, the first time the wizard is actually shown.
    needsOnboarding: {
      immediate: true,
      handler(value) {
        if (value) this.loadPlans()
      },
    },
  },
  methods: {
    ...mapActions("billing", ["fetchPlans"]),
    async loadPlans() {
      // The catalog may already be cached in store (e.g. the billing settings
      // page was visited earlier this session) — nothing to fetch then.
      if (this.plans.length) {
        this.plansLoading = false
        return
      }
      if (!this.plansLoading) return
      await this.fetchPlans()
      this.plansLoading = false
    },
    buildPlanDisplay(plan) {
      if (!plan) return null
      return {
        key: plan.planKey,
        icon: PLAN_ICON[plan.planKey] || "circle",
        name: plan.displayName,
        tagline: this.$t(
          `onboarding.plans.${PLAN_LOCALE_KEY[plan.planKey]}.tagline`,
        ),
        badge: plan.planKey === "premium" ? this.$t("onboarding.most_popular") : "",
        ...this.buildPriceDisplay(plan),
        features: this.buildFeatures(plan),
      }
    },
    formatPrice(amountCents, currency) {
      return formatCurrencyAmount(
        amountCents,
        currency,
        this.$i18n?.locale || "fr-FR",
      )
    },
    buildPriceDisplay(plan) {
      const { pricing } = plan
      if (pricing.model === "free") {
        return {
          priceLabel: this.formatPrice(0, pricing.currency),
          priceSuffix: "",
          priceNote: this.$t("onboarding.price_note_free"),
        }
      }
      const annual = computeAnnualPriceInfo(
        pricing.amountCents,
        pricing.amountCentsYearly,
      )
      if (this.billingPeriod === "annual" && annual) {
        return {
          priceLabel: this.formatPrice(annual.monthlyEquivalentCents, pricing.currency),
          priceSuffix: this.$t(
            pricing.perSeat
              ? "onboarding.price_suffix_per_seat_annual"
              : "onboarding.price_suffix_annual",
          ),
          priceNote: this.buildAnnualPriceNote(plan, annual),
        }
      }
      return {
        priceLabel: this.formatPrice(pricing.amountCents, pricing.currency),
        priceSuffix: this.$t(
          pricing.perSeat
            ? "onboarding.price_suffix_per_seat"
            : "onboarding.price_suffix_monthly",
        ),
        priceNote: this.buildMonthlyPriceNote(plan, annual),
      }
    },
    buildMonthlyPriceNote(plan, annual) {
      const notes = []
      if (annual) {
        notes.push(
          this.$t("onboarding.price_note_annual_hint", {
            price: this.formatPrice(plan.pricing.amountCentsYearly, plan.pricing.currency),
            freeMonths: annual.freeMonths,
          }),
        )
      }
      if (plan.pricing.perSeat) {
        notes.push(
          this.$t("onboarding.price_note_seats_minimum", {
            seats: plan.pricing.seatsIncluded,
          }),
        )
      }
      return notes.join(" · ")
    },
    buildAnnualPriceNote(plan, annual) {
      const notes = [
        this.$t("onboarding.price_note_billed_yearly", {
          price: this.formatPrice(plan.pricing.amountCentsYearly, plan.pricing.currency),
          freeMonths: annual.freeMonths,
        }),
      ]
      if (plan.pricing.perSeat) {
        notes.push(
          this.$t("onboarding.price_note_seats_minimum", {
            seats: plan.pricing.seatsIncluded,
          }),
        )
      }
      return notes.join(" · ")
    },
    buildFeatures(plan) {
      const isFree = plan.pricing.model === "free"
      const perSeat = plan.pricing.perSeat
      const features = [
        ...this.buildUsageFeatures(plan, isFree, perSeat),
        this.buildApiFeature(plan, isFree),
        this.buildLiveFeature(plan),
      ]
      if (plan.entitlements.collaboration?.value) {
        features.push({ text: this.$t("onboarding.features.invitations") })
      }
      if (plan.entitlements["organization.create"]?.value) {
        features.push({ text: this.$t("onboarding.features.multi_orga") })
      }
      features.push({ text: this.$t("onboarding.features.editor_suite") })
      return features
    },
    // Transcription, résumés and chat fold into a single "illimité*" line once
    // every one of them is unlimited (Business); otherwise transcription gets
    // its own line (it may still show an hour count, e.g. Premium).
    buildUsageFeatures(plan, isFree, perSeat) {
      const transcription = this.computeTranscriptionInfo(plan)
      if (!isFree && transcription.unlimited) {
        return [
          {
            text: this.$t(
              perSeat
                ? "onboarding.features.usage_all_unlimited_per_seat"
                : "onboarding.features.usage_all_unlimited",
            ),
          },
        ]
      }
      return [
        this.buildTranscriptionFeature(transcription, isFree, perSeat),
        this.buildAiAndChatFeature(plan, isFree, perSeat),
      ]
    },
    computeTranscriptionInfo(plan) {
      const rule = plan.entitlements["import.minutes"]
      const monthly = computeQuotaMonthlyEquivalent(rule.limit, rule.period)
      return computeTranscriptionQuotaLabel(monthly)
    },
    buildTranscriptionFeature({ unlimited, hours }, isFree, perSeat) {
      if (!isFree && unlimited) {
        return {
          text: this.$t(
            perSeat
              ? "onboarding.features.transcription_unlimited_per_seat"
              : "onboarding.features.transcription_unlimited",
          ),
        }
      }
      return {
        text: this.$t(
          perSeat
            ? "onboarding.features.transcription_hours_per_seat"
            : "onboarding.features.transcription_hours",
          { hours },
        ),
      }
    },
    buildAiAndChatFeature(plan, isFree, perSeat) {
      if (!isFree) {
        return {
          text: this.$t(
            perSeat
              ? "onboarding.features.ai_and_chat_unlimited_per_seat"
              : "onboarding.features.ai_and_chat_unlimited",
          ),
        }
      }
      const generations = computeQuotaMonthlyEquivalent(
        plan.entitlements["ai.generations"].limit,
        plan.entitlements["ai.generations"].period,
      )
      const chat = computeQuotaMonthlyEquivalent(
        plan.entitlements["ai.chat"].limit,
        plan.entitlements["ai.chat"].period,
      )
      return {
        text: this.$t("onboarding.features.ai_and_chat_count", {
          generations,
          chat,
        }),
      }
    },
    buildApiFeature(plan, isFree) {
      if (!isFree) {
        return { text: this.$t("onboarding.features.api_calls_unlimited") }
      }
      const count = computeQuotaMonthlyEquivalent(
        plan.entitlements["api.calls"].limit,
        plan.entitlements["api.calls"].period,
      )
      return { text: this.$t("onboarding.features.api_calls_count", { count }) }
    },
    buildLiveFeature(plan) {
      const rule = plan.entitlements["live.minutes"]
      if (rule.purchasable) {
        return { text: this.$t("onboarding.features.live_packs"), icon: "radio" }
      }
      return {
        text: this.$t("onboarding.features.live_welcome", {
          minutes: rule.welcomeMinutes,
        }),
        icon: "gift",
      }
    },
    confirmPlan() {
      if (this.isFreePlanSelected) {
        this.isOpen = false
        return
      }
      // TODO: wire to billing/subscribe (see components-cloud/UpgradeModal.vue)
      // once the onboarding flow decides where the organization it subscribes
      // gets created. Paid plans do nothing yet — subscription + payment land
      // in a later sprint.
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding {
  display: flex;
  flex-direction: column;
}

.onboarding__intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--small-gap);
  text-align: center;
  padding: 2rem 2rem 1.5rem;
}

.onboarding__kicker {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-color);
}

.onboarding__title {
  margin: 0;
  font-size: 1.75rem;
}

.onboarding__subtitle {
  margin: 0;
  max-width: 640px;
  color: var(--text-secondary);
}

.onboarding__period {
  margin-top: var(--small-gap);
}

.onboarding__plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--medium-gap);
  // The badge on the featured card floats above the card border: leave it
  // room so it doesn't get clipped by the grid row above.
  margin-top: 0.75rem;
  padding: 0 2rem 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.onboarding__fair-use-note {
  margin: -0.5rem 0 1rem;
  padding: 0 2rem;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.onboarding__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--medium-gap);
  padding: 1rem 2rem;
  border-top: 1px solid var(--neutral-20);
  background: var(--neutral-10);
  border-radius: 0 0 10px 10px;
}

.onboarding__payment-note {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
