<template>
  <div
    class="form-field flex row gap-small wrap"
    v-if="!loading && serviceList.length > 0">
    <ConversationCreateService
      v-for="(service, index) in sortedServices"
      :key="service.host"
      :value="service"
      @select="select(index, $event)"
      :selected="value && service.serviceName == value.serviceName"
      :multiTrack="multiTrack"
      :securityDisabled="isSecurityDisabled(service)"
      role="listbox" />
  </div>
  <div v-else-if="!loading">
    {{ $t("conversation.transcription_service_list_empty") }}
  </div>
  <div v-else class="flex1 relative" style="min-height: 250px; width: 300px">
    <loading title="Loading service list"></loading>
  </div>
</template>
<script>
import EMPTY_FIELD from "../const/emptyField"
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
  },
  methods: {
    select(index, value) {
      if (this.disabled) return
      this.indexSelected = index
      this.$emit("input", value)
    },
    isSecurityDisabled(service) {
      return this.disabledServiceNames.has(service.serviceName)
    },
  },
  data() {
    return {
      diarization: { ...EMPTY_FIELD },
      punctuation: { ...EMPTY_FIELD },
      indexSelected: -1,
    }
  },
  components: {
    ConversationCreateService,
    Loading,
  },
}
</script>
