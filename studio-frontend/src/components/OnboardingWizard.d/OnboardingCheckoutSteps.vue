<template>
  <!-- Hard-coded on the organization step, the only one showing it -->
  <nav
    class="onboarding-checkout-steps"
    :aria-label="$t('onboarding.organization.steps_label')">
    <ol class="flex wrap align-center gap-small">
      <li class="onboarding-checkout-steps__step--done">
        <span class="onboarding-checkout-steps__marker" aria-hidden="true">
          1
        </span>
        {{ $t("onboarding.organization.step_plan") }}
      </li>
      <li aria-current="step">
        <span class="onboarding-checkout-steps__marker" aria-hidden="true">
          2
        </span>
        {{ $t("onboarding.organization.step_organization") }}
      </li>
      <li>
        <span class="onboarding-checkout-steps__marker" aria-hidden="true">
          3
        </span>
        {{ $t("onboarding.organization.step_payment") }}
      </li>
    </ol>
  </nav>
</template>
<script>
export default {
  name: "OnboardingCheckoutSteps",
}
</script>

<style lang="scss" scoped>
.onboarding-checkout-steps {
  padding: var(--medium-gap) var(--large-gap);
  border-bottom: var(--border-block);

  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: var(--tiny-gap);
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);

    &:not(:last-child)::after {
      content: "›";
      margin-left: var(--small-gap);
    }

    &[aria-current="step"] {
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

.onboarding-checkout-steps__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border: var(--border-button);
  border-radius: 50%;
  font-size: var(--text-xs);

  .onboarding-checkout-steps__step--done &,
  [aria-current="step"] & {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-contrast);
  }
}
</style>
