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
    <td v-if="from === 'formCreateSession'">
      {{ profileName }}
    </td>
    <td v-if="from === 'sessionSettings'">
      <pre>{{ endpoint }}</pre>
    </td>
    <td v-if="from === 'sessionSettings'">
      <pre>{{ stream_status }}</pre>
    </td>
    <td v-if="from === 'sessionSettings'">{{ transcriber_status }}</td>
    <td>{{ languages }}</td>
    <td class="content-size" v-if="from === 'formCreateSession'">
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
    from: {
      type: String,
      default: "formCreateSession", // formCreateSession, sessionSettings
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
      const langs_str = this.item.languages || []
      return langs_str.join(", ")
    },
    endpoint() {
      return this.item.stream_endpoint || ""
    },
    stream_status() {
      return this.item.stream_status || ""
    },
    transcriber_status() {
      return this.item.transcriber_status || ""
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
