<template>
  <!-- Compact model picker. `v-model` is the selected service name: it flows down
       to highlight the active row and up when the user picks another model. -->
  <div class="service-picker">
    <div class="service-picker__header">
      <span class="service-picker__title">
        {{ $t("conversation.transcription.choose_model") }}
      </span>
      <Button
        v-if="cancellable"
        variant="text"
        size="sm"
        type="button"
        icon="x"
        :label="$t('conversation.transcription.cancel_change_model')"
        @click="$emit('cancel')" />
    </div>
    <div
      class="service-picker__list"
      role="listbox"
      :aria-label="$t('conversation.transcription.choose_model')">
      <ServicePickerLine
        v-for="item in services"
        :key="item.service.serviceName"
        :value="item.service"
        :recommended="item.recommended"
        :disabled="item.disabled"
        :selected="item.service.serviceName === value"
        @pick="$emit('input', item.service.serviceName)" />
    </div>
  </div>
</template>
<script>
import ServicePickerLine from "./ServicePickerLine.vue"

export default {
  props: {
    // Enriched models to list: { service, recommended, disabled }.
    services: {
      type: Array,
      required: true,
    },
    // The currently selected service name (v-model).
    value: {
      type: String,
      default: null,
    },
    // Show the cancel button (there is a current selection to fall back to).
    cancellable: {
      type: Boolean,
      default: false,
    },
  },
  components: { ServicePickerLine },
}
</script>
<style lang="scss" scoped>
.service-picker {
  border: var(--border-block);
  border-radius: 8px;
  overflow: hidden;
  max-width: 600px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--background-app);
    border-bottom: 1px solid var(--neutral-20);
  }

  &__title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-secondary);
  }

  &__list {
    display: flex;
    flex-direction: column;
  }
}
</style>
