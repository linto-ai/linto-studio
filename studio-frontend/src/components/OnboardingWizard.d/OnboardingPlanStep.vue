<template>
  <div class="onboarding-plan">
    <div class="onboarding-plan__intro">
      <p v-if="needsOnboarding" class="onboarding-plan__kicker">
        {{ $t("onboarding.kicker") }}
      </p>
      <h1 class="onboarding-plan__title">{{ titleText }}</h1>
      <p v-if="subtitle" class="onboarding-plan__subtitle">{{ subtitle }}</p>
      <p v-if="contextMessage" class="onboarding-plan__context">
        {{ contextMessage }}
      </p>

      <SegmentedControl
        class="onboarding-plan__period"
        :value="billingPeriod"
        :options="periodOptions"
        :aria-label="$t('onboarding.billing_period.label')"
        @input="$emit('change-period', $event)" />
    </div>

    <div class="onboarding-plan__plans">
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
        @select="$emit('select-plan', $event)" />
    </div>
    <p class="onboarding-plan__fair-use-note">
      {{ $t("onboarding.fair_use_note") }}
    </p>

    <footer class="onboarding-plan__footer">
      <p class="onboarding-plan__payment-note">
        <ph-icon name="info" size="sm" />
        <span>{{ $t("onboarding.payment_note") }}</span>
      </p>
      <p v-if="error" class="onboarding-plan__error" role="alert">
        {{ error }}
      </p>
      <div class="onboarding-plan__actions">
        <Button
          v-if="!needsOnboarding"
          variant="secondary"
          :disabled="loading"
          @click="$emit('cancel')">
          {{ $t("billing.cancel") }}
        </Button>
        <Button
          variant="primary"
          icon-right="arrow-right"
          :loading="loading"
          :disabled="loading"
          @click="$emit('confirm')">
          {{ $t("onboarding.continue", { plan: selectedPlanName }) }}
        </Button>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"
import PlanCard from "@/components/molecules/PlanCard.vue"
import { computeQuotaMonthlyEquivalent } from "@/tools/computeQuotaMonthlyEquivalent"
import { computeTranscriptionQuotaLabel } from "@/tools/computeTranscriptionQuotaLabel"
import { computeAnnualPriceInfo } from "@/tools/computeAnnualPriceInfo"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"

// Plan catalog keys (linto-studio-cloud-service/src/plans/catalog.js), in
// display order. "free_payg" is the engine's historical slug for Free.
const PLAN_ORDER = ["free_payg", "premium", "business"]
const PLAN_ICON = {
  free_payg: "prohibit",
  premium: "sparkle",
  business: "users",
}
const PLAN_LOCALE_KEY = {
  free_payg: "free",
  premium: "premium",
  business: "business",
}

export default {
  name: "OnboardingPlanStep",
  components: { SegmentedControl, PlanCard },
  props: {
    title: { type: String, default: null },
    subtitle: { type: String, default: null },
    billingPeriod: { type: String, required: true },
    selectedPlan: { type: String, required: true },
    loading: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  computed: {
    ...mapGetters("user", ["needsOnboarding"]),
    ...mapGetters("billing", ["plans", "upgradeReason"]),
    titleText() {
      return this.title || this.$t("billing.upgrade_title")
    },
    // Why the wizard opened itself for an upgrade (quota exceeded / feature
    // locked), set on store/billing.upgradeReason.
    contextMessage() {
      if (!this.upgradeReason) return ""
      if (this.upgradeReason.capability === "seats") {
        return this.$t("billing.seats_full")
      }
      if (
        this.upgradeReason.reason === "quota_exceeded" ||
        this.upgradeReason.reason === "credit_exhausted"
      ) {
        return this.$t("billing.limit_reached")
      }
      if (this.upgradeReason.reason === "feature_disabled") {
        return this.$t("billing.feature_locked")
      }
      if (this.upgradeReason.reason === "team_plan_required") {
        return this.$t("billing.team_plan_required")
      }
      return ""
    },
    periodOptions() {
      return [
        {
          name: "monthly",
          label: this.$t("onboarding.billing_period.monthly"),
        },
        { name: "annual", label: this.$t("onboarding.billing_period.annual") },
      ]
    },
    // Real pricing and quotas from the catalog API, marketing copy (tagline,
    // static feature lines) from local i18n.
    displayPlans() {
      return PLAN_ORDER.map((key) =>
        this.buildPlanDisplay(this.plans.find((p) => p.planKey === key)),
      ).filter(Boolean)
    },
    selectedPlanName() {
      return this.displayPlans.find((plan) => plan.key === this.selectedPlan)
        ?.name
    },
  },
  methods: {
    buildPlanDisplay(plan) {
      if (!plan) return null
      return {
        key: plan.planKey,
        icon: PLAN_ICON[plan.planKey] || "circle",
        name: plan.displayName,
        tagline: this.$t(
          `onboarding.plans.${PLAN_LOCALE_KEY[plan.planKey]}.tagline`,
        ),
        badge:
          plan.planKey === "premium" ? this.$t("onboarding.most_popular") : "",
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
          priceLabel: this.formatPrice(
            annual.monthlyEquivalentCents,
            pricing.currency,
          ),
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
            price: this.formatPrice(
              plan.pricing.amountCentsYearly,
              plan.pricing.currency,
            ),
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
          price: this.formatPrice(
            plan.pricing.amountCentsYearly,
            plan.pricing.currency,
          ),
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
    // Transcription, summaries and chat fold into a single "unlimited*" line
    // once every one of them is unlimited (Business); otherwise transcription
    // gets its own line (it may still show an hour count, e.g. Premium).
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
        return {
          text: this.$t("onboarding.features.live_packs"),
          icon: "radio",
        }
      }
      return {
        text: this.$t("onboarding.features.live_welcome", {
          minutes: rule.welcomeMinutes,
        }),
        icon: "gift",
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-plan {
  display: flex;
  flex-direction: column;
}

.onboarding-plan__intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--small-gap);
  text-align: center;
  padding: 2rem 2rem 1.5rem;
}

.onboarding-plan__kicker {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-color);
}

.onboarding-plan__title {
  margin: 0;
  font-size: 1.75rem;
}

.onboarding-plan__subtitle {
  margin: 0;
  max-width: 640px;
  color: var(--text-secondary);
}

.onboarding-plan__context {
  margin: 0;
  max-width: 640px;
  color: var(--warning-color);
  font-weight: 600;
}

.onboarding-plan__period {
  margin-top: var(--small-gap);
}

.onboarding-plan__plans {
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

.onboarding-plan__fair-use-note {
  margin: -0.5rem 0 1rem;
  padding: 0 2rem;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.onboarding-plan__footer {
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

.onboarding-plan__payment-note {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* Its own line under the note and the actions, so they never move when it appears */
.onboarding-plan__error {
  margin: 0;
  flex-basis: 100%;
  order: 1;
  font-size: var(--text-sm);
  color: var(--danger-color);
}

.onboarding-plan__actions {
  display: flex;
  align-items: center;
  gap: var(--small-gap);
}
</style>
