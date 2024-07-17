<template>
  <section>
    <h2>{{ $t("conversation_creation.url_tab.main_info_title") }}</h2>
    <FormInput :field="nameFields" v-model="nameFields.value" />
    <FormInput :field="linkFields" v-model="linkFields.value" />
    <!-- <FormCheckbox
      disabled
      :field="liveFields"
      v-model="liveFields.value"
      switchDisplay /> -->
  </section>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import FormInput from "./FormInput.vue"
import FormCheckbox from "./FormCheckbox.vue"
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    linkFields() {
      return this.value[0]
    },
    liveFields() {
      return this.value[1]
    },
    nameFields() {
      return this.value[2]
    },
  },
  mounted() {},
  methods: {},
  components: { Fragment, FormInput, FormCheckbox },
}
</script>
