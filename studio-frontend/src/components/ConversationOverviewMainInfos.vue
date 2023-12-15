<template>
  <form @submit="update">
    <section class="overview__main-section">
      <h2>
        {{ $t("conversation.information_label") }}
      </h2>
      <div></div>
      <FormInput :field="name" v-model="name.value" :readonly="!canEdit" />
      <FormInput
        :field="description"
        v-model="description.value"
        textarea
        :readonly="!canEdit" />
      <button type="submit" class="btn" v-if="canEdit">
        <span class="icon apply"></span>
        <span class="label">{{
          $t("conversation.update_information_button")
        }}</span>
      </button>
    </section>
  </form>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import EMPTY_FIELD from "../const/emptyField"
import FormInput from "./FormInput.vue"
import { formsMixin } from "@/mixins/forms.js"
import { apiUpdateConversation } from "../api/conversation"

export default {
  mixins: [formsMixin],
  props: {
    conversation: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      name: {
        ...EMPTY_FIELD,
        value: this.conversation.name,
        label: this.$t("conversation.name_label"),
      },
      description: {
        ...EMPTY_FIELD,
        value: this.conversation.description,
        label: this.$t("conversation.description_label"),
      },
      fields: ["name", "description"],
    }
  },
  mounted() {},
  methods: {
    async update(e) {
      e.preventDefault()
      if (this.testFields()) {
        const res = await apiUpdateConversation(this.conversation._id, {
          description: this.description.value,
          name: this.name.value,
        })

        console.log(res.status)
        if (res.status === "error") {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.t(
              "conversation.update_information_error_notif"
            ),
            redirect: false,
          })
        } else {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.t("conversation.update_information_done_notif"),
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
