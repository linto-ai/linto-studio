<template>
  <div class="template-help">
    <template v-if="baseTemplates.length">
      <span class="template-help__label">
        {{ $t("publish.publication.help.base_prefix") }}
      </span>
      <Button
        v-for="template in baseTemplates"
        :key="template.id"
        variant="secondary"
        size="sm"
        icon="download-simple"
        type="button"
        :label="baseTemplateLabel(template)"
        @click="$emit('download', template)" />
    </template>
    <span v-else class="template-help__label">
      {{ $t("publish.publication.help.no_base_template") }}
    </span>
    <PublicationPlaceholdersPopover class="template-help__tags" />
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import PublicationPlaceholdersPopover from "@/components/molecules/PublicationPlaceholdersPopover.vue"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"

// One line above the upload zone: download a LinTO template as a starting
// point, and the tags reference on demand.
export default {
  name: "PublicationTemplateHelp",
  components: { Button, PublicationPlaceholdersPopover },
  props: {
    // System templates of the service, offered as a starting point
    baseTemplates: { type: Array, default: () => [] },
  },
  methods: {
    baseTemplateLabel(template) {
      return `${getTemplateDisplayName(template, this.$i18n.locale)} (.docx)`
    },
  },
}
</script>

<style lang="scss" scoped>
.template-help {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--small-gap);
  font-size: var(--text-sm);
}

.template-help__label {
  color: var(--text-secondary);
}

.template-help__tags {
  margin-left: auto;
}
</style>
