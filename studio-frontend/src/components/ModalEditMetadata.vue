<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="confirm"
    :title="$t('session.settings_page.metadata.modal_title')"
    :actionBtnLabel="$t('session.settings_page.metadata.confirm_button')">
    <MetadataEditor :field="l_field" v-model="l_field.value"></MetadataEditor>
  </ModalNew>
</template>
<script>
import { bus } from "@/main.js"
import ModalNew from "@/components/ModalNew.vue"
import MetadataEditor from "@/components/MetadataEditor.vue"

export default {
  props: {
    field: {
      type: Object, // field.value is a list of [key, value] (from Object.entries())
      required: true,
    },
  },
  data() {
    return {
      l_field: structuredClone(this.field),
    }
  },
  mounted() {},
  methods: {
    confirm() {
      this.$emit("on-confirm", this.l_field.value)
    },
  },
  components: {
    ModalNew,
    MetadataEditor,
  },
}
</script>
