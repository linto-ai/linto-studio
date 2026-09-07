<template>
  <Modal
    v-model="proxy"
    :title="$t('publish.publication.title')"
    :withActions="false"
    size="lg">
    <template #content>
      <PublicationSection
        :jobId="jobId"
        :conversationId="conversationId"
        :organizationId="organizationId"
        :serviceId="serviceId"
        :conversationName="conversationName"
        :versionNumber="versionNumber"
        hideHeader
        @preview-close="proxy = false" />
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import PublicationSection from "@/components/PublicationSection.vue"

export default {
  name: "PublicationModal",
  components: { Modal, PublicationSection },
  props: {
    value: { type: Boolean, default: false },
    jobId: { type: String, default: null },
    conversationId: { type: String, default: null },
    organizationId: { type: String, default: null },
    serviceId: { type: String, default: null },
    conversationName: { type: String, default: "export" },
    versionNumber: { type: Number, default: null },
  },
  computed: {
    proxy: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit("input", v)
      },
    },
  },
}
</script>
