<template>
  <main class="m-app-loading" role="status">
    <img src="/img/linto.svg" alt="" class="m-app-loading__logo" />
    <PhIcon name="circle-notch" size="lg" class="m-app-loading__spinner" />
    <p class="m-muted">{{ message }}</p>
  </main>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Full screen shown while the first page waits for the instance (session
// loaded by the router guard). Takes over from the static one in
// mobile.html, which covers the JS loading.
export default {
  name: "AppLoading",
  components: { PhIcon },
  props: {
    message: { type: String, required: true },
  },
}
</script>

<style scoped>
.m-app-loading {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--m-space-4);
  padding: var(--m-space-4);
  text-align: center;
}

.m-app-loading__logo {
  width: 64px;
  height: 64px;
}

.m-app-loading__spinner {
  color: var(--m-primary);
  animation: m-app-loading-spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .m-app-loading__spinner {
    animation-duration: 3s;
  }
}

@keyframes m-app-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
