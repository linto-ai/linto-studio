<template>
  <component :is="tag" class="section-heading">
    <component :is="level" class="section-heading__title">{{
      title
    }}</component>
    <span v-if="subtitle || $slots.subtitle" class="section-heading__subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </span>
    <span v-if="$slots.actions" class="section-heading__actions">
      <slot name="actions" />
    </span>
  </component>
</template>

<script>
// Title of a section, with an optional muted subtitle under it and actions
// (buttons) on its right. Only a heading and spans inside, so that it can
// also be the <legend> of a fieldset: a group of radios is then announced
// by its section title.
export default {
  name: "SectionHeading",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: null },
    // header for a section, legend for a fieldset
    tag: {
      type: String,
      default: "header",
      validator: (value) => ["header", "legend"].includes(value),
    },
    // Heading level of the title in the page outline
    level: {
      type: String,
      default: "h3",
      validator: (value) => ["h2", "h3", "h4"].includes(value),
    },
  },
}
</script>

<style lang="scss" scoped>
.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: var(--medium-gap);
  width: 100%;
  margin: 0;
  padding: 0;

  &__title {
    grid-column: 1;
    // Global headings span the row and carry margins: this one sits in
    // the grid
    width: auto;
    margin: 0;
    font-size: var(--text-md);
    font-weight: 600;
  }

  &__subtitle {
    display: flex;
    flex-direction: column;
    grid-column: 1;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    grid-column: 2;
    grid-row: 1 / span 2;
    gap: var(--small-gap);
  }
}
</style>
