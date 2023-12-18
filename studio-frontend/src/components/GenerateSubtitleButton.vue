<template>
  <div>
    <button
      id="generate-subtitle-btn"
      class="btn green"
      @click="openGenerateModal"
      v-if="canEdit">
      <span class="icon new"></span>
      <span class="label">{{
        $t("conversation.subtitles.generate_subs")
      }}</span>
    </button>
    <ModalGenerateSubtitle
      v-if="generate"
      @on-close="closeGenerateModal"></ModalGenerateSubtitle>
  </div>
</template>
<script>
import ModalGenerateSubtitle from "./ModalGenerateSubtitle.vue"
export default {
  props: {
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      generate: false,
    }
  },
  methods: {
    openGenerateModal() {
      this.generate = true
    },
    closeGenerateModal() {
      this.generate = false
    },
  },
  components: {
    ModalGenerateSubtitle,
  },
}
</script>
