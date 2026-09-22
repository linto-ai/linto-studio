<template>
  <section class="dev-subscribe">
    <h2>Stripe test (dev only)</h2>
    <div class="dev-subscribe__row">
      <Button
        v-for="planKey in planKeys"
        :key="planKey"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="'Plan ' + planKey"
        @click="subscribe(planKey)" />
    </div>

    <h3>Change the current plan (billed organization only)</h3>
    <div class="dev-subscribe__row">
      <Button
        v-for="planKey in paidPlanKeys"
        :key="'change-' + planKey"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="'Switch to ' + planKey"
        @click="changePlan(planKey)" />
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
      <Button
        variant="secondary"
        size="xs"
        :disabled="loading"
        label="Refresh"
        @click="loadUsage" />
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
      <Button
        variant="secondary"
        size="xs"
        :disabled="loading"
        label="Refresh"
        @click="loadCredits" />
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
      <Button
        variant="secondary"
        size="xs"
        :disabled="loading"
        label="Refresh"
        @click="loadUsage" />
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
    <p class="dev-subscribe__balance">
      Lots of the organization
      <Button
        variant="secondary"
        size="xs"
        :disabled="loading"
        label="Refresh"
        @click="loadLots" />
    </p>
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
        size="sm"
        :disabled="loading"
        label="Checkout Business, new organization" />
    </form>

    <textarea
      class="dev-subscribe__output"
      readonly
      rows="12"
      :value="output"></textarea>
  </section>
</template>

<script>
// Dev helper: POST /cloud/subscriptions for the current org, shows the raw
// response and copies it to the clipboard (clientSecret first when present).
import {
  apiCreateSubscription,
  apiCreateCheckout,
  apiCreateCreditsCheckout,
  apiCreatePortalSession,
  apiChangeSubscription,
  apiGetPacks,
  apiGetCredits,
  apiGetUsage,
  apiAdminGetOrgBilling,
  apiAdminRefundLot,
} from "@/api/cloud.js"
import { formatCurrencyAmount } from "@/tools/formatCurrencyAmount.js"
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
      planKeys: ["free_payg", "premium", "business"],
      paidPlanKeys: ["premium", "business"],
      packs: [],
      credits: null,
      usage: null,
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
    }
  },
  async mounted() {
    this.loadCredits()
    this.loadUsage()
    this.loadLots()
    this.packs = (await apiGetPacks()) ?? []
  },
  watch: {
    "currentOrganization._id"() {
      this.loadCredits()
      this.loadUsage()
      this.loadLots()
    },
  },
  computed: {
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
    // Paid plans go through hosted Checkout and come back to this page with
    // ?type=subscription&status=success|cancel. Free binds directly.
    async subscribe(planKey) {
      if (planKey === "free_payg") return this.subscribeFree(planKey)
      await this.startCheckout({
        organizationId: this.currentOrganization._id,
        planKey,
        returnUrl: window.location.href,
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
        returnUrl: window.location.href,
      })
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
    // Every lot of the org, live and transcription, through the backoffice route
    async loadLots() {
      const billing = await apiAdminGetOrgBilling(
        this.currentOrganization._id,
        null,
        { backoffice: true },
      )
      this.lots = billing?.lots ?? []
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
        this.output = JSON.stringify(res ?? { error: "no response" }, null, 2)
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
          { message: "refund requested at Stripe" },
          { backoffice: true },
        ),
      )
      await Promise.all([this.loadLots(), this.loadCredits(), this.loadUsage()])
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
        `POST /cloud/checkout/credits packKey=${packKey}`,
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
          window.location.href,
          { message: "redirecting to the Stripe portal" },
        ),
      )
    },
    startCheckout(payload) {
      return this.runAndRedirect(
        `POST /cloud/checkout ${JSON.stringify(payload)}`,
        () =>
          apiCreateCheckout(payload, {
            message: "redirecting to Stripe Checkout",
          }),
      )
    },
    // Updates the Stripe subscription in place, no Checkout
    async changePlan(planKey) {
      await this.run(
        `POST /cloud/subscriptions/change planKey=${planKey}`,
        () =>
          apiChangeSubscription(
            this.currentOrganization._id,
            { planKey },
            { message: "plan changed" },
          ),
      )
    },
    async subscribeFree(planKey) {
      this.loading = true
      this.output = `POST /cloud/subscriptions planKey=${planKey} ...`
      try {
        const res = await apiCreateSubscription(
          this.currentOrganization._id,
          planKey,
          1,
          { message: "subscribed" },
        )
        const json = JSON.stringify(res ?? { error: "no response" }, null, 2)
        const command = res?.clientSecret
          ? `./stripe.sh -c ${res.clientSecret}`
          : "# no clientSecret in the response, nothing to confirm"
        this.output = `${command}\n\n##API info\n${json}`
        await navigator.clipboard.writeText(this.output)
      } catch (error) {
        console.error(error)
        this.output = String(error)
      } finally {
        this.loading = false
      }
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
