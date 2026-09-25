<template>
  <Modal
    v-model="_value"
    :title="$t('seats.manage.title')"
    size="md"
    :withActionApply="false"
    :withActionCancel="false"
    :withClose="false"
    :cancelOnEscape="false"
    :overlayClose="false">
    <!-- The modal owns its buttons: the built-in ones close on click, which
         would hide the outcome of a refused change. -->
    <template #header-actions>
      <Button
        icon="x"
        size="sm"
        :disabled="running"
        :title="$t('modal.close')"
        @click="requestClose" />
    </template>

    <NotificationBanner
      v-if="!canManage"
      variant="error"
      icon="warning-circle"
      align="start"
      class="manage-seats__banner">
      {{ $t("seats.manage.cannot_manage") }}
    </NotificationBanner>

    <NotificationBanner
      v-else-if="failed"
      variant="error"
      icon="warning-circle"
      align="start"
      class="manage-seats__banner">
      {{ $t("seats.manage.failed") }}
    </NotificationBanner>

    <div class="manage-seats__control flex row align-center gap-medium">
      <label class="field-label flex1" :for="stepperId">
        {{ $t("seats.manage.stepper_label") }}
      </label>
      <NumberStepper
        v-model="seats"
        :id="stepperId"
        :min="minimumSeats"
        :decrement-label="$t('seats.manage.decrement')"
        :increment-label="$t('seats.manage.increment')"
        :disabled="running || !canManage" />
    </div>

    <p class="manage-seats__floor">
      {{ $t("seats.manage.floor_hint", { count: minimumSeats }) }}
    </p>

    <NotificationBanner
      v-if="notice"
      variant="warning"
      align="start"
      class="manage-seats__notice">
      {{ notice }}
    </NotificationBanner>

    <template #actions-left>
      <p v-if="prorated" class="manage-seats__estimate">
        {{ $t("seats.manage.estimate_note") }}
      </p>
    </template>

    <template #actions-right>
      <Button
        variant="tertiary"
        :label="$t('modal.cancel')"
        :disabled="running"
        @click="requestClose" />
      <Button
        variant="primary"
        :label="applyLabel"
        :loading="running"
        :disabled="applyDisabled"
        @click="apply" />
    </template>
  </Modal>
</template>

<script>
import { computeProratedSeatPrice } from "@/tools/computeProratedSeatPrice.js"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { generateId } from "@/tools/generateId.js"

import Modal from "@/components/molecules/Modal.vue"
import NumberStepper from "@/components/molecules/NumberStepper.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

export default {
  name: "ModalManageSeats",
  components: { Modal, NumberStepper, NotificationBanner },
  props: {
    value: { type: Boolean, required: true },
    organizationId: { type: String, required: true },
    // Seats currently paid for.
    capacity: { type: Number, required: true },
    // Never below the collaborators in place, nor below the plan's floor: the
    // API raises the figure silently otherwise.
    minimumSeats: { type: Number, required: true },
    // { canManage, unitCents, currency, periodStart, periodEnd } — null when
    // the price is unknown (the subscription is readable by admins only).
    purchase: { type: Object, default: null },
  },
  data() {
    return {
      seats: this.capacity,
      running: false,
      failed: false,
      // Frozen when the modal opens so the estimate does not drift while the
      // user hesitates.
      openedAt: new Date(),
      stepperId: generateId(),
    }
  },
  watch: {
    value: {
      handler(isOpen) {
        if (isOpen) this.reset()
      },
      immediate: true,
    },
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    canManage() {
      return this.purchase?.canManage === true
    },
    delta() {
      return this.seats - this.capacity
    },
    prorated() {
      if (this.delta <= 0 || !this.purchase?.unitCents) return null
      return computeProratedSeatPrice({
        unitCents: this.purchase.unitCents,
        quantity: this.delta,
        periodStart: this.purchase.periodStart,
        periodEnd: this.purchase.periodEnd,
        now: this.openedAt,
      })
    },
    notice() {
      if (this.delta === 0) return ""
      if (this.delta < 0) {
        return this.$tc("seats.manage.decrease_notice", -this.delta, {
          count: -this.delta,
        })
      }
      if (!this.prorated) {
        return this.$tc(
          "seats.manage.increase_notice_unknown_price",
          this.delta,
          { count: this.delta },
        )
      }
      return this.$tc("seats.manage.increase_notice", this.delta, {
        count: this.delta,
        price: formatCurrencyAmount(
          this.prorated.amountCents,
          this.purchase.currency,
          this.$i18n?.locale,
        ),
      })
    },
    applyLabel() {
      if (this.delta === 0) return this.$t("seats.manage.unchanged")
      return this.$t(
        this.delta > 0 ? "seats.manage.apply_and_pay" : "seats.manage.apply",
      )
    },
    applyDisabled() {
      return this.running || this.delta === 0 || !this.canManage
    },
  },
  methods: {
    reset() {
      this.seats = this.capacity
      this.running = false
      this.failed = false
      this.openedAt = new Date()
    },
    requestClose() {
      if (this.running) return
      this.$emit("input", false)
    },
    async apply() {
      this.running = true
      this.failed = false
      const subscription = await this.$store.dispatch("billing/changeSeats", {
        orgId: this.organizationId,
        seats: this.seats,
      })
      this.running = false
      if (!subscription) {
        this.failed = true
        return
      }
      // The API floors the figure: report what came back, never what was asked.
      this.$emit("done", subscription)
      this.$emit("input", false)
    },
  },
}
</script>

<style lang="scss" scoped>
.manage-seats__banner,
.manage-seats__notice {
  margin-bottom: 0.75rem;
}

.manage-seats__notice {
  margin-top: 0.75rem;
}

.manage-seats__control {
  padding: 0.25rem 0;
}

.manage-seats__floor,
.manage-seats__estimate {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}
</style>
