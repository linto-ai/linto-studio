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
      <LiveCreditStatus
        v-if="org.liveCredit"
        class="org-billing-card__live-credit"
        :balance="org.liveCredit.balance"
        :expires-at-label="org.liveCredit.expiresAtLabel"
        :low-balance="org.liveCredit.lowBalance"
        :unmetered="org.liveCredit.unmetered"
        :admission-minutes="org.liveCredit.admissionMinutes"
        :overdraft-minutes="org.liveCredit.overdraftMinutes"
        :is-org-admin="org.liveCredit.isOrgAdmin"
        :purchasable="org.liveCredit.purchasable"
        @buy="onBuyLiveMinutes" />

      <div class="org-billing-card__quotas-head">
        <h4 class="section-caption">
          {{ $t("billing.account.current_quotas") }}
        </h4>
        <time v-if="org.resetDateLabel" class="no-shrink">{{
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
      </div>

      <!-- Not wired yet: per-org member usage detail (MemberUsageTable) needs
           a target/route decision. -->
      <a
        v-if="org.showMemberConsumptionLink"
        href="#"
        class="org-billing-card__member-link"
        @click.prevent
        >{{ $t("billing.account.member_consumption_link") }} →</a
      >

      <div
        class="org-billing-card__footer"
        v-if="org.renewalLabel || org.isPaid">
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
import LiveCreditStatus from "@/components/molecules/LiveCreditStatus.vue"

export default {
  name: "OrgBillingCard",
  components: { LiveCreditStatus },
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
    onBuyLiveMinutes() {
      // Pack purchase through Stripe Checkout arrives in J2.
      bus.$emit("app_notif", {
        status: "info",
        message: this.$t("billing.live.buy_soon"),
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
    background-color: var(--neutral-5);
  }

  &__live-credit {
    margin-top: 1em;
  }

  &__quotas-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 1em 0 0.75em;
    margin-bottom: 1rem;

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
