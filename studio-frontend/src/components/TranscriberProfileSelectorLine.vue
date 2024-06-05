<template>
  <tr @click="selectProfile">
    <td>
      <input type="checkbox" :value="profile" v-model="selectedProfiles" />
    </td>
    <td>
      <img
        class="icon"
        :src="type"
        :alt="alternativeTextForType"
        :title="alternativeTextForType" />
    </td>
    <td>{{ name }}</td>
    <td>{{ description }}</td>
    <td>{{ languages }}</td>
  </tr>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import ArrayHeader from "./ArrayHeader.vue"
import { lang } from "moment"

export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    selectedProfiles: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    sortListKey() {
      return "profileSelector"
    },
    name() {
      return this.profile.config.name || ""
    },
    description() {
      return this.profile.config.description || ""
    },
    type() {
      //this.profile.config.type || ""
      switch (this.profile.config.type) {
        case "microsoft":
          return "/img/microsoft.png"
        default:
          return "/img/question.svg"
      }
    },
    alternativeTextForType() {
      return this.profile.config.type || ""
    },
    languages() {
      const langs_str = this.profile.config.languages.map(
        (lang) => lang.candidate
      )
      return langs_str.join(", ")
    },
  },
  mounted() {},
  methods: {
    selectProfile() {
      // do same as checkbox
      this.selectedProfiles = this.selectedProfiles.includes(this.profile)
        ? this.selectedProfiles.filter((profile) => profile !== this.profile)
        : [...this.selectedProfiles, this.profile]
    },
  },
  components: { Fragment, ArrayHeader },
}
</script>
