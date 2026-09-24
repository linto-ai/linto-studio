<template>
  <section class="dev-subscribe">
    <h2>Stripe test (dev only)</h2>
    <p class="dev-subscribe__balance">
      Plan, live balance and lots come from the API
      <Button
        variant="secondary"
        size="sm"
        :disabled="loading"
        label="Refresh"
        @click="loadAll" />
    </p>
    <h3>Subscribe through Checkout (organization without a subscription)</h3>
    <div class="dev-subscribe__row">
      <Button
        v-for="planKey in paidPlanKeys"
        :key="planKey"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="'Checkout ' + planKey"
        @click="subscribe(planKey)" />
    </div>

    <h3>Change the current plan (billed organization only)</h3>
    <div class="dev-subscribe__row">
      <Button
        v-for="target in changeTargets"
        :key="target.label"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="target.label"
        @click="changePlan(target.planKey, target.immediate)" />
    </div>

    <h3>Manage the subscription (Stripe Customer Portal)</h3>
    <div class="dev-subscribe__row">
      <Button
        variant="secondary"
        size="sm"
        :disabled="loading"
        label="Open the portal (invoices, card, cancellation)"
        @click="openPortal" />
    </div>

    <h3>Add seats (Business only)</h3>
    <p class="dev-subscribe__balance">
      Current plan: <strong>{{ usageLabel }}</strong>
    </p>
    <div class="dev-subscribe__row">
      <Button
        v-for="count in seatIncrements"
        :key="'seats-' + count"
        variant="secondary"
        size="sm"
        :disabled="loading || !isBusiness"
        :label="'Add ' + count + ' seat' + (count > 1 ? 's' : '')"
        @click="addSeats(count)" />
    </div>

    <h3>Buy live minutes (every plan, no welcome minutes on Free)</h3>
    <p class="dev-subscribe__balance">
      Live balance: <strong>{{ liveBalanceLabel }}</strong>
    </p>
    <div class="dev-subscribe__row">
      <Button
        v-for="pack in packsOfKind('live')"
        :key="pack.packKey"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="packLabel(pack)"
        @click="buyPack(pack.packKey)" />
      <span v-if="packsOfKind('live').length === 0">
        No live pack from /cloud/packs
      </span>
    </div>

    <h3>Buy transcription minutes (Free only)</h3>
    <p class="dev-subscribe__balance">
      Import quota: <strong>{{ importQuotaLabel }}</strong>
    </p>
    <div class="dev-subscribe__row">
      <Button
        v-for="pack in packsOfKind('transcription')"
        :key="pack.packKey"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="packLabel(pack)"
        @click="buyPack(pack.packKey)" />
      <span v-if="packsOfKind('transcription').length === 0">
        No transcription pack from /cloud/packs
      </span>
    </div>

    <h3>Refund a pack (platform admin, Stripe refund + webhook)</h3>
    <p class="dev-subscribe__balance">Lots of the organization</p>
    <div class="dev-subscribe__row">
      <Button
        v-for="lot in lots"
        :key="lot._id"
        variant="secondary"
        size="sm"
        :disabled="loading || lot.source !== 'stripe' || lot.remaining <= 0"
        :label="lotLabel(lot)"
        @click="refundLot(lot._id)" />
      <span v-if="lots.length === 0">
        No lot (GET /cloud/admin/orgs/:id needs a platform admin)
      </span>
    </div>

    <form
      class="dev-subscribe__form"
      @submit="subscribeBusinessWithNewOrganization">
      <h3>Business with a new organization</h3>
      <FormInput
        :field="newOrganizationName"
        v-model="newOrganizationName.value" />
      <FormInput :field="seats" v-model="seats.value" />
      <Button
        type="submit"
        variant="primary"
        size="md"
        :disabled="loading"
        label="Checkout Business, new organization" />
    </form>

    <form class="dev-subscribe__form" @submit="setManualPlan">
      <h3>Manual plan (platform admin, billed outside Stripe)</h3>
      <p class="dev-subscribe__balance">
        Current plan: <strong>{{ usageLabel }}</strong>
        <span v-if="manualPlanLabel">, {{ manualPlanLabel }}</span>
      </p>
      <label for="dev-manual-plan-key"
        >Plan (free removes the manual plan)</label
      >
      <select id="dev-manual-plan-key" v-model="manualPlan.planKey">
        <option
          v-for="planKey in manualPlanKeys"
          :key="planKey"
          :value="planKey">
          {{ planKey }}
        </option>
      </select>
      <FormInput :field="manualPlanSeats" v-model="manualPlanSeats.value" />
      <FormInput :field="manualPlanUntil" v-model="manualPlanUntil.value" />
      <FormInput :field="manualPlanReason" v-model="manualPlanReason.value" />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        :disabled="loading"
        label="Set the manual plan" />
    </form>

    <h3>Backoffice list (platform admin)</h3>
    <div class="dev-subscribe__row">
      <Button
        variant="secondary"
        size="sm"
        :disabled="loading"
        label="List subscriptions (raw, latest)"
        @click="listOrganizations(false)" />
      <Button
        variant="secondary"
        size="sm"
        :disabled="loading"
        label="List with usage and live balance (enriched)"
        @click="listOrganizations(true)" />
    </div>

    <form class="dev-subscribe__form" @submit.prevent="showLedgerExport('csv')">
      <h3>Accounting export (platform admin, ledger.csv)</h3>
      <FormInput :field="ledgerFrom" v-model="ledgerFrom.value" />
      <FormInput :field="ledgerTo" v-model="ledgerTo.value" />
      <div class="dev-subscribe__row">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          :disabled="loading"
          label="Show the CSV" />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          :disabled="loading"
          label="Show the rows (JSON)"
          @click="showLedgerExport('json')" />
      </div>
    </form>

    <textarea
      class="dev-subscribe__output"
      readonly
      rows="12"
      :value="output"></textarea>
  </section>
</template>

<script>
// Dev helper: drives the billing routes for the current org and shows the raw
// response.
import {
  apiCreateCheckout,
  apiCreateCreditsCheckout,
  apiCreatePortalSession,
  apiChangeSubscription,
  apiGetPacks,
  apiGetCredits,
  apiGetUsage,
  apiAdminGetOrgBilling,
  apiAdminRefundLot,
  apiAdminSetManualPlan,
  apiAdminListOrgs,
  apiAdminGetLedgerExport,
} from "@/api/cloud.js"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount.js"
import { buildManualPlanPayload } from "@/tools/buildManualPlanPayload.js"
import { buildLedgerExportQuery } from "@/tools/buildLedgerExportQuery.js"
import { formsMixin } from "@/mixins/forms.js"
import EMPTY_FIELD from "@/const/emptyField"
import { testName } from "@/tools/fields/testName"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  name: "DevSubscribeButtons",
  mixins: [formsMixin],
  components: { FormInput },
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      paidPlanKeys: ["premium", "business"],
      packs: [],
      credits: null,
      usage: null,
      // The subscription row, for the manual plan block (source, validUntil)
      subscription: null,
      lots: [],
      seatIncrements: [1, 2, 3],
      loading: false,
      output: "",
      fields: ["newOrganizationName"],
      newOrganizationName: {
        ...EMPTY_FIELD,
        label: "Organization name",
        testField: testName,
      },
      seats: {
        ...EMPTY_FIELD,
        label: "Seats (the plan floor applies server-side)",
        type: "number",
        value: "2",
      },
      manualPlanKeys: ["premium", "business", "free_payg"],
      manualPlan: { planKey: "business" },
      manualPlanSeats: {
        ...EMPTY_FIELD,
        label: "Seats (empty: the plan floor)",
        type: "number",
        value: "5",
      },
      manualPlanUntil: {
        ...EMPTY_FIELD,
        label: "Valid until (empty: open-ended)",
        type: "date",
      },
      manualPlanReason: {
        ...EMPTY_FIELD,
        label: "Reason (quote, public contract...)",
      },
      ledgerFrom: {
        ...EMPTY_FIELD,
        label: "From (empty: first day of this month)",
        type: "date",
      },
      ledgerTo: {
        ...EMPTY_FIELD,
        label: "To (empty: now)",
        type: "date",
      },
    }
  },
  async mounted() {
    this.loadAll()
    this.packs = (await apiGetPacks()) ?? []
  },
  watch: {
    "currentOrganization._id"() {
      this.loadAll()
    },
  },
  computed: {
    // A free planKey cancels the subscription, at period end or right now
    changeTargets() {
      return [
        ...this.paidPlanKeys.map((planKey) => ({
          planKey,
          label: `Switch to ${planKey}`,
        })),
        { planKey: "free_payg", label: "Back to free at period end" },
        { planKey: "free_payg", immediate: true, label: "Back to free now" },
      ]
    },
    isBusiness() {
      return this.usage?.planKey === "business"
    },
    usageLabel() {
      if (!this.usage) return "unknown (GET /cloud/usage failed)"
      const { planKey, mode, seats } = this.usage
      return `${planKey} (${mode}), ${seats} seat${seats > 1 ? "s" : ""}`
    },
    liveBalanceLabel() {
      if (!this.credits) return "unknown (GET /cloud/credits failed)"
      const { balance, expiresAt, lowBalance, admissionMinutes } = this.credits
      let label = `${balance} min`
      if (expiresAt) {
        label += `, next expiry ${new Date(expiresAt).toLocaleDateString()}`
      }
      if (lowBalance) {
        label += ` (low, ${admissionMinutes} min per language needed to start)`
      }
      return label
    },
    // Source and end of the current row, when it is a manual plan
    manualPlanLabel() {
      if (this.subscription?.source !== "manual") return ""
      const { validUntil } = this.subscription
      const until = validUntil
        ? `until ${new Date(validUntil).toLocaleDateString()}`
        : "open-ended"
      return `manual plan ${until}`
    },
    // The import gauge and, on Free, the transcription lots topping it up
    importQuotaLabel() {
      const gauge = this.usage?.capabilities?.["import.minutes"]
      if (!gauge) return "unknown (GET /cloud/usage failed)"
      const limit = gauge.limit == null ? "unlimited" : gauge.limit
      const bought = gauge.topUp ? ` (+${gauge.topUp.balance} min bought)` : ""
      return `${gauge.used} / ${limit} min this period${bought}`
    },
  },
  methods: {
    subscribe(planKey) {
      return this.startCheckout({
        organizationId: this.currentOrganization._id,
        planKey,
      })
    },
    // The org does not exist yet: created hidden by the API, revealed once paid
    async subscribeBusinessWithNewOrganization(event) {
      event.preventDefault()
      if (!this.testFields()) return
      await this.startCheckout({
        organizationName: this.newOrganizationName.value.trim(),
        // Not a positive integer: left out, the API applies the plan floor
        seats:
          Number(this.seats.value) >= 1
            ? Math.floor(this.seats.value)
            : undefined,
        planKey: "business",
      })
    },
    loadAll() {
      return Promise.all([
        this.loadCredits(),
        this.loadUsage(),
        this.loadLots(),
      ])
    },
    async loadCredits() {
      this.credits = (await apiGetCredits(this.currentOrganization._id)) ?? null
    },
    async loadUsage() {
      this.usage = (await apiGetUsage(this.currentOrganization._id)) ?? null
    },
    packsOfKind(kind) {
      return this.packs.filter((pack) => pack.kind === kind)
    },
    // Every lot of the org, live and transcription, and the subscription row,
    // through the backoffice route
    async loadLots() {
      const billing = await apiAdminGetOrgBilling(
        this.currentOrganization._id,
        { backoffice: true },
      )
      this.lots = billing?.lots ?? []
      this.subscription = billing?.subscription ?? null
    },
    // Plan billed outside Stripe: 409 when Stripe bills the org or its mode
    // is not normal, the raw response says why
    async setManualPlan(event) {
      event.preventDefault()
      const payload = buildManualPlanPayload({
        planKey: this.manualPlan.planKey,
        seats: this.manualPlanSeats.value,
        until: this.manualPlanUntil.value,
        reason: this.manualPlanReason.value,
      })
      const res = await this.run(
        `POST /cloud/admin/orgs/:id/plan ${JSON.stringify(payload)}`,
        () =>
          apiAdminSetManualPlan(
            this.currentOrganization._id,
            payload,
            { backoffice: true },
            { message: "manual plan set" },
          ),
      )
      if (res) await this.loadAll()
    },
    listOrganizations(enriched) {
      const query = { enriched, limit: 20 }
      return this.run(`GET /cloud/admin/orgs ${JSON.stringify(query)}`, () =>
        apiAdminListOrgs(
          query,
          { backoffice: true },
          { message: "organizations listed" },
        ),
      )
    },
    showLedgerExport(format) {
      const query = {
        ...buildLedgerExportQuery({
          from: this.ledgerFrom.value,
          to: this.ledgerTo.value,
        }),
        format,
      }
      return this.run(
        `GET /cloud/admin/ledger.csv ${JSON.stringify(query)}`,
        () =>
          apiAdminGetLedgerExport(
            query,
            { backoffice: true },
            { message: "ledger exported" },
          ),
      )
    },
    lotLabel(lot) {
      const pack = lot.ref?.packKey ?? lot.source
      return `Refund ${pack} (${lot.kind}, ${lot.remaining}/${lot.minutes} min)`
    },
    // One call: shows the request, then the raw response or the error
    async run(label, call) {
      this.loading = true
      this.output = `${label} ...`
      try {
        const res = await call()
        if (typeof res === "string") {
          this.output = res
        } else {
          this.output = JSON.stringify(res ?? { error: "no response" }, null, 2)
        }
        return res
      } catch (error) {
        console.error(error)
        this.output = String(error)
        return null
      } finally {
        this.loading = false
      }
    },
    async refundLot(lotId) {
      await this.run(`POST /cloud/admin/orgs/:id/lots/${lotId}/refund`, () =>
        apiAdminRefundLot(
          this.currentOrganization._id,
          lotId,
          { backoffice: true },
          { message: "refund requested at Stripe" },
        ),
      )
      await this.loadAll()
    },
    // The change route takes the total seat count, so add on top of the current one
    async addSeats(count) {
      const seats = (this.usage?.seats ?? 0) + count
      await this.run(`POST /cloud/subscriptions/change seats=${seats}`, () =>
        apiChangeSubscription(
          this.currentOrganization._id,
          { seats },
          { message: "seats updated" },
        ),
      )
      await this.loadUsage()
    },
    packLabel(pack) {
      const price = formatCurrencyAmount(
        pack.amountCents,
        pack.currency,
        this.$i18n?.locale,
      )
      return `${pack.minutes} min (${price})`
    },
    // One-time payment through hosted Checkout, back here with ?type=credits
    buyPack(packKey) {
      return this.runAndRedirect(
        `POST /cloud/credits/checkout packKey=${packKey}`,
        () =>
          apiCreateCreditsCheckout(
            this.currentOrganization._id,
            { packKey, returnUrl: window.location.href },
            { message: "redirecting to Stripe Checkout" },
          ),
      )
    },
    async runAndRedirect(label, call) {
      const res = await this.run(label, call)
      if (res?.url) window.location.assign(res.url)
    },
    // Back here when the user leaves the portal
    openPortal() {
      return this.runAndRedirect("POST /cloud/portal", () =>
        apiCreatePortalSession(
          this.currentOrganization._id,
          { returnUrl: window.location.href },
          { message: "redirecting to the Stripe portal" },
        ),
      )
    },
    // Hosted Checkout, back to this page with ?type=subscription&status=success|cancel
    startCheckout(payload) {
      const body = { ...payload, returnUrl: window.location.href }
      return this.runAndRedirect(
        `POST /cloud/subscriptions ${JSON.stringify(payload)}`,
        () =>
          apiCreateCheckout(body, {
            message: "redirecting to Stripe Checkout",
          }),
      )
    },
    // Updates the Stripe subscription in place, no Checkout; a free plan cancels it
    async changePlan(planKey, immediate) {
      const res = await this.run(
        `POST /cloud/subscriptions/change planKey=${planKey}${immediate ? " immediate" : ""}`,
        () =>
          apiChangeSubscription(
            this.currentOrganization._id,
            { planKey, immediate },
            { message: "plan changed" },
          ),
      )
      if (res) await this.loadUsage()
    },
  },
}
</script>

<style lang="scss" scoped>
.dev-subscribe {
  &__row {
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
    margin-bottom: 0.5em;
  }
  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 0.5em;
  }
  &__balance {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.5em;
  }
  &__output {
    width: 100%;
    font-family: monospace;
    font-size: 0.8rem;
  }
}
</style>
