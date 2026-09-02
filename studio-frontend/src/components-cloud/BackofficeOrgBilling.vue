<template>
  <section class="bo-billing">
    <h2 class="bo-billing__h2">{{ $t("billing.backoffice.title") }}</h2>

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
          {{ live.unmetered ? "∞" : fmtMinutes(live.balance) }}
        </span>
      </div>
    </div>

    <!-- Mode: normal (SaaS org), comp (offered access), managed (hosted customer) -->
    <div class="bo-billing__block">
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
    <div class="bo-billing__block">
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="lot in lots" :key="lot._id">
            <td>{{ lot.source }}<span v-if="lot.reason"> · {{ lot.reason }}</span></td>
            <td>{{ fmtMinutes(lot.minutes) }}</td>
            <td>{{ fmtMinutes(lot.remaining) }}</td>
            <td>{{ formatDate(lot.expiresAt) }}</td>
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
import {
  apiAdminGetOrgBilling,
  apiAdminSetSeats,
  apiAdminSetOrgMode,
  apiAdminGrantCredits,
} from "@/api/cloud"
import Button from "@/components/atoms/Button.vue"

const MODES = ["normal", "comp", "managed"]

const METER_LABEL = {
  "import.minutes": "billing.meter.import",
  "ai.generations": "billing.meter.ai",
  "ai.chat": "billing.meter.chat",
  "api.calls": "billing.meter.api",
}

export default {
  name: "BackofficeOrgBilling",
  components: { Button },
  props: {
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      MODES,
      billing: null,
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
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.billing = await apiAdminGetOrgBilling(this.organizationId)
      if (this.billing) {
        if (typeof this.billing.seats === "number")
          this.seatsInput = this.billing.seats
        this.modeInput = this.billing.mode || "normal"
      }
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
    async saveSeats() {
      this.busy = true
      try {
        await apiAdminSetSeats(
          this.organizationId,
          Math.max(1, this.seatsInput || 1),
          { message: this.$t("billing.backoffice.saved") },
        )
        await this.load()
      } finally {
        this.busy = false
      }
    },
    fmt(m, v) {
      return m.unit === "minutes" ? this.fmtMinutes(v) : v
    },
    fmtMinutes(min) {
      min = Math.round(min || 0)
      const neg = min < 0
      min = Math.abs(min)
      const h = Math.floor(min / 60)
      const mn = min % 60
      const s = h > 0 ? `${h}h${mn > 0 ? mn + "min" : ""}` : `${mn}min`
      return neg ? `-${s}` : s
    },
    formatDate(iso) {
      try {
        return new Date(iso).toLocaleDateString(this.$i18n?.locale || "fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      } catch (e) {
        return ""
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bo-billing {
  &__h2 {
    margin-bottom: 0.75em;
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
