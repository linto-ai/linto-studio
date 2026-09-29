<template>
  <Popover
    close-on-click-outside
    close-on-escape
    :closeOnClick="false"
    position="bottom"
    width="30rem">
    <template #trigger>
      <Button
        variant="link"
        size="sm"
        icon="info"
        type="button"
        :label="$t('publish.publication.help.placeholders_button')" />
    </template>
    <template #content>
      <div class="placeholders-popover">
        <h4>{{ $t("publish.publication.help.custom_title") }}</h4>
        <p>{{ $t("publish.publication.help.custom_intro") }}</p>
        <code class="placeholders-popover__syntax" v-text="customSyntax"></code>
        <code v-text="customExample"></code>
        <p class="placeholders-popover__note">
          {{ $t("publish.publication.help.custom_note") }}
        </p>

        <h4 class="placeholders-popover__standard-title">
          {{ $t("publish.publication.help.standard_title") }}
        </h4>
        <dl class="placeholders-popover__standard">
          <template v-for="placeholder in placeholders">
            <dt :key="`${placeholder.name}-tag`">
              <code v-text="placeholderTag(placeholder)"></code>
            </dt>
            <dd :key="`${placeholder.name}-desc`">
              {{
                $t(`publish.publication.help.placeholder.${placeholder.name}`)
              }}
              <strong v-if="placeholder.required">
                ({{ $t("publish.publication.help.required") }})
              </strong>
            </dd>
          </template>
        </dl>
      </div>
    </template>
  </Popover>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import Popover from "@/components/atoms/Popover.vue"
import { PUBLICATION_PLACEHOLDERS } from "@/const/publicationPlaceholders.js"

// Reference of the tags a DOCX publication template can contain, on demand.
export default {
  name: "PublicationPlaceholdersPopover",
  components: { Button, Popover },
  data() {
    return { placeholders: PUBLICATION_PLACEHOLDERS }
  },
  computed: {
    customSyntax() {
      return `{{${this.$t("publish.publication.help.custom_syntax")}}}`
    },
    customExample() {
      return `{{${this.$t("publish.publication.help.custom_example_actions")}}}`
    },
  },
  methods: {
    placeholderTag({ name }) {
      return `{{${name}}}`
    },
  },
}
</script>

<style lang="scss" scoped>
.placeholders-popover {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
  padding: var(--medium-gap);
  background: var(--background-primary);
  color: var(--text-primary);
  font-size: var(--text-sm);
  line-height: 1.5;
  text-align: left;

  h4 {
    margin: 0;
    font-size: var(--text-md);
  }

  h4 + p {
    margin-top: calc(-1 * var(--tiny-gap));
  }

  p {
    margin: 0;
  }

  code {
    display: inline-block;
    padding: 2px 6px;
    border-radius: var(--border-radius-sm);
    background: var(--neutral-10);
    border: 1px solid var(--neutral-20);
    font-size: var(--text-xs);
    line-height: 1.6;
  }
}

.placeholders-popover__syntax {
  font-weight: 600;
  color: var(--primary-color);
}

.placeholders-popover__note {
  color: var(--text-secondary);
}

.placeholders-popover__standard {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--tiny-gap) var(--medium-gap);
  margin: 0;
  padding-top: var(--small-gap);
  border-top: var(--border-block);

  dt,
  dd {
    margin: 0;
  }
}
</style>
