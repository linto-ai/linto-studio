<template>
  <section class="flex col gap-small">
    <FormInput
      :field="linkField"
      :value="value.url"
      inputFullWidth
      @input="updateUrl" />
    <fieldset class="visio-fields__providers flex col gap-small">
      <legend class="form-label">
        {{ $t("quick_session.setup_visio.type_label") }}
      </legend>
      <div class="flex gap-small wrap">
        <FilterChip
          v-for="provider in providers"
          :key="provider.value"
          :label="provider.label"
          :icon="provider.icon"
          :image="provider.image"
          :chipValue="provider.value"
          :disabled="!isUrlValid"
          :value="value.provider"
          @input="update({ provider: $event })" />
      </div>
    </fieldset>
    <NotificationBanner
      v-if="value.provider"
      variant="warning"
      icon="info"
      align="start">
      {{ $t(`quick_session.setup_visio.helper.${value.provider}`) }}
    </NotificationBanner>
  </section>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField.js"
import VISIO_PROVIDERS from "@/const/visioProviders.js"
import { isValidUrl } from "@/tools/isValidUrl"
import { inferVisioProvider } from "@/tools/session/inferVisioProvider"

import FormInput from "@/components/molecules/FormInput.vue"
import FilterChip from "@/components/atoms/FilterChip.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

export default {
  name: "VisioFields",
  components: { FormInput, FilterChip, NotificationBanner },
  props: {
    // draft.visio
    value: { type: Object, required: true },
    // Why the provider refuses this URL
    urlError: { type: String, default: null },
  },
  data() {
    return {
      providers: VISIO_PROVIDERS,
      // The value reaches back through the modal after a few renders: what was
      // typed last is known here first.
      lastUrl: this.value.url,
    }
  },
  computed: {
    isUrlValid() {
      return isValidUrl(this.value.url)
    },
    linkField() {
      return {
        ...EMPTY_FIELD,
        placeholder: "https://meet.jit.si/...",
        label: this.$t("quick_session.setup_visio.link_label"),
        leadingIcon: "link",
        error: this.urlError,
      }
    },
  },
  methods: {
    update(change) {
      this.$emit("input", { ...this.value, ...change })
    },
    // Inference only applies when it confidently matches a provider, so a
    // manual choice sticks otherwise.
    async updateUrl(url) {
      this.lastUrl = url
      this.update({ url })
      if (!isValidUrl(url)) return
      const provider = await inferVisioProvider(url)
      if (provider && url === this.lastUrl) this.update({ url, provider })
    },
  },
}
</script>
<style lang="scss" scoped>
.visio-fields__providers {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
