<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.publication.title')"
    @input="$emit('input', $event)">
    <p v-if="loading" class="m-muted">
      {{ $t("mobile.publication.loading") }}
    </p>
    <p v-else-if="!templates.length" class="m-muted">
      {{ $t("mobile.publication.empty") }}
    </p>
    <div v-else class="m-report-templates">
      <ListRow
        v-for="template in templates"
        :key="template.id"
        :icon="template.icon || 'file-text'"
        :label="templateName(template)"
        :hint="templateHint(template)"
        :chevron="false"
        :disabled="Boolean(busyTemplateId)"
        @click="$emit('select', template)" />
    </div>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"

// Publication templates of one AI service; picking one exports the report
// as PDF with it. The row being exported says so until the PDF is ready.
export default {
  name: "ReportTemplatesSheet",
  components: { BottomSheet, ListRow },
  props: {
    value: { type: Boolean, default: false },
    templates: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    busyTemplateId: { type: String, default: null },
  },
  methods: {
    templateName(template) {
      return getTemplateDisplayName(template, this.$i18n.locale)
    },
    templateHint(template) {
      if (template.id === this.busyTemplateId) {
        return this.$t("mobile.publication.generating")
      }
      return this.$t(`publish.publication.scope_label.${template.scope}`)
    },
  },
}
</script>

<style scoped>
.m-report-templates {
  display: flex;
  flex-direction: column;
}
</style>
