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
      <FormInput
        :field="invitationEmails"
        v-model="invitationEmails.value"
        textarea />
      <p class="dev-subscribe__seats">
        Seats requested: {{ requestedSeats }} (you + {{ invitedCount }}
        invited), the plan floor applies server-side
      </p>
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
import { splitCommaList } from "@/tools/splitCommaList.js"
import { isValidEmail } from "@/tools/isValidEmail.js"
import FormInput from "@/components/molecules/FormInput.vue"

function parseEmails(text) {
  const items = splitCommaList(text).map((item) => item.toLowerCase())
  return {
    emails: items.filter(isValidEmail),
    invalid: items.filter((item) => !isValidEmail(item)),
  }
}

function testInvitationEmails(field, t) {
  const { invalid } = parseEmails(field.value)
  field.valid = invalid.length === 0
  field.error = field.valid
    ? null
    : `${t("error.invalid_email")}: ${invalid.join(", ")}`
  return field.valid
}

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
      fields: ["newOrganizationName", "invitationEmails"],
      newOrganizationName: {
        ...EMPTY_FIELD,
        label: "Organization name",
        testField: testName,
      },
      invitationEmails: {
        ...EMPTY_FIELD,
        label: "Members to invite (emails, one per line or comma separated)",
        value: "alice@example.com\nbob@example.com, carol@example.com",
        testField: testInvitationEmails,
      },
    }
  },
  computed: {
    invitedCount() {
      return parseEmails(this.invitationEmails.value).emails.length
    },
    requestedSeats() {
      return 1 + this.invitedCount
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
        invitations: parseEmails(this.invitationEmails.value).emails,
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
        this.output = JSON.stringify(res ?? { error: "no response" }, null, 2)
        if (res?.url) window.location.assign(res.url)
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
  &__seats {
    margin: 0;
  }
  &__output {
    width: 100%;
    font-family: monospace;
    font-size: 0.8rem;
  }
}
</style>
