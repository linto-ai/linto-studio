<template>
  <section class="bo-billing">
    <h2 class="bo-billing__h2">{{ $t("billing.backoffice.title") }}</h2>

    <NotificationBanner
      v-if="loadFailed"
      variant="error"
      icon="warning-circle"
      align="start"
      class="bo-billing__banner">
      {{ $t("billing.backoffice.load_error") }}
    </NotificationBanner>

    <div v-if="billing" class="bo-billing__grid">
      <div class="bo-billing__row">
        <span class="bo-billing__k">{{ $t("billing.backoffice.plan") }}</span>
        <span class="bo-billing__v">
          <strong>{{ billing.planKey }}</strong>
          <span
            v-if="billing.mode !== 'normal'"
            class="bo-billing__tag"
            :class="`bo-billing__tag--${billing.mode}`"
            >{{ $t("billing.mode." + billing.mode) }}</span
          >
        </span>
      </div>
      <div class="bo-billing__row">
        <span class="bo-billing__k">{{ $t("billing.backoffice.seats") }}</span>
        <span class="bo-billing__v">{{ billing.seats }}</span>
      </div>
      <div class="bo-billing__row" v-if="subscription">
        <span class="bo-billing__k">{{ $t("billing.backoffice.status") }}</span>
        <span class="bo-billing__v">
          {{ subscription.status }}
          <span
            v-if="subscription.cancelAtPeriodEnd"
            class="bo-billing__tag bo-billing__tag--managed"
            >{{ $t("billing.backoffice.cancel_scheduled") }}</span
          >
        </span>
      </div>
      <div class="bo-billing__row" v-if="subscription?.currentPeriodEnd">
        <span class="bo-billing__k">{{ $t("billing.backoffice.renews") }}</span>
        <span class="bo-billing__v">{{
          formatDate(subscription.currentPeriodEnd)
        }}</span>
      </div>
      <div class="bo-billing__row" v-for="m in meters" :key="m.key">
        <span class="bo-billing__k">{{ $t(m.label) }}</span>
        <span class="bo-billing__v">
          {{ fmt(m, m.used) }} / {{ m.limit == null ? "∞" : fmt(m, m.limit) }}
        </span>
      </div>
      <div class="bo-billing__row" v-if="live">
        <span class="bo-billing__k">{{
          $t("billing.backoffice.live_balance")
        }}</span>
        <span class="bo-billing__v">
          {{ live.unmetered ? "∞" : formatMinutes(live.balance) }}
        </span>
      </div>
    </div>

    <NotificationBanner
      v-if="locked"
      variant="warning"
      icon="warning-circle"
      align="start"
      class="bo-billing__banner">
      {{ $t("billing.team_plan_required") }}
    </NotificationBanner>

    <!-- Mode: normal (SaaS org), comp (offered access), managed (hosted customer) -->
    <div v-if="billing" class="bo-billing__block">
      <div class="bo-billing__block-text">
        <strong>{{ $t("billing.backoffice.mode") }}</strong>
        <p>{{ $t("billing.backoffice.mode_hint") }}</p>
      </div>
      <div class="bo-billing__inline">
        <select v-model="modeInput" class="bo-billing__select">
          <option v-for="m in MODES" :key="m" :value="m">
            {{ $t("billing.mode." + m) }}
          </option>
        </select>
        <Button
          variant="primary"
          :loading="busy"
          :disabled="!billing || modeInput === billing.mode"
          @click="saveMode">
          {{ $t("apply") }}
        </Button>
      </div>
    </div>

    <!-- Live minutes grant, with a mandatory reason (traced in the activity log) -->
    <div v-if="billing" class="bo-billing__block">
      <div class="bo-billing__block-text">
        <strong>{{ $t("billing.backoffice.credits_title") }}</strong>
        <p>{{ $t("billing.backoffice.credits_hint") }}</p>
      </div>
      <div class="bo-billing__inline">
        <input
          type="number"
          min="1"
          v-model.number="creditMinutes"
          class="bo-billing__input bo-billing__input--num"
          :placeholder="$t('billing.backoffice.credits_minutes')" />
        <input
          type="text"
          v-model.trim="creditReason"
          class="bo-billing__input"
          :placeholder="$t('billing.backoffice.credits_reason')" />
        <Button
          variant="primary"
          :loading="busy"
          :disabled="!(creditMinutes > 0) || creditReason.length < 3"
          @click="grantCredits">
          {{ $t("billing.backoffice.credits_grant") }}
        </Button>
      </div>
      <table v-if="lots.length" class="bo-billing__lots">
        <thead>
          <tr>
            <th>{{ $t("billing.backoffice.lot_source") }}</th>
            <th>{{ $t("billing.backoffice.lot_minutes") }}</th>
            <th>{{ $t("billing.backoffice.lot_remaining") }}</th>
            <th>{{ $t("billing.backoffice.lot_expires") }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lot in lots" :key="lot._id">
            <td>
              {{ lot.source }}<span v-if="lot.reason"> · {{ lot.reason }}</span>
            </td>
            <td>{{ formatMinutes(lot.minutes) }}</td>
            <td>{{ formatMinutes(lot.remaining) }}</td>
            <td>{{ formatDate(lot.expiresAt) }}</td>
            <td>
              <Alert
                v-if="isRefundable(lot)"
                type="danger"
                :title="$t('billing.backoffice.refund_confirm_title')"
                :message="
                  $t('billing.backoffice.refund_confirm_body', {
                    minutes: formatMinutes(lot.minutes),
                  })
                "
                :confirmText="$t('billing.backoffice.lot_refund')"
                :cancelText="$t('modal.cancel')"
                @confirm="refundLot(lot)">
                <Button
                  size="sm"
                  variant="text"
                  intent="destructive"
                  icon="arrow-u-up-left"
                  :disabled="busy"
                  :title="$t('billing.backoffice.lot_refund')"
                  :aria-label="$t('billing.backoffice.lot_refund')" />
              </Alert>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Manual seat override (normally derived from membership). Only a normal
         org is billed per seat. -->
    <div class="bo-billing__block" v-if="billing && billing.mode === 'normal'">
      <div class="bo-billing__block-text">
        <strong>{{ $t("billing.backoffice.set_seats") }}</strong>
      </div>
      <div class="bo-billing__inline">
        <input
          type="number"
          min="1"
          v-model.number="seatsInput"
          class="bo-billing__input bo-billing__input--num" />
        <Button variant="secondary" :loading="busy" @click="saveSeats">{{
          $t("apply")
        }}</Button>
      </div>
    </div>
  </section>
</template>

<script>
import { bus } from "@/main.js"
import {
  apiAdminGetOrgBilling,
  apiAdminSetSeats,
  apiAdminSetOrgMode,
  apiAdminGrantCredits,
  apiAdminRefundLot,
} from "@/api/cloud"
import { formatDateOrDash } from "@/tools/formatDate"
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"
import Alert from "@/components/atoms/Alert.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

const MODES = ["normal", "comp", "managed"]

const METER_LABEL = {
  "import.minutes": "billing.meter.import",
  "ai.generations": "billing.meter.ai",
  "ai.chat": "billing.meter.chat",
  "api.calls": "billing.meter.api",
}

export default {
  name: "BackofficeOrgBilling",
  components: { Alert, NotificationBanner },
  props: {
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      MODES,
      billing: null,
      loadFailed: false,
      busy: false,
      seatsInput: 1,
      modeInput: "normal",
      creditMinutes: null,
      creditReason: "",
    }
  },
  computed: {
    meters() {
      const caps = this.billing?.usage?.capabilities || {}
      return Object.entries(caps)
        .filter(([, c]) => c && c.type === "quota")
        .map(([key, c]) => ({
          key,
          label: METER_LABEL[key] || key,
          used: c.used,
          limit: c.limit,
          unit: c.unit,
        }))
    },
    live() {
      return this.billing?.usage?.live || null
    },
    lots() {
      return this.billing?.lots || []
    },
    subscription() {
      return this.billing?.subscription || null
    },
    // A team org whose plan no longer grants collaboration: every gated call is
    // refused server-side until it is back on a team plan.
    locked() {
      return this.billing?.usage?.locked === true
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      const billing = await apiAdminGetOrgBilling(this.organizationId)
      // sendRequest answers undefined on failure and raises nothing without a
      // notif: without this the panel would just vanish, unexplained.
      this.loadFailed = !billing
      if (!billing) return
      this.billing = billing
      if (typeof billing.seats === "number") this.seatsInput = billing.seats
      this.modeInput = billing.mode || "normal"
    },
    async saveMode() {
      this.busy = true
      try {
        await apiAdminSetOrgMode(this.organizationId, this.modeInput, {
          message: this.$t("billing.backoffice.saved"),
        })
        await this.load()
      } finally {
        this.busy = false
      }
    },
    async grantCredits() {
      this.busy = true
      try {
        const res = await apiAdminGrantCredits(
          this.organizationId,
          { minutes: this.creditMinutes, reason: this.creditReason },
          { message: this.$t("billing.backoffice.saved") },
        )
        if (res && res.granted) {
          this.creditMinutes = null
          this.creditReason = ""
        }
        await this.load()
      } finally {
        this.busy = false
      }
    },
    // The seat route answers 200 with { updated: false, reason } when the org
    // has no active subscription or its plan is missing — so a success toast
    // cannot be left to sendRequest here.
    async saveSeats() {
      this.busy = true
      try {
        const res = await apiAdminSetSeats(
          this.organizationId,
          Math.max(1, this.seatsInput || 1),
        )
        if (res && res.updated) {
          this.notify("success", this.$t("billing.backoffice.saved"))
        } else {
          this.notify(
            "error",
            this.$t("billing.backoffice.seats_unchanged", {
              reason: res?.reason || "unknown",
            }),
          )
        }
        await this.load()
      } finally {
        this.busy = false
      }
    },
    notify(status, message) {
      bus.$emit("app_notif", { status, message })
    },
    // Only a pack actually paid at Stripe can be given back.
    isRefundable(lot) {
      return lot.source === "stripe" && !!lot.ref?.stripePaymentIntentId
    },
    async refundLot(lot) {
      this.busy = true
      try {
        const res = await apiAdminRefundLot(this.organizationId, lot._id)
        if (res && res.refunded) {
          this.notify("success", this.$t("billing.backoffice.refund_done"))
        } else {
          this.notify(
            "error",
            this.$t("billing.backoffice.refund_failed", {
              reason: res?.reason || "unknown",
            }),
          )
        }
        await this.load()
      } finally {
        this.busy = false
      }
    },
    fmt(m, v) {
      return m.unit === "minutes" ? this.formatMinutes(v) : v
    },
    formatMinutes(minutes) {
      return formatMinutesDuration(minutes)
    },
    formatDate(iso) {
      return formatDateOrDash(iso, this.$i18n?.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.bo-billing {
  &__h2 {
    margin-bottom: 0.75em;
  }
  &__banner {
    margin-bottom: 1em;
  }
  &__grid {
    border: 1px solid var(--neutral-30);
    border-radius: 8px;
    padding: 0.5em 1em;
    margin-bottom: 1em;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    padding: 0.4em 0;
    border-bottom: 1px solid var(--neutral-20);
    font-size: 0.9rem;
    &:last-child {
      border-bottom: none;
    }
  }
  &__k {
    color: var(--neutral-70);
  }
  &__v {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  &__tag {
    margin-left: 0.5em;
    background: var(--success-color, #30a46c);
    color: #fff;
    border-radius: 999px;
    padding: 0.05em 0.5em;
    font-size: 0.72rem;
    // managed is a deployment fact, comp a commercial one: keep them apart.
    &--managed {
      background: var(--primary-color, #4a5fd9);
    }
  }
  &__block {
    background: var(--neutral-10);
    border: 1px solid var(--neutral-30);
    border-radius: 8px;
    padding: 0.75em 1em;
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    p {
      margin: 0.2em 0 0;
      font-size: 0.82rem;
      color: var(--neutral-60);
      max-width: 620px;
    }
  }
  &__inline {
    display: flex;
    align-items: center;
    gap: 0.6em;
    flex-wrap: wrap;
    font-size: 0.9rem;
  }
  &__select,
  &__input {
    padding: 0.35em 0.5em;
    border: 1px solid var(--neutral-40);
    border-radius: 6px;
    font: inherit;
    background: var(--neutral-0, #fff);
  }
  &__input {
    min-width: 220px;
    &--num {
      min-width: 0;
      width: 100px;
    }
  }
  &__lots {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    th,
    td {
      text-align: left;
      padding: 0.35em 0.5em;
      border-bottom: 1px solid var(--neutral-20);
    }
    th {
      color: var(--neutral-60);
      font-weight: 600;
      font-size: 0.76rem;
    }
  }
}
</style>
