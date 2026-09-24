<template>
  <Modal
    v-model="_value"
    :title="$tc('seats.grant.title', rows.length, { count: rows.length })"
    size="md"
    :withActionApply="false"
    :withActionCancel="false"
    :withClose="false"
    :cancelOnEscape="false"
    :overlayClose="false">
    <!-- The modal owns every button: the built-in ones close on click, which
         would cut a running batch and hide its partial result. -->
    <template #header-actions>
      <Button
        icon="x"
        size="sm"
        :disabled="running"
        :title="$t('modal.close')"
        @click="requestClose" />
    </template>

    <NotificationBanner
      v-if="missingSeats > 0 && !canBuySeats"
      variant="error"
      icon="warning-circle"
      align="start"
      class="grant-seats__banner">
      {{ $t("seats.grant.cannot_buy") }}
    </NotificationBanner>

    <NotificationBanner
      v-else-if="purchaseFailed"
      variant="error"
      icon="warning-circle"
      align="start"
      class="grant-seats__banner">
      {{ $t("seats.grant.purchase_failed") }}
    </NotificationBanner>

    <NotificationBanner
      v-else-if="stoppedOnSeats"
      variant="warning"
      icon="warning-circle"
      align="start"
      class="grant-seats__banner">
      {{ $t("seats.grant.error_seats_full") }}
    </NotificationBanner>

    <NotificationBanner
      v-else-if="missingSeats > 0"
      variant="warning"
      align="start"
      class="grant-seats__banner">
      {{ extraSeatsLabel }}
    </NotificationBanner>

    <ul class="grant-seats__list">
      <li v-for="row in rows" :key="row.userId" class="grant-seats__row">
        <div class="flex row align-center gap-small">
          <UserInfoInline
            class="flex1"
            :user="row.member"
            :userId="row.userId"
            :showImage="false" />
          <OrgaRoleSelector
            :value="row.role"
            :roles="roleOptions"
            :readonly="running || row.status === 'done'"
            @input="row.role = $event" />
          <PhIcon
            v-if="row.status === 'done'"
            name="check-circle"
            color="var(--success-color)"
            :title="$t('seats.grant.done')" />
          <Button
            v-else
            icon="x"
            size="sm"
            variant="text"
            :disabled="running"
            :title="$t('seats.grant.drop')"
            @click="dropRow(row.userId)" />
        </div>
        <p v-if="row.message" class="grant-seats__message">
          <PhIcon name="warning-circle" size="sm" />
          {{ row.message }}
        </p>
        <p v-else-if="row.status === 'skipped'" class="grant-seats__message">
          {{ $t("seats.grant.not_attempted") }}
        </p>
      </li>
    </ul>

    <template #actions-left>
      <p v-if="running" class="grant-seats__footer" aria-live="polite">
        {{
          $t("seats.grant.running", {
            done: processed,
            total: pendingRows.length,
          })
        }}
      </p>
    </template>

    <template #actions-right>
      <Button
        variant="tertiary"
        :label="$t(hasFailures ? 'seats.grant.close' : 'modal.cancel')"
        :disabled="running"
        @click="requestClose" />
      <Button
        variant="primary"
        :label="applyLabel"
        :loading="running"
        :disabled="applyDisabled"
        @click="run" />
    </template>
  </Modal>
</template>

<script>
import { apiGrantSeatsToMembers } from "@/api/organizationSeats.js"
import { computeProratedSeatPrice } from "@/tools/computeProratedSeatPrice.js"
import { computeSeatsNeeded } from "@/tools/computeSeatsNeeded.js"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount"
import { userName } from "@/tools/userName.js"

import Modal from "@/components/molecules/Modal.vue"
import OrgaRoleSelector from "@/components/molecules/OrgaRoleSelector.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

export default {
  name: "ModalGrantSeats",
  components: { Modal, OrgaRoleSelector, UserInfoInline, NotificationBanner },
  props: {
    value: { type: Boolean, required: true },
    organizationId: { type: String, required: true },
    // The batch to work on: one entry per member, a batch of one is a batch.
    members: { type: Array, required: true },
    // Seat roles the viewer may grant, from computeSeatRoleOptions.
    roleOptions: { type: Array, required: true },
    defaultRole: { type: Number, required: true },
    // Seats left on the plan, null when the plan has no seat cap.
    seatsAvailable: { type: Number, default: null },
    // Seats currently paid for, null when there is no cap.
    seatsCapacity: { type: Number, default: null },
    // { canManage, unitCents, currency, periodStart, periodEnd } — null when
    // the price is out of reach (the subscription is admin-only).
    purchase: { type: Object, default: null },
  },
  data() {
    return {
      rows: [],
      running: false,
      processed: 0,
      stoppedOnSeats: false,
      purchaseFailed: false,
      // Frozen when the modal opens so the estimate does not drift.
      openedAt: new Date(),
    }
  },
  watch: {
    value: {
      handler(isOpen) {
        if (isOpen) this.reset()
      },
      immediate: true,
    },
    // The batch is handed over just before the modal opens: rebuild on both,
    // whichever lands last.
    members() {
      if (this.value) this.reset()
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
    pendingRows() {
      return this.rows.filter((row) => row.status !== "done")
    },
    seatsNeeded() {
      return computeSeatsNeeded(this.pendingRows)
    },
    // Seats this batch has to buy on top of what the plan holds.
    missingSeats() {
      if (this.seatsAvailable === null) return 0
      return Math.max(0, this.seatsNeeded - this.seatsAvailable)
    },
    canBuySeats() {
      return this.purchase?.canManage === true
    },
    prorated() {
      if (this.missingSeats <= 0 || !this.purchase?.unitCents) return null
      return computeProratedSeatPrice({
        unitCents: this.purchase.unitCents,
        quantity: this.missingSeats,
        periodStart: this.purchase.periodStart,
        periodEnd: this.purchase.periodEnd,
        now: this.openedAt,
      })
    },
    extraSeatsLabel() {
      if (!this.prorated) {
        return this.$tc(
          "seats.grant.extra_helper_unknown_price",
          this.missingSeats,
          { count: this.missingSeats },
        )
      }
      return this.$tc("seats.grant.extra_helper", this.missingSeats, {
        count: this.missingSeats,
        price: formatCurrencyAmount(
          this.prorated.amountCents,
          this.purchase.currency,
          this.$i18n?.locale,
        ),
      })
    },
    hasFailures() {
      return this.rows.some((row) => row.status === "error")
    },
    applyLabel() {
      if (this.hasFailures) {
        const failures = this.rows.filter(
          (row) => row.status === "error",
        ).length
        return this.$tc("seats.grant.retry_failed", failures, {
          count: failures,
        })
      }
      if (this.missingSeats > 0 && this.canBuySeats) {
        return this.$t("seats.grant.apply_and_pay")
      }
      if (this.seatsNeeded > 0) {
        return this.$tc("seats.grant.apply", this.seatsNeeded, {
          count: this.seatsNeeded,
        })
      }
      return this.$tc("seats.grant.apply_no_seat", this.pendingRows.length, {
        count: this.pendingRows.length,
      })
    },
    applyDisabled() {
      // Running out of seats never blocks: the missing ones are bought. It only
      // blocks for someone whose role cannot buy them.
      return (
        this.running ||
        this.pendingRows.length === 0 ||
        (this.missingSeats > 0 && !this.canBuySeats)
      )
    },
  },
  methods: {
    reset() {
      this.running = false
      this.processed = 0
      this.stoppedOnSeats = false
      this.purchaseFailed = false
      this.openedAt = new Date()
      this.rows = this.members.map((member) => ({
        userId: member.userId || member._id,
        member,
        name: userName(member),
        currentRole: member.role,
        role: this.defaultRole,
        status: "idle",
        message: "",
      }))
    },
    dropRow(userId) {
      this.rows = this.rows.filter((row) => row.userId !== userId)
      if (this.rows.length === 0) this.requestClose()
    },
    requestClose() {
      if (this.running) return
      this.$emit("input", false)
    },
    onProgress(step) {
      this.processed = step.done
    },
    // Buying first is what makes the batch possible at all: the API refuses a
    // promotion that exceeds the capacity, whoever asks.
    async buyMissingSeats() {
      const subscription = await this.$store.dispatch("billing/changeSeats", {
        orgId: this.organizationId,
        seats: (this.seatsCapacity || 0) + this.missingSeats,
      })
      return !!subscription
    },
    async run() {
      const batch = this.pendingRows
      this.running = true
      this.processed = 0
      this.stoppedOnSeats = false
      this.purchaseFailed = false

      if (this.missingSeats > 0) {
        const bought = await this.buyMissingSeats()
        if (!bought) {
          this.purchaseFailed = true
          this.running = false
          return
        }
      }

      batch.forEach((row) => {
        row.status = "running"
        row.message = ""
      })

      const result = await apiGrantSeatsToMembers(
        this.organizationId,
        batch.map((row) => ({ userId: row.userId, role: row.role })),
        this.onProgress,
      )

      this.applyResult(result)
      this.running = false
      this.$emit("done", result)
      if (!result.failed.length) this.requestClose()
    },
    applyResult(result) {
      const failures = new Map(
        result.failed.map((failure) => [failure.userId, failure]),
      )
      const granted = new Set(result.succeeded.map((entry) => entry.userId))
      for (const row of this.rows) {
        if (granted.has(row.userId)) {
          row.status = "done"
          row.currentRole = row.role
          row.message = ""
        } else if (failures.has(row.userId)) {
          row.status = "error"
          row.message = failures.get(row.userId).message
        } else if (row.status === "running") {
          row.status = "skipped"
          row.message = ""
        }
      }
      this.stoppedOnSeats = result.stopped
    },
  },
}
</script>

<style lang="scss" scoped>
.grant-seats__banner {
  margin-bottom: 0.75rem;
}

.grant-seats__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.grant-seats__row {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--neutral-20);

  &:last-child {
    border-bottom: none;
  }
}

.grant-seats__message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0.25rem 0 0;
  color: var(--danger-color);
  font-size: 0.9em;
}

.grant-seats__footer {
  margin: 0;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
</style>
