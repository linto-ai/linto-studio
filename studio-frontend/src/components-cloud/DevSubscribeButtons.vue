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

    <h3>Buy live minutes (Premium or Business only)</h3>
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
        v-for="pack in livePacks"
        :key="pack.packKey"
        variant="secondary"
        size="sm"
        :disabled="loading"
        :label="packLabel(pack)"
        @click="buyPack(pack.packKey)" />
      <span v-if="livePacks.length === 0">No live pack from /cloud/packs</span>
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
  apiChangeSubscription,
  apiGetPacks,
  apiGetCredits,
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
    this.packs = (await apiGetPacks()) ?? []
  },
  watch: {
    "currentOrganization._id": "loadCredits",
  },
  computed: {
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
    livePacks() {
      return this.packs.filter((pack) => pack.kind === "live")
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
    packLabel(pack) {
      const price = formatCurrencyAmount(
        pack.amountCents,
        pack.currency,
        this.$i18n?.locale,
      )
      return `${pack.minutes} min (${price})`
    },
    // One-time payment through hosted Checkout, back here with ?type=credits
    async buyPack(packKey) {
      this.loading = true
      this.output = `POST /cloud/checkout/credits packKey=${packKey} ...`
      try {
        const res = await apiCreateCreditsCheckout(
          this.currentOrganization._id,
          { packKey, returnUrl: window.location.href },
          { message: "checkout failed" },
        )
        this.output = JSON.stringify(res ?? { error: "no response" }, null, 2)
        if (res?.url) window.location.assign(res.url)
      } catch (error) {
        console.error(error)
        this.output = String(error)
      } finally {
        this.loading = false
      }
    },
    async startCheckout(payload) {
      this.loading = true
      this.output = `POST /cloud/checkout ${JSON.stringify(payload)} ...`
      try {
        const res = await apiCreateCheckout(payload, {
          message: "checkout failed",
        })
        this.output = JSON.stringify(res, null, 2)
        if (res.url) window.location.assign(res.url)
      } catch (error) {
        console.error(error)
        this.output = String(error)
      } finally {
        this.loading = false
      }
    },
    // Updates the Stripe subscription in place, no Checkout
    async changePlan(planKey) {
      this.loading = true
      this.output = `POST /cloud/subscriptions/change planKey=${planKey} ...`
      try {
        const res = await apiChangeSubscription(
          this.currentOrganization._id,
          { planKey },
          { message: "plan changed" },
        )
        this.output = JSON.stringify(res ?? { error: "no response" }, null, 2)
      } catch (error) {
        console.error(error)
        this.output = String(error)
      } finally {
        this.loading = false
      }
    },
    async subscribeFree(planKey) {
      this.loading = true
      this.output = `POST /cloud/subscriptions planKey=${planKey} ...`
      try {
        const res = await apiCreateSubscription(
          this.currentOrganization._id,
          planKey,
          1,
          { message: "subscription failed" },
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
