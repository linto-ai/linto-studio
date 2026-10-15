<template>
  <form class="flex col" novalidate @submit.prevent="submit">
    <OnboardingCheckoutSteps />

    <div class="onboarding-organization__body flex col gap-medium">
      <header class="flex col gap-tiny">
        <h1 class="onboarding-organization__title">
          {{ $t("onboarding.organization.title") }}
        </h1>
        <p class="onboarding-organization__description">
          {{ $t("onboarding.organization.description") }}
        </p>
      </header>

      <FormInput
        :field="nameField"
        v-model="nameField.value"
        focus
        input-full-width
        @input="nameField.error = null" />

      <OnboardingSeatsPricing
        v-model="seats"
        :plan="plan"
        :billing-period="billingPeriod"
        :min-seats="minSeats" />
    </div>

    <footer
      class="onboarding-organization__footer flex wrap align-center justify-between gap-small">
      <p v-if="error" class="onboarding-organization__error" role="alert">
        {{ error }}
      </p>
      <Button
        v-if="canChangePlan"
        type="button"
        variant="secondary"
        icon="arrow-left"
        :disabled="loading"
        @click="$emit('back', computeDraft())">
        {{ $t("onboarding.organization.back") }}
      </Button>
      <Button
        v-else
        type="button"
        variant="secondary"
        :disabled="loading"
        @click="$emit('cancel')">
        {{ $t("billing.cancel") }}
      </Button>
      <Button
        type="submit"
        variant="primary"
        icon-right="lock"
        :loading="loading"
        :disabled="loading">
        {{ $t("onboarding.organization.submit") }}
      </Button>
    </footer>
  </form>
</template>
<script>
import { formsMixin } from "@/mixins/forms.js"
import EMPTY_FIELD from "@/const/emptyField"
import { testName } from "@/tools/fields/testName"
import FormInput from "@/components/molecules/FormInput.vue"
import OnboardingCheckoutSteps from "./OnboardingCheckoutSteps.vue"
import OnboardingSeatsPricing from "./OnboardingSeatsPricing.vue"

// Limit of POST /cloud/subscriptions (createSchema in linto-studio-cloud-service routes/subscriptions.js)
const MAX_ORGANIZATION_NAME_LENGTH = 200

export default {
  name: "OnboardingOrganizationStep",
  mixins: [formsMixin],
  components: {
    FormInput,
    OnboardingCheckoutSteps,
    OnboardingSeatsPricing,
  },
  props: {
    // Business entry of the plan catalog (pricing.seatsIncluded, amountCents…)
    plan: { type: Object, required: true },
    billingPeriod: { type: String, required: true },
    // { organizationName, seats }
    draft: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    error: { type: String, default: "" },
    // false when the wizard was opened on Business directly: no plan list to
    // go back to, only a way out
    canChangePlan: { type: Boolean, default: true },
  },
  data() {
    return {
      fields: ["nameField"],
      nameField: {
        ...EMPTY_FIELD,
        value: this.draft.organizationName || "",
        label: this.$t("onboarding.organization.name_label"),
        placeholder: this.$t("onboarding.organization.name_placeholder"),
        testField: testName,
        customParams: { maxlength: MAX_ORGANIZATION_NAME_LENGTH },
      },
      // A fresh draft, or one saved before seats existed, starts at the floor
      seats: Math.max(this.draft.seats || 0, this.plan.pricing.seatsIncluded),
    }
  },
  computed: {
    minSeats() {
      return this.plan.pricing.seatsIncluded
    },
  },
  methods: {
    computeDraft() {
      return {
        organizationName: this.nameField.value.trim(),
        seats: this.seats,
      }
    },
    submit() {
      if (!this.testFields()) return
      this.$emit("submit", this.computeDraft())
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-organization__body {
  padding: var(--large-gap);
}

.onboarding-organization__title {
  margin: 0;
  font-size: var(--text-2xl);
}

.onboarding-organization__description {
  margin: 0;
  color: var(--text-secondary);
}

.onboarding-organization__footer {
  padding: var(--medium-gap) var(--large-gap);
  border-top: var(--border-block);
  background: var(--neutral-10);
}

.onboarding-organization__error {
  flex-basis: 100%;
  margin: 0;
  font-size: var(--text-sm);
  color: var(--danger-color);
}
</style>
