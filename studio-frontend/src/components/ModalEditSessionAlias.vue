<template>
  <ModalNew
    small
    isForm
    deleteButton
    @on-delete="deleteHandler"
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="confirm"
    :title="$t('session.settings_page.modal_edit_session_alias.title')"
    :actionBtnLabel="
      $t('session.settings_page.modal_edit_session_alias.confirm_button')
    ">
    <FormInput v-model="nameField.value" :field="nameField"> </FormInput>

    <LabeledValue
      :label="$t('session.settings_page.modal_edit_session_alias.link_label')"
      :value="`Studio.linto.app/6785238f0aee1be21684a9e1/sessions/${nameField.value}`" />
  </ModalNew>
</template>
<script>
import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import {
  createSessionAlias,
  apiUpdateSessionAliase,
  apiDeleteSessionAliase,
} from "@/api/session.js"

import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "@/components/ModalNew.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import LabeledValue from "@/components/atoms/LabeledValue.vue"

export default {
  mixins: [formsMixin],
  props: {
    organizationId: {
      type: String,
      default: "",
    },
    sessionId: {
      type: String,
      default: "",
    },
    sessionAliases: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      nameField: {
        ...EMPTY_FIELD,
        label: this.$t(
          "session.settings_page.modal_edit_session_alias.name_label",
        ),
        testField: testFieldEmpty,
        value: this.sessionAliases.length ? this.sessionAliases[0].name : "",
      },
      fields: ["nameField"],
    }
  },
  mounted() {},
  methods: {
    async confirm(e) {
      e?.preventDefault()
      if (this.testFields()) {
        let req
        if (this.sessionAliases.length == 0) {
          req = await createSessionAlias(this.organizationId, {
            sessionId: this.sessionId,
            name: this.nameField.value,
          })
        } else {
          req = await apiUpdateSessionAliase(
            this.organizationId,
            this.sessionAliases[0]._id,
            {
              sessionId: this.sessionId,
              name: this.nameField.value,
            },
          )
        }
        if (req.status === "success") {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$t(
              "session.settings_page.modal_edit_session_alias.success_message",
            ),
            redirect: false,
          })
          this.$emit("on-confirm")
        } else {
          if (req.error.response.status === 409) {
            this.nameField.error = this.$t(
              "session.settings_page.modal_edit_session_alias.name_already_exists",
            )
          }
          bus.$emit("app_notif", {
            status: "error",
            message: this.$t(
              "session.settings_page.modal_edit_session_alias.error_message",
            ),
            redirect: false,
          })
        }
      }
      return false
    },
    async deleteHandler() {
      const req = await apiDeleteSessionAliase(
        this.organizationId,
        this.sessionAliases[0]._id,
      )
      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t(
            "session.settings_page.modal_edit_session_alias.delete_success_message",
          ),
          redirect: false,
        })
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t(
            "session.settings_page.modal_edit_session_alias.delete_error_message",
          ),
          redirect: false,
        })
      }
      this.$emit("on-confirm")
    },
  },
  components: {
    ModalNew,
    LabeledValue,
    FormInput,
  },
}
</script>
