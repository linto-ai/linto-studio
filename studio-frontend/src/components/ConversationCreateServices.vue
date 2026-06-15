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
import { meetsSecurityLevel } from "@/tools/filterBySecurityLevel"

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
    // Accessible models first, then by ascending `order`. Stable: models with
    // no (or an equal) order keep their registration order. Unset/invalid order
    // is treated as +Infinity so explicitly-ordered models always come first.
    sortedServices() {
      return this.serviceList
        .map((service, index) => ({
          service,
          index,
          disabled: this.isSecurityDisabled(service),
          order: this.serviceOrder(service),
        }))
        .sort((a, b) => {
          if (a.disabled !== b.disabled) return a.disabled ? 1 : -1
          if (a.order !== b.order) return a.order - b.order
          return a.index - b.index
        })
        .map((x) => x.service)
    },
    // The recommended model = the single accessible model with the lowest
    // EXPLICIT order. No explicit order anywhere, or a tie for the lowest one,
    // means no recommendation (graceful default / graceful ties).
    recommendedServiceName() {
      const ordered = this.serviceList
        .filter((s) => !this.isSecurityDisabled(s))
        .map((s) => ({ s, order: this.serviceOrder(s) }))
        .filter((x) => Number.isFinite(x.order))
      if (ordered.length === 0) return null
      const min = Math.min(...ordered.map((x) => x.order))
      const top = ordered.filter((x) => x.order === min)
      return top.length === 1 ? top[0].s.serviceName : null
    },
    // The currently chosen service object. An explicit user pick wins (when
    // still accessible); otherwise default to the recommended model, else the
    // first accessible one (lowest order). This keeps the default on the
    // recommended model regardless of the raw API list order, and never lets a
    // security-disabled model become the prominent hero card.
    selectedService() {
      const list = this.sortedServices
      if (!list.length) return null
      const accessible = list.filter((s) => !this.isSecurityDisabled(s))
      if (this.userPickedServiceName) {
        const picked = accessible.find(
          (s) => s.serviceName === this.userPickedServiceName,
        )
        if (picked) return picked
      }
      const recommended = accessible.find(
        (s) => s.serviceName === this.recommendedServiceName,
      )
      return recommended || accessible[0] || list[0]
    },
  },
  methods: {
    isSecurityDisabled(service) {
      return this.disabledServiceNames.has(service.serviceName)
    },
    // Parse the optional display order. Unset/invalid → +Infinity (sorts last).
    serviceOrder(service) {
      const n = parseInt(service?.order, 10)
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
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
      this.userPickedServiceName = service.serviceName
      this.$emit("input", config)
      this.pickerOpen = false
    },
  },
  data() {
    return {
      pickerOpen: false,
      // Set when the user explicitly picks a model in the picker; lets the
      // default selection track the recommended model until then.
      userPickedServiceName: null,
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
