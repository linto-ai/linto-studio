<template>
  <div class="m-page">
    <main class="m-page__content m-not-found">
      <PhIcon name="compass" size="xl" />
      <h1>{{ $t("mobile.not_found.title") }}</h1>
      <router-link :to="{ name: 'home' }" class="m-not-found__link">
        {{ $t("mobile.not_found.back_home") }}
      </router-link>
    </main>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "MobileNotFound",
  components: { PhIcon },
}
</script>

<style scoped>
.m-not-found {
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--m-text-muted);
}

.m-not-found__link {
  min-height: var(--m-tap);
  display: inline-flex;
  align-items: center;
}
</style>
