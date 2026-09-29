<template>
  <dialog
    ref="dialog"
    class="m-sheet"
    :aria-label="title"
    @close="onNativeClose"
    @click="closeOnBackdrop">
    <div class="m-sheet__panel">
      <span class="m-sheet__handle" aria-hidden="true"></span>
      <h2 v-if="title" class="m-sheet__title">{{ title }}</h2>
      <slot />
    </div>
  </dialog>
</template>

<script>
// Native <dialog> shown from the bottom. v-model drives showModal()/close();
// the watch is the only way to reach the imperative dialog API.
export default {
  name: "BottomSheet",
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: "" },
  },
  watch: {
    value(open) {
      open ? this.open() : this.close()
    },
  },
  mounted() {
    if (this.value) this.open()
  },
  methods: {
    open() {
      if (!this.$refs.dialog.open) this.$refs.dialog.showModal()
    },
    close() {
      if (this.$refs.dialog.open) this.$refs.dialog.close()
    },
    onNativeClose() {
      this.$emit("input", false)
    },
    closeOnBackdrop(event) {
      if (event.target === this.$refs.dialog) this.close()
    },
  },
}
</script>

<style scoped>
.m-sheet {
  position: fixed;
  inset: auto 0 0 0;
  width: 100%;
  max-width: 100%;
  max-height: 85dvh;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
}

.m-sheet::backdrop {
  background: var(--m-scrim);
}

.m-sheet__panel {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--m-space-2) var(--m-space-4)
    calc(var(--m-space-6) + var(--m-safe-bottom));
  border-radius: var(--m-radius-lg) var(--m-radius-lg) 0 0;
  background: var(--m-surface);
  box-shadow: var(--m-shadow-sheet);
}

.m-sheet__handle {
  width: 36px;
  height: 4px;
  margin: 0 auto;
  border-radius: 2px;
  background: var(--m-border);
}

.m-sheet__title {
  font-size: var(--m-font-size-lg);
}
</style>
