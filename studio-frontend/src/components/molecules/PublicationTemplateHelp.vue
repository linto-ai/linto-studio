<template>
  <section class="template-help">
    <h4 class="template-help__title">
      {{ $t("publish.publication.help.title") }}
    </h4>
    <ol class="template-help__steps">
      <li>
        <span>{{ $t("publish.publication.help.step_download") }}</span>
        <div class="template-help__downloads" v-if="baseTemplates.length">
          <Button
            v-for="template in baseTemplates"
            :key="template.id"
            variant="secondary"
            size="sm"
            icon="download-simple"
            type="button"
            :label="baseTemplateLabel(template)"
            @click="$emit('download', template)" />
        </div>
        <p class="template-help__empty" v-else>
          {{ $t("publish.publication.help.no_base_template") }}
        </p>
      </li>
      <li>{{ $t("publish.publication.help.step_edit") }}</li>
      <li>
        {{
          canManageOrganization
            ? $t("publish.publication.help.step_upload_manager")
            : $t("publish.publication.help.step_upload")
        }}
      </li>
    </ol>
    <details class="template-help__placeholders" open>
      <summary>{{ $t("publish.publication.help.placeholders_title") }}</summary>

      <h5>{{ $t("publish.publication.help.custom_title") }}</h5>
      <p>{{ $t("publish.publication.help.custom_intro") }}</p>
      <p class="template-help__syntax">
        <code v-text="customSyntax"></code>
      </p>
      <ul>
        <li v-for="example in customExamples" :key="example">
          <code v-text="example"></code>
        </li>
      </ul>
      <p>{{ $t("publish.publication.help.custom_note") }}</p>

      <h5>{{ $t("publish.publication.help.standard_title") }}</h5>
      <ul>
        <li v-for="placeholder in placeholders" :key="placeholder.name">
          <code v-text="placeholderTag(placeholder)"></code>
          <span>
            {{ $t(`publish.publication.help.placeholder.${placeholder.name}`) }}
          </span>
          <strong v-if="placeholder.required">
            {{ $t("publish.publication.help.required") }}
          </strong>
        </li>
      </ul>
    </details>
  </section>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import { PUBLICATION_PLACEHOLDERS } from "@/const/publicationPlaceholders.js"

export default {
  name: "PublicationTemplateHelp",
  components: { Button },
  props: {
    // System templates of the service, offered as a starting point
    baseTemplates: { type: Array, default: () => [] },
    canManageOrganization: { type: Boolean, default: false },
  },
  data() {
    return { placeholders: PUBLICATION_PLACEHOLDERS }
  },
  computed: {
    customSyntax() {
      return `{{${this.$t("publish.publication.help.custom_syntax")}}}`
    },
    customExamples() {
      return [
        this.$t("publish.publication.help.custom_example_actions"),
        this.$t("publish.publication.help.custom_example_participants"),
      ].map((example) => `{{${example}}}`)
    },
  },
  methods: {
    placeholderTag({ name }) {
      return `{{${name}}}`
    },
    baseTemplateLabel(template) {
      const locale = this.$i18n.locale
      const name = locale.startsWith("fr")
        ? template.name_fr || template.name_en
        : template.name_en || template.name_fr
      return `${name} (.docx)`
    },
  },
}
</script>

<style scoped>
.template-help {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: var(--small-gap) var(--medium-gap);
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
  background: var(--background-inset-section);
  font-size: var(--text-sm);
}

.template-help__title {
  margin: 0;
  font-size: 1em;
}

.template-help__steps {
  margin: 0;
  padding-left: 1.4em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.template-help__downloads {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  margin-top: 0.35em;
}

.template-help__empty {
  margin: 0.25em 0 0;
  color: var(--text-secondary);
}

.template-help__placeholders summary {
  cursor: pointer;
  font-weight: 600;
}

.template-help__placeholders h5 {
  margin: 0.6em 0 0.2em;
  font-size: inherit;
}

.template-help__placeholders p {
  margin: 0;
}

.template-help__syntax code {
  font-weight: 600;
}

.template-help__placeholders ul {
  margin: 0.4em 0;
  padding-left: 1.2em;
}

.template-help__placeholders li {
  display: flex;
  gap: 0.5em;
  align-items: baseline;
}

.template-help__placeholders code {
  font-size: 0.9em;
}
</style>
