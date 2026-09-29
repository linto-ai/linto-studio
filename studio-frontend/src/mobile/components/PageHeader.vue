<template>
  <header class="m-page-header">
    <router-link
      :to="backTo"
      class="m-page-header__back"
      :aria-label="$t('mobile.common.back')">
      <PhIcon name="caret-left" size="md" />
    </router-link>
    <h1 class="m-page-header__title">{{ title }}</h1>
    <slot name="actions" />
  </header>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Sub-page header: back link + title. A link, not a button, so the user can
// long-press it like any navigation.
export default {
  name: "PageHeader",
  components: { PhIcon },
  props: {
    title: { type: String, required: true },
    backTo: { type: [String, Object], default: () => ({ name: "home" }) },
  },
}
</script>

<style scoped>
.m-page-header {
  height: var(--m-header-height);
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  padding: 0 var(--m-space-2);
}

.m-page-header__back {
  width: var(--m-tap);
  height: var(--m-tap);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--m-radius-sm);
  color: var(--m-text);
}

.m-page-header__title {
  flex: 1;
  font-size: var(--m-font-size-lg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
