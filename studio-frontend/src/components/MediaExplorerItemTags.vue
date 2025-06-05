<template>
  <span class="media-explorer-item-tags">
    <span
      class="tag"
      :style="{ backgroundColor: tag.color }"
      v-for="tag in tags"
      :key="tag.id" />
  </span>
</template>

<script>
const TEST_TAGS = [
  {
    id: "1",
    name: "Tag 1",
    color: "red",
  },
  {
    id: "2",
    name: "Tag 2",
    color: "blue",
  },
  {
    id: "3",
    name: "Tag 3",
    color: "green",
  },
  {
    id: "4",
    name: "Tag 4",
    color: "yellow",
  },
  {
    id: "5",
    name: "Tag 5",
    color: "purple",
  },
]

export default {
  name: "MediaExplorerItemTags",
  props: {
    tags: {
      type: Array,
      default: () => TEST_TAGS,
    },
  },
  data() {
    return {
      tags: TEST_TAGS,
    }
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em;
}

.tag {
  display: inline-block;
  border-radius: 4px;
  padding: 0.25em 0.5em;
  font-size: 0.8em;
  font-weight: 500;
  width: 1em;
  height: 1em;
  color: var(--neutral-10);
}
</style>