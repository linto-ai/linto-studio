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
import { apiCreateSubscription, apiCreateCheckout } from "@/api/cloud.js"
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
  &__output {
    width: 100%;
    font-family: monospace;
    font-size: 0.8rem;
  }
}
</style>
