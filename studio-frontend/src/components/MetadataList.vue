<template>
  <div class="flex wrap gap-small">
    <div
      v-for="(pairs, index) in field.value"
      :key="index"
      class="metadata-pair">
      <span class="metadata-pair__key">{{ pairs[0] }}</span>
      <span class="metadata-pair__value">{{ pairs[1] }}</span>
    </div>

    <div v-if="field.value.length == 0">
      {{ $t("session.settings_page.metadata.no_metadata") }}
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import Tag from "@/components/molecules/Tag.vue"
export default {
  props: {
    field: {
      type: Object, // field.value is a list of [key, value] (from Object.entries())
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    isPrivateMetadata(key) {
      return key.startsWith("@")
    },
  },
  components: {
    Tag,
  },
}
</script>

<style lang="scss" scoped>
.metadata-pair {
  border: var(--border-block);
  display: flex;
  border-radius: 20px;
  .metadata-pair__key {
    padding: 0.25em 0.5em;
    background-color: var(--primary-soft);
    // color: var(--primary-contrast);
    border-radius: 20px 0 0 20px;
    font-weight: bold;
    border-right: var(--border-block);
  }

  .metadata-pair__value {
    padding: 0.25em 0.5em;
    border-radius: 0 20px 20px 0;
    color: var(--text-secondary);
  }
}
</style>
