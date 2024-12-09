<template>
  <MainContent sidebar box>
    <form @submit="setupSession">
      <h2>{{ $t("quick_session.setup_visio.title") }}</h2>
      <p>
        {{ $t("quick_session.setup_visio.subtitle") }}
      </p>

      <div class="form-field flex col">
        <label for="type-visio-selector">
          {{ visioTypeField.label }}
        </label>
        <select v-model="visioTypeField.value" id="type-visio-selector">
          <option
            v-for="service in supportedVisioServices"
            :key="service"
            :value="service">
            {{ service }}
          </option>
        </select>
      </div>

      <FormInput
        :field="visioLinkField"
        v-model="visioLinkField.value"
        class="fullwidth"
        placeholder="Jitsi link"
        required />

      <div class="flex medium-margin-top">
        <button class="btn secondary" @click="backToStart" type="button">
          <span class="icon back"></span>
          <span class="label">{{ $t("quick_session.setup_visio.back") }}</span>
        </button>
        <div class="flex1"></div>
        <button class="btn" type="submit">
          <span class="icon apply"></span>
          <span class="label">
            {{ $t("quick_session.setup_visio.join_meeting") }}
          </span>
        </button>
      </div>
    </form>
  </MainContent>
</template>
<script>
import EMPTY_FIELD from "../const/emptyField.js"
import { bus } from "../main.js"

import MainContent from "@/components/MainContent.vue"
import FormInput from "@/components/FormInput.vue"

import { testVisioUrl } from "@/tools/fields/testVisioUrl"

export default {
  props: {},
  data() {
    return {
      visioTypeField: {
        ...EMPTY_FIELD,
        value: "jitsi",
        label: this.$i18n.t("quick_session.setup_visio.type_label"),
      },
      visioLinkField: {
        ...EMPTY_FIELD,
        value: "",
        customParams: { placeholder: "https://meet.jit.si/..." },
        label: this.$i18n.t("quick_session.setup_visio.link_label"),
        error: null,
        valid: false,
        testField: testVisioUrl,
      },
      supportedVisioServices: ["jitsi"],
    }
  },
  mounted() {},
  methods: {
    setupSession(event) {
      event.preventDefault()
      console.log("setupSession", this.visioLinkField.value)
      this.$emit("start-session", {
        source: "visio",
        visioType: this.visioTypeField.value,
        visioLink: this.visioLinkField.value,
      })
      return false
    },
    backToStart() {
      this.$emit("back")
    },
  },
  components: {
    MainContent,
    FormInput,
  },
}
</script>
