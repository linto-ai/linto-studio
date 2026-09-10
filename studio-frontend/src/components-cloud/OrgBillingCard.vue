<template>
  <details class="org-billing-card" :open="open">
    <summary class="org-billing-card__summary">
      <ph-icon name="caret-right" size="sm" class="org-billing-card__caret" />
      <Avatar :icon="org.icon" size="sm" tone="neutral" />
      <span class="org-billing-card__name">{{ org.name }}</span>
      <Chip :value="org.planLabel" :primary="!org.isFree" />
      <span class="org-billing-card__subtitle">{{ org.subtitleLabel }}</span>
      <span class="org-billing-card__price">
        <strong>{{ org.priceLabel }}</strong>
        <small v-if="org.priceSubLabel">{{ org.priceSubLabel }}</small>
      </span>
    </summary>

    <div class="org-billing-card__body">
      <div class="org-billing-card__quotas-head">
        <h4>{{ $t("billing.account.current_quotas") }}</h4>
        <time v-if="org.resetDateLabel">{{
          $t("billing.account.reset_on", { date: org.resetDateLabel })
        }}</time>
      </div>

      <div class="org-billing-card__meters">
        <QuotaMeter
          v-for="meter in org.meters"
          :key="meter.key"
          :label="$t(meter.labelKey)"
          :used="meter.used"
          :limit="meter.limit"
          :unit="meter.unit" />

        <!-- Live transcription has no per-period quota endpoint yet (only a
             prepaid balance, unrelated shape) — placeholder meter for
             non-per-seat orgs until the backend exposes it. -->
        <QuotaMeter
          v-if="org.liveMeter"
          :label="$t('billing.account.meter.live')"
          :used="org.liveMeter.used"
          :limit="org.liveMeter.limit"
          unit="minutes" />

        <div v-if="org.seatStatus" class="org-billing-card__seat-status">
          <div class="org-billing-card__seat-status-head">
            <span>{{ $t("billing.account.meter.live") }}</span>
            <span>{{ org.seatStatus.perSeatLabel }}</span>
          </div>
          <SeatStatusBar :segments="org.seatStatus.segments" />
        </div>
      </div>

      <p v-if="org.seatStatus" class="org-billing-card__consumed">
        {{ org.seatStatus.consumedLabel }}
      </p>

      <!-- Not wired yet: per-org member usage detail (MemberUsageTable) needs
           a target/route decision. -->
      <a
        v-if="org.showMemberConsumptionLink"
        href="#"
        class="org-billing-card__member-link"
        @click.prevent
        >{{ $t("billing.account.member_consumption_link") }} →</a
      >

      <div class="org-billing-card__footer">
        <span v-if="org.renewalLabel">{{ org.renewalLabel }}</span>
        <Button
          v-if="org.isPaid"
          variant="link"
          size="xs"
          intent="destructive"
          @click="onCancelClick">
          {{ $t("billing.account.cancel_subscription") }}
        </Button>
      </div>
    </div>
  </details>
</template>

<script>
import { bus } from "@/main.js"

export default {
  name: "OrgBillingCard",
  props: {
    org: { type: Object, required: true },
    open: { type: Boolean, default: false },
  },
  methods: {
    onCancelClick() {
      // Cancellation goes through the Stripe Customer Portal, not shipped yet.
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
.org-billing-card {
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--background-primary);

  & + & {
    margin-top: 0.75em;
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.85em 1em;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  &__caret {
    transition: transform 0.15s ease;
    flex-shrink: 0;
  }

  &[open] &__caret {
    transform: rotate(90deg);
  }

  &__name {
    font-weight: 600;
  }

  &__subtitle {
    flex: 1;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;

    small {
      color: var(--text-secondary);
      font-size: 0.78rem;
    }
  }

  &__body {
    padding: 0 1em 1em;
    border-top: 1px solid var(--neutral-20);
  }

  &__quotas-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 1em 0 0.75em;

    h4 {
      margin: 0;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: var(--text-secondary);
    }

    time {
      font-size: 0.78rem;
      color: var(--text-secondary);
    }
  }

  &__meters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1em 1.5em;
  }

  &__seat-status-head {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 0.3em;
  }

  &__consumed {
    margin: 0.6em 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  &__member-link {
    display: inline-block;
    margin-top: 0.6em;
    font-size: 0.85rem;
    color: var(--primary-color);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    margin-top: 1em;
    padding-top: 0.75em;
    border-top: 1px solid var(--neutral-20);
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
}
</style>
