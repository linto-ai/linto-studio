<template>
  <section class="bo-billing">
    <h2 class="bo-billing__h2">{{ $t("billing.backoffice.title") }}</h2>

    <div v-if="billing" class="bo-billing__grid">
      <div class="bo-billing__row">
        <span class="bo-billing__k">{{ $t("billing.backoffice.plan") }}</span>
        <span class="bo-billing__v">
          <strong>{{ billing.planKey }}</strong>
          <span v-if="billing.billingExempt" class="bo-billing__tag">{{
            $t("billing.page.comp")
          }}</span>
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
    </div>

    <!-- Complete-free toggle: full Premium, unlimited (incl. API key), no billing -->
    <div class="bo-billing__exempt">
      <div class="bo-billing__exempt-text">
        <strong>{{ $t("billing.backoffice.complete_free") }}</strong>
        <p>{{ $t("billing.backoffice.complete_free_hint") }}</p>
      </div>
      <Button
        :variant="isExempt ? 'secondary' : 'primary'"
        :loading="busy"
        @click="toggleExempt">
        {{
          isExempt
            ? $t("billing.backoffice.disable_free")
            : $t("billing.backoffice.enable_free")
        }}
      </Button>
    </div>

    <!-- Manual seat override (normally derived from membership) -->
    <div class="bo-billing__seats" v-if="!isExempt">
      <span>{{ $t("billing.backoffice.set_seats") }}</span>
      <input
        type="number"
        min="1"
        v-model.number="seatsInput"
        class="bo-billing__seats-input" />
      <Button variant="secondary" :loading="busy" @click="saveSeats">{{
        $t("apply")
      }}</Button>
    </div>
  </section>
</template>

<script>
import {
  apiAdminGetOrgBilling,
  apiAdminSetExempt,
  apiAdminSetSeats,
} from "@/api/cloud"
import Button from "@/components/atoms/Button.vue"

const METER_LABEL = {
  "media.import.duration": "billing.meter.import",
  "ai.insights.count": "billing.meter.ai",
  "live.duration": "billing.meter.live",
}

export default {
  name: "BackofficeOrgBilling",
  components: { Button },
  props: {
    organizationId: { type: String, required: true },
  },
  data() {
    return { billing: null, busy: false, seatsInput: 1 }
  },
  computed: {
    isExempt() {
      return !!this.billing?.billingExempt
    },
    meters() {
      const caps = this.billing?.usage?.capabilities || {}
      return Object.entries(caps).map(([key, c]) => ({
        key,
        label: METER_LABEL[key] || key,
        used: c.used,
        limit: c.limit,
        kind: (c.unit || "").includes("second") ? "duration" : "count",
      }))
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.billing = await apiAdminGetOrgBilling(this.organizationId)
      if (this.billing && typeof this.billing.seats === "number") {
        this.seatsInput = this.billing.seats
      }
    },
    async toggleExempt() {
      this.busy = true
      try {
        await apiAdminSetExempt(this.organizationId, !this.isExempt, {
          message: this.$t("billing.backoffice.saved"),
        })
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
          {
            message: this.$t("billing.backoffice.saved"),
          },
        )
        await this.load()
      } finally {
        this.busy = false
      }
    },
    fmt(m, v) {
      if (m.kind !== "duration") return v
      const sec = Math.round(v || 0)
      const h = Math.floor(sec / 3600)
      const mn = Math.round((sec % 3600) / 60)
      return h > 0 ? `${h}h${mn > 0 ? mn + "min" : ""}` : `${mn}min`
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
  }
  &__exempt {
    display: flex;
    align-items: center;
    gap: 1em;
    justify-content: space-between;
    background: var(--neutral-10);
    border: 1px solid var(--neutral-30);
    border-radius: 8px;
    padding: 0.75em 1em;
    margin-bottom: 1em;
    p {
      margin: 0.2em 0 0;
      font-size: 0.82rem;
      color: var(--neutral-60);
      max-width: 520px;
    }
  }
  &__seats {
    display: flex;
    align-items: center;
    gap: 0.6em;
    font-size: 0.9rem;
  }
  &__seats-input {
    width: 80px;
    padding: 0.35em 0.5em;
    border: 1px solid var(--neutral-40);
    border-radius: 6px;
  }
}
</style>
