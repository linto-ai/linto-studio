<template>
  <div class="m-page">
    <PageHeader :title="title" />
    <main class="m-page__content m-coming-soon">
      <PhIcon name="hammer" size="xl" />
      <p class="m-muted">{{ $t("mobile.coming_soon.text") }}</p>
    </main>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import PageHeader from "@/mobile/components/PageHeader.vue"

// Placeholder page while a section is not built yet.
export default {
  name: "ComingSoon",
  components: { PageHeader, PhIcon },
  props: {
    title: { type: String, required: true },
  },
}
</script>

<style scoped>
.m-coming-soon {
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--m-text-muted);
}
</style>
