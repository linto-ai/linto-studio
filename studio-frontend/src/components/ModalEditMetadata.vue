<template>
  <Modal
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="confirm"
    v-model="isOpen"
    :title="$t('session.settings_page.metadata.modal_title')"
    :actionBtnLabel="$t('session.settings_page.metadata.confirm_button')">
    <MetadataEditor :field="l_field" v-model="l_field.value"></MetadataEditor>
  </Modal>
</template>
<script>
import { bus } from "@/main.js"
import Modal from "@/components/molecules/Modal.vue"
import MetadataEditor from "@/components/MetadataEditor.vue"

export default {
  props: {
    field: {
      type: Object, // field.value is a list of [key, value] (from Object.entries())
      required: true,
    },
    value: {
      type: Boolean,
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
      this.$emit(
        "on-confirm",
        this.l_field.value.filter((pair) => pair[0] !== ""),
      )
    },
  },
  computed: {
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  components: {
    Modal,
    MetadataEditor,
  },
}
</script>
