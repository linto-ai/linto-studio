<template>
  <div class="login-form-container flex col">
    <form id="app-login" class="flex col" @submit="createOrganisation">
      <h2>{{ $t("no_orga.title") }}</h2>
      <p>{{ $t("no_orga.subtitle") }}</p>
      <FormInput
        v-model="orgaName.value"
        :field="orgaName"
        inputId="organisation-name"
        required />
      <button type="submit" class="btn green" v-if="state !== 'sending'">
        <span class="label"> {{ $t("no_orga.create") }} </span>
        <span class="icon apply"></span>
      </button>

      <button type="submit" class="btn green" disabled v-else>
        <span class="label"> {{ $t("no_orga.creating") }} </span>
        <span class="icon loading"></span>
      </button>
    </form>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import EMPTY_FIELD from "@/const/emptyField"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { formsMixin } from "@/mixins/forms.js"

import FormInput from "../components/FormInput.vue"
import { apiCreateOrganisation } from "../api/organisation"

export default {
  mixins: [formsMixin],
  props: {},
  data() {
    return {
      fields: ["orgaName"],
      orgaName: {
        ...EMPTY_FIELD,
        value: "",
        testField: testFieldEmpty,
        autocomplete: "off",
        label: this.$t("no_orga.label"),
      },
      state: "idle",
    }
  },
  mounted() {},
  methods: {
    async createOrganisation(event) {
      event?.preventDefault()
      if (this.testFields()) {
        this.state = "sending"
        let res = await apiCreateOrganisation({ name: this.orgaName.value })
        if (res.status == "error") {
          this.orgaName.error = "Name already exist"
          this.state = "idle"
        } else {
          window.location.href = "/"
        }
      }
    },
  },
  components: { Fragment, FormInput },
}
</script>
