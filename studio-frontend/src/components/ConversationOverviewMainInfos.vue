<template>
  <form @submit="update">
    <section>
      <h2>
        {{ $t("conversation_overview.main_information.title") }}
      </h2>
      <div></div>
      <FormInput
        inputFullWidth
        :field="nameField"
        v-model="nameField.value"
        :readonly="!canEdit" />
      <FormInput
        inputFullWidth
        :field="descriptionField"
        v-model="descriptionField.value"
        textarea
        :readonly="!canEdit" />
      <div v-if="templateName" class="form-field flex col">
        <label class="form-label">
          {{ $t("media_explorer.panel.template_label") }}
        </label>
        <div class="flex align-center gap-small">
          <span>{{ templateName }}</span>
          <Button
            v-if="canSessionInCurrentOrganization"
            variant="secondary"
            icon="plus"
            size="sm"
            :label="$t('media_explorer.panel.use_template_button')"
            :to="{
              name: 'conversations create',
              params: { organizationId: organizationId },
              query: { template: templateName },
            }" />
        </div>
      </div>
      <Button
        v-if="canEdit"
        type="submit"
        variant="primary"
        icon="check"
        :label="$t('conversation_overview.main_information.update_information_button')" />
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import { apiUpdateConversation } from "@/api/conversation"
import EMPTY_FIELD from "@/const/emptyField"
import { testName } from "@/tools/fields/testName"

import { formsMixin } from "@/mixins/forms.js"
import { conversationModelMixin } from "@/mixins/conversationModel.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"

import FormInput from "@/components/molecules/FormInput.vue"

export default {
  mixins: [formsMixin, conversationModelMixin, organizationPermissionsMixin],
  props: {
    conversation: {
      type: Object,
      required: true,
    },
    rootConversation: {
      type: Object,
      required: false,
    },
    channels: {
      type: Array,
      required: false,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      nameField: {
        ...EMPTY_FIELD,
        value: "",
        label: this.$t("conversation_overview.main_information.name_label"),
        testField: testName,
      },
      descriptionField: {
        ...EMPTY_FIELD,
        value: "",
        label: this.$t(
          "conversation_overview.main_information.description_label",
        ),
      },
      fields: ["nameField", "descriptionField"],
    }
  },
  mounted() {
    this.initFields()
  },
  computed: {
    templateName() {
      return (
        this.conversation?.metadata?.template ??
        this.rootConversation?.metadata?.template ??
        null
      )
    },
    organizationId() {
      return (
        this.conversation?.organization?.organizationId ??
        this.rootConversation?.organization?.organizationId
      )
    },
  },
  methods: {
    initFields() {
      this.nameField.value = this.name
      this.descriptionField.value = this.conversation.description
    },
    async update(e) {
      e.preventDefault()
      if (this.testFields()) {
        const res = await apiUpdateConversation(this.canonicalId, {
          description: this.descriptionField.value,
          name: this.nameField.value,
        })

        if (res.status === "error") {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t(
              "conversation_overview.main_information.error_notif",
            ),
            redirect: false,
          })
        } else {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.t(
              "conversation_overview.main_information.done_notif",
            ),
            redirect: false,
          })
        }
      }
      return false
    },
  },
  components: { Fragment, FormInput },
}
</script>
