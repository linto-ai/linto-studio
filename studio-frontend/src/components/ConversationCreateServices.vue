<template>
  <div class="create-services">
    <template v-if="!loading && serviceList.length > 0">
      <!-- Selected model, full configuration card. Kept mounted (v-show) while
           the picker is open so the user's options are never lost; :key forces a
           clean remount only when the chosen model actually changes. -->
      <ConversationCreateService
        v-if="selectedService"
        v-show="!pickerOpen"
        :key="selectedService.serviceName"
        :value="selectedService"
        :selected="true"
        :recommended="isRecommended(selectedService)"
        :showChangeModel="serviceList.length > 1"
        :multiTrack="multiTrack"
        :securityDisabled="isSecurityDisabled(selectedService)"
        @select="onServiceConfig"
        @change-model="pickerOpen = true" />

      <!-- Model picker (compact list, shown on "Changer de modèle") -->
      <div v-show="pickerOpen" class="create-services__picker">
        <div class="create-services__picker-header">
          <span class="create-services__picker-title">
            {{ $t("conversation.transcription.choose_model") }}
          </span>
          <Button
            v-if="selectedService"
            variant="text"
            size="sm"
            type="button"
            icon="x"
            :label="$t('conversation.transcription.cancel_change_model')"
            @click="pickerOpen = false" />
        </div>
        <div
          class="create-services__picker-list"
          role="listbox"
          :aria-label="$t('conversation.transcription.choose_model')">
          <ConversationCreateService
            v-for="service in sortedServices"
            :key="service.host"
            compact
            :value="service"
            :recommended="isRecommended(service)"
            :selected="isSelectedService(service)"
            :securityDisabled="isSecurityDisabled(service)"
            @select="onPickModel(service, $event)" />
        </div>
      </div>
    </template>
    <div v-else-if="!loading">
      {{ $t("conversation.transcription_service_list_empty") }}
    </div>
    <div v-else class="flex1 relative" style="min-height: 250px; width: 300px">
      <loading title="Loading service list"></loading>
    </div>
  </div>
</template>
<script>
import ConversationCreateService from "@/components/ConversationCreateService.vue"
import Loading from "@/components/atoms/Loading.vue"
import {
  meetsSecurityLevel,
  sortDisabledLast,
} from "@/tools/filterBySecurityLevel"

export default {
  props: {
    serviceList: {
      type: Array,
      required: true,
    },
    value: {
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiTrack: {
      type: Boolean,
      required: false,
      default: false,
    },
    securityLevel: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    disabledServiceNames() {
      if (!this.securityLevel) return new Set()
      return new Set(
        this.serviceList
          .filter((service) => !meetsSecurityLevel(service, this.securityLevel))
          .map((service) => service.serviceName),
      )
    },
    sortedServices() {
      if (this.disabledServiceNames.size === 0) return this.serviceList
      return sortDisabledLast(this.serviceList, (service) =>
        this.isSecurityDisabled(service),
      )
    },
    // The recommended model = first enabled one (disabled pushed to the end).
    recommendedServiceName() {
      return this.sortedServices[0]?.serviceName
    },
    // The currently chosen service object, matched from the selected config.
    // Prefer a NON security-disabled model so a below-floor service never gets
    // promoted to the prominent (auto-emitting) hero card.
    selectedService() {
      const list = this.sortedServices
      if (!list.length) return null
      if (this.value) {
        const match = list.find(
          (s) =>
            s.serviceName === this.value.serviceName &&
            !this.isSecurityDisabled(s),
        )
        if (match) return match
      }
      return list.find((s) => !this.isSecurityDisabled(s)) || list[0]
    },
  },
  methods: {
    isSecurityDisabled(service) {
      return this.disabledServiceNames.has(service.serviceName)
    },
    isRecommended(service) {
      return service && service.serviceName === this.recommendedServiceName
    },
    isSelectedService(service) {
      return Boolean(
        this.value && service.serviceName === this.value.serviceName,
      )
    },
    onServiceConfig(config) {
      if (this.disabled) return
      // Never let a security-disabled hero card become the form value.
      if (
        this.selectedService &&
        this.isSecurityDisabled(this.selectedService)
      )
        return
      this.$emit("input", config)
    },
    onPickModel(service, config) {
      if (this.disabled || this.isSecurityDisabled(service)) return
      this.$emit("input", config)
      this.pickerOpen = false
    },
  },
  data() {
    return {
      pickerOpen: false,
    }
  },
  components: {
    ConversationCreateService,
    Loading,
  },
}
</script>

<style lang="scss" scoped>
.create-services {
  &__picker {
    border: var(--border-block);
    border-radius: 8px;
    overflow: hidden;
  }

  &__picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--background-app);
    border-bottom: 1px solid var(--neutral-20);
  }

  &__picker-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-secondary);
  }

  &__picker-list {
    display: flex;
    flex-direction: column;

    ::v-deep .service-card--compact {
      border: none;
      border-radius: 0;
      box-shadow: none;
      border-bottom: 1px solid var(--neutral-20);

      &:last-child {
        border-bottom: none;
      }

      &[selected] {
        background: var(--primary-soft);
      }
    }
  }
}
</style>
