<template>
  <section class="m-credit-exhausted">
    <span class="m-credit-exhausted__badge">{{
      $t("mobile.live.credit_exhausted_badge")
    }}</span>
    <h2 class="m-credit-exhausted__headline">
      {{ $t("billing.settings.packs.pitch.live.headline") }}
    </h2>
    <ul class="m-credit-exhausted__features">
      <li
        v-for="feature in features"
        :key="feature.key"
        class="m-credit-exhausted__feature">
        <span class="m-credit-exhausted__feature-icon" aria-hidden="true">
          <PhIcon :name="feature.icon" size="sm" />
        </span>
        <span class="m-credit-exhausted__feature-text">
          <strong>{{ $t(`${feature.key}.title`) }}</strong>
          <span class="m-muted">{{ $t(`${feature.key}.text`) }}</span>
        </span>
      </li>
    </ul>
    <!-- The purchase, or who to ask for it -->
    <div class="m-credit-exhausted__action">
      <slot />
    </div>
  </section>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// What live brings, told when the organization has no live minutes left
const FEATURES = [
  { icon: "microphone", key: "billing.settings.packs.pitch.live.input" },
  { icon: "users", key: "billing.settings.packs.pitch.live.speakers" },
  { icon: "translate", key: "billing.settings.packs.pitch.live.translation" },
]

export default {
  name: "LiveCreditExhausted",
  components: { PhIcon },
  data() {
    return { features: FEATURES }
  },
}
</script>

<style scoped>
/* Fills the page: the purchase button sits at the bottom of the screen */
.m-credit-exhausted {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--m-space-4);
}

.m-credit-exhausted__badge {
  padding: var(--m-space-1) var(--m-space-3);
  border-radius: var(--m-radius-round);
  background: var(--m-danger-soft);
  color: var(--m-danger);
  font-size: var(--m-font-size-sm);
  font-weight: 600;
}

.m-credit-exhausted__headline {
  margin: 0;
  font-size: var(--m-font-size-xl);
  line-height: 1.25;
}

.m-credit-exhausted__features {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.m-credit-exhausted__feature {
  display: flex;
  align-items: flex-start;
  gap: var(--m-space-3);
}

.m-credit-exhausted__feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--m-primary-soft);
  color: var(--m-primary);
}

.m-credit-exhausted__feature-text {
  display: flex;
  flex-direction: column;
}

/* The purchase form spans the page, under the left-aligned pitch */
.m-credit-exhausted__action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}
</style>
