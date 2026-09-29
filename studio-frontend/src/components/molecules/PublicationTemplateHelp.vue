<template>
  <div class="form-field">
    <label>{{ $t("publish.publication.help.base_prefix") }}</label>
    <ul v-if="baseTemplates.length" class="base-templates">
      <li
        v-for="template in baseTemplates"
        :key="template.id"
        class="base-templates__row">
        <PhIcon name="file-doc" framed size="sm" />
        <span class="base-templates__name">
          {{ getTemplateDisplayName(template, $i18n.locale) }}
        </span>
        <Button
          variant="secondary"
          size="xs"
          icon="download-simple"
          type="button"
          label=".docx"
          @click="$emit('download', template)" />
      </li>
    </ul>
    <p v-else class="base-templates__empty">
      {{ $t("publish.publication.help.no_base_template") }}
    </p>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"

// LinTO templates of the service, offered as a starting point for a custom one.
export default {
  name: "PublicationTemplateHelp",
  components: { Button, PhIcon },
  props: {
    baseTemplates: { type: Array, default: () => [] },
  },
  methods: { getTemplateDisplayName },
}
</script>

<style lang="scss" scoped>
.base-templates {
  list-style: none;
  margin: 0;
  padding: 0;
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
}

.base-templates__row {
  display: flex;
  align-items: center;
  gap: var(--small-gap);
  padding: var(--tiny-gap) var(--small-gap);

  & + & {
    border-top: var(--border-block);
  }
}

.base-templates__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
}

.base-templates__empty {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
