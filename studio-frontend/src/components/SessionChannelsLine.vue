<template>
  <tr>
    <td class="content-size">
      <img
        class="icon medium"
        :src="type"
        :alt="alternativeTextForType"
        :title="alternativeTextForType" />
    </td>
    <td><FormInput v-model="nameField.value" :field="nameField" /></td>
    <td>
      {{ profileName }}
    </td>
    <td>{{ languages }}</td>
    <td class="content-size">
      <button class="btn red-border" @click="removeChannel" type="button">
        <span class="icon remove"></span>
        <span class="label">{{ $t("session.channels_list.remove") }}</span>
      </button>
    </td>
  </tr>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import ArrayHeader from "./ArrayHeader.vue"
import FormInput from "./FormInput.vue"
import EMPTY_FIELD from "../const/emptyField"
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    type() {
      switch (this.item.type) {
        case "microsoft":
          return "/img/microsoft.png"
        default:
          return "/img/question.svg"
      }
    },
    alternativeTextForType() {
      return this.item.type || ""
    },
    profileName() {
      return this.item.profileName || ""
    },
    languages() {
      const langs_str = this.item.languages.map((lang) => lang.candidate)
      return langs_str.join(", ")
    },
    nameField: {
      get() {
        return {
          ...EMPTY_FIELD,
          value: this.item.name || "",
        }
      },
      set(value) {
        this.$emit("updateName", value)
      },
    },
  },
  mounted() {},
  methods: {
    removeChannel() {
      this.$emit("removeChannel")
    },
  },
  components: { Fragment, ArrayHeader, FormInput },
}
</script>
