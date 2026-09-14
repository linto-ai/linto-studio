<template>
  <nav class="m-crumbs" :aria-label="$t('mobile.media.folders')">
    <router-link :to="{ name: 'media' }" class="m-crumbs__item">
      <PhIcon name="house" size="xs" />
      <span>{{ $t("mobile.media.root_folder") }}</span>
    </router-link>
    <template v-for="folder in path">
      <PhIcon
        :key="`sep-${folder._id}`"
        name="caret-right"
        size="xs"
        class="m-crumbs__sep" />
      <router-link
        :key="folder._id"
        :to="{ name: 'media', params: { folderId: folder._id } }"
        class="m-crumbs__item"
        :class="{ 'm-crumbs__item--current': folder._id === currentId }"
        :aria-current="folder._id === currentId ? 'page' : null">
        {{ folder.name }}
      </router-link>
    </template>
  </nav>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "FolderBreadcrumb",
  components: { PhIcon },
  props: {
    path: { type: Array, required: true },
    currentId: { type: String, default: null },
  },
}
</script>

<style scoped>
.m-crumbs {
  display: flex;
  align-items: center;
  gap: var(--m-space-1);
  overflow-x: auto;
  white-space: nowrap;
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
  scrollbar-width: none;
}

.m-crumbs__item {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  min-height: 32px;
  padding: 0 var(--m-space-1);
  color: var(--m-text-muted);
  text-decoration: none;
}

.m-crumbs__item--current {
  color: var(--m-text);
  font-weight: 600;
}

.m-crumbs__sep {
  flex-shrink: 0;
}
</style>
