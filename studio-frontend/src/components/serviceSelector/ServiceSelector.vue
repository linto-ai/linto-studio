<template>
  <div class="service-selector">
    <template v-if="!loading && serviceList.length > 0">
      <!-- Selected model, full configuration card. Kept mounted (v-show) while
           the picker is open so the user's options are never lost; :key forces a
           clean remount only when the chosen model actually changes. -->
      <ServiceEditor
        v-if="selectedService"
        v-show="!pickerOpen"
        ref="editor"
        :key="selectedService.serviceName"
        :value="selectedService"
        :selected="true"
        :recommended="isRecommended(selectedService)"
        :showChangeModel="serviceList.length > 1"
        :multiTrack="multiTrack"
        :securityDisabled="isSecurityDisabled(selectedService)"
        @select="onServiceConfig"
        @change-model="pickerOpen = true" />

      <!-- No model meets the chosen confidentiality level -->
      <div v-else-if="!pickerOpen" class="service-selector__none">
        <ph-icon name="lock-simple" size="md" />
        <span>{{ $t("conversation.transcription.no_model_for_level") }}</span>
        <Button
          v-if="serviceList.length > 0"
          variant="text"
          size="sm"
          type="button"
          :label="$t('conversation.transcription.change_model')"
          @click="pickerOpen = true" />
      </div>

      <!-- Model picker (compact list, shown on "Changer de modèle") -->
      <ServicePicker
        v-show="pickerOpen"
        v-model="pickedServiceName"
        :services="pickerServices"
        :cancellable="Boolean(selectedService)"
        @cancel="pickerOpen = false" />
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
import ServiceEditor from "./ServiceEditor.vue"
import ServicePicker from "./ServicePicker.vue"
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
    // Enriched list handed to the picker: stays purely presentational.
    pickerServices() {
      return this.sortedServices.map((service) => ({
        service,
        recommended: this.isRecommended(service),
        disabled: this.isSecurityDisabled(service),
      }))
    },
    // v-model bridge for the picker. Down: the resolved selected name (so the
    // right row is highlighted). Up: records the user's explicit pick and closes
    // the picker. Security-locked / unknown picks are ignored.
    pickedServiceName: {
      get() {
        return this.selectedService?.serviceName ?? null
      },
      set(name) {
        if (this.disabled) return
        const service = this.serviceList.find((s) => s.serviceName === name)
        if (!service || this.isSecurityDisabled(service)) return
        this.userPickedServiceName = name
        this.pickerOpen = false
        // Reveal the freshly selected editor, then keep it in view while its
        // height settles (the ResizeObserver follows until the user scrolls).
        this.followEditor = true
        this.$nextTick(() => this.scrollEditorIntoView())
      },
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
      // null when no model meets the chosen confidentiality level — the hero
      // card is never a locked model; the template shows a dedicated message.
      return recommended || accessible[0] || null
    },
  },
  methods: {
    // Bring the editor card into view. Smooth for the initial reveal, instant
    // for the follow-up resize re-scrolls so animations don't pile up.
    scrollEditorIntoView(behavior = "smooth") {
      const el = this.$refs.editor?.$el
      el?.scrollIntoView({ behavior, block: "center" })
    },
    // (Re)attach the ResizeObserver to the current editor element. Needed after
    // every model switch since the `:key` remounts the component (new $el).
    observeEditor() {
      this.$nextTick(() => {
        const el = this.$refs.editor?.$el
        if (!el || !this._resizeObserver) return
        this._resizeObserver.disconnect()
        this._resizeObserver.observe(el)
      })
    },
    // The user took over scrolling — stop auto-following the editor's height.
    stopFollowingEditor() {
      this.followEditor = false
    },
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
    onServiceConfig(config) {
      if (this.disabled) return
      // Never let a security-disabled hero card become the form value.
      if (this.selectedService && this.isSecurityDisabled(this.selectedService))
        return
      this.$emit("input", config)
    },
  },
  data() {
    return {
      pickerOpen: false,
      // Set when the user explicitly picks a model in the picker; lets the
      // default selection track the recommended model until then.
      userPickedServiceName: null,
      // While true, the ResizeObserver re-scrolls the editor into view as its
      // height changes. Cleared on the user's first manual scroll.
      followEditor: false,
    }
  },
  watch: {
    // The editor remounts (new $el) whenever the chosen model changes.
    "selectedService.serviceName"() {
      this.observeEditor()
    },
  },
  mounted() {
    this._resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.scrollEditorIntoView("auto"))
    })
    this.observeEditor()
  },
  beforeDestroy() {
    this._resizeObserver?.disconnect()
  },
  components: {
    ServiceEditor,
    ServicePicker,
    Loading,
  },
}
</script>
<style lang="scss" scoped>
.service-selector {
  // Keep the card readable on wide screens instead of stretching full width.
  //max-width: 680px;

  &__none {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    border: 1px dashed var(--neutral-20);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }
}
</style>
