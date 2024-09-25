<template>
  <tr @click="onClickLine">
    <td class="content-size">
      <Checkbox
        class="line-selector"
        :checkboxValue="id_profile"
        v-model="selectedProfiles" />
      <!-- <input type="checkbox" :value="profile" v-model="selectedProfiles" /> -->
    </td>
    <td class="content-size center-text">
      <img
        class="icon medium"
        :src="type"
        :alt="alternativeTextForType"
        :title="alternativeTextForType" />
    </td>
    <td>{{ name }}</td>
    <td>{{ description }}</td>
    <td>{{ languages }}</td>
    <td>
      <CustomSelect
        multipleSelection
        v-model="selectedTranslations"
        :options="translationsOptions" />
    </td>
  </tr>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import ArrayHeader from "@/components/ArrayHeader.vue"
import CustomSelect from "@/components/CustomSelect.vue"
import Checkbox from "@/components/Checkbox.vue"

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
    profilesList: {
      type: Array,
      required: true,
    },
  },
  data() {
    console.log(this.profile.config.availableTranslations)
    const translations = this.profile?.config?.availableTranslations || []
    return {
      selectedTranslations: [],
      id_profile: this.profile.id,
      translationsOptions: {
        channels: translations.map((translation) => {
          return {
            value: translation,
            text: translation.toUpperCase(),
          }
        }),
      },
    }
  },
  watch: {
    selectedTranslations: {
      handler(value) {
        this.selectProfile()
        this.profile.translations = value // it uses shallow copy so profile from parent is updated (it's an optimisation feature instead of emiting update event...)
      },
      deep: true,
    },
  },
  computed: {
    selectedProfiles: {
      get() {
        return (
          this.value.map((profile) => {
            return profile.id
          }) || []
        )
      },
      set(value) {
        this.$emit(
          "input",
          value.map((id) => this.profilesList.find((p) => p.id === id)),
        )
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
        case "linto":
          return "/img/linto.svg"
        default:
          return "/img/question.svg"
      }
    },
    alternativeTextForType() {
      return this.profile.config.type || ""
    },
    languages() {
      const langs_str = this.profile.config.languages.map(
        (lang) => lang.candidate,
      )
      return langs_str.join(", ")
    },
  },
  methods: {
    // selectProfile(e) {
    //   if (e && e.target.classList.contains("no-propagation")) return
    //   // do same as checkbox
    //   this.selectedProfiles = this.selectedProfiles.includes(this.id_profile)
    //     ? this.selectedProfiles.filter(
    //         (profile_id) => profile_id !== this.id_profile,
    //       )
    //     : [...this.selectedProfiles, this.id_profile]
    // },

    selectProfile(e) {
      if (e && e.target.classList.contains("no-propagation")) return
      // do same as checkbox
      if (this.selectedProfiles.includes(this.id_profile)) {
        return
      }

      this.selectedProfiles = [...this.selectedProfiles, this.id_profile]
    },
    unSelectProfile(e) {
      if (e && e.target.classList.contains("no-propagation")) return
      // do same as checkbox
      if (!this.selectedProfiles.includes(this.id_profile)) {
        return
      }

      this.selectedProfiles = this.selectedProfiles.filter(
        (profile_id) => profile_id !== this.id_profile,
      )
    },
    onClickLine(e) {
      if (e && e.target.classList.contains("no-propagation")) return

      this.selectedProfiles = this.selectedProfiles.includes(this.id_profile)
        ? this.selectedProfiles.filter(
            (profile_id) => profile_id !== this.id_profile,
          )
        : [...this.selectedProfiles, this.id_profile]
    },
  },
  components: { Fragment, ArrayHeader, CustomSelect, Checkbox, CustomSelect },
}
</script>
