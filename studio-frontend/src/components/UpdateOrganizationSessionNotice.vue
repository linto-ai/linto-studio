<template>
  <div>
    <Loading v-if="loading" block />
    <!-- Not editable when the stored text could not be read: saving an empty
         field would erase it. -->
    <p v-else-if="loadFailed">
      {{ $t("organisation.session_notice.load_error") }}
    </p>
    <form v-else @submit="saveSessionNotice">
      <section>
        <h2>{{ $t("organisation.session_notice.title") }}</h2>
        <p>{{ $t("organisation.session_notice.description") }}</p>

        <FormInput :field="content" v-model="content.value" textarea />

        <Button
          type="submit"
          variant="primary"
          size="md"
          :loading="saving"
          :label="$t('organisation.session_notice.save_button')" />
      </section>
    </form>
  </div>
</template>

<script>
import EMPTY_FIELD from "@/const/emptyField"
import { bus } from "@/tools/eventBus.js"

import {
  apiGetOrganisationSessionNotice,
  apiUpdateOrganisationSessionNotice,
} from "@/api/organisation.js"

import FormInput from "@/components/molecules/FormInput.vue"
// Loading is registered globally by the atoms plugin (components/atoms/index.js).

export default {
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      loadFailed: false,
      saving: false,
      content: {
        ...EMPTY_FIELD,
        label: this.$t("organisation.session_notice.content_label"),
      },
    }
  },
  computed: {
    organizationId() {
      return this.currentOrganization._id
    },
  },
  async mounted() {
    await this.fetchSessionNotice()
  },
  methods: {
    async fetchSessionNotice() {
      const req = await apiGetOrganisationSessionNotice(this.organizationId)
      if (req.status === "success") {
        this.content.value = req.data.content ?? ""
      } else {
        this.loadFailed = true
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("organisation.session_notice.load_error"),
          timeout: null,
          redirect: false,
        })
      }
      this.loading = false
    },
    async saveSessionNotice(event) {
      event.preventDefault()
      this.saving = true
      const req = await apiUpdateOrganisationSessionNotice(
        this.organizationId,
        this.content.value,
        {
          timeout: 3000,
          redirect: false,
          message: this.$t("organisation.session_notice.save_success"),
        },
      )
      if (req.status === "success") this.content.value = req.data.content ?? ""
      this.saving = false
    },
  },
  components: { FormInput },
}
</script>
