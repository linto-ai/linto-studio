<template>
  <div class="modal-wrapper flex col visible">
    <div
      aria-modal="true"
      aria-labelledby="modal-title"
      class="modal flex col"
      :class="{
        'modal--small': small,
        'modal--full-height': fullHeight,
        [customModalClass]: true,
      }"
      v-click-outside="close">
      <div class="modal-header flex row align-center">
        <span class="title flex1" id="modal-title">{{ title }}</span>
        <button class="btn transparent" @click="close()">
          <span class="icon close" :title="$t('modal.close_title')"></span>
        </button>
      </div>
      <div class="modal-body flex col flex1">
        <slot></slot>
      </div>
      <div class="modal-footer flex row gap-small">
        <button class="btn" @click="close()" v-if="cancelButton">
          <span class="label">{{ $t("modal.cancel") }}</span>
        </button>
        <button :class="customClass" @click="apply" v-if="!noApply">
          <span class="icon apply"></span>
          <span class="label">{{ actionBtnLabel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true },
    actionBtnLabel: { type: String, required: true },
    cancelButton: { type: Boolean, default: true },
    small: { type: Boolean, default: false },
    fullHeight: { type: Boolean, default: false },
    customClassButton: { type: Object, default: () => ({}) },
    noApply: { type: Boolean, default: false },
    customModalClass: { type: String, default: "" },
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        this.close()
      }
    }
  },
  computed: {
    customClass() {
      if (
        this.customClassButton &&
        Object.keys(this.customClassButton).length > 0
      ) {
        return this.customClassButton
      }
      return {
        green: true,
      }
    },
  },
  methods: {
    close(e) {
      this.$emit("on-cancel")
      e?.preventDefault()
    },
    apply(e) {
      this.$emit("on-confirm")
      e?.preventDefault()
    },
  },
}
</script>
