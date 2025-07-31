<template>
  <ErrorPage>
    <RouterLink :to="{ name: 'explore' }" class="btn primary">
      {{ $t("global_error.back_to_home") }}
    </RouterLink>
  </ErrorPage>
</template>
<script>
import ErrorPage from "../components/ErrorPage.vue"

export default {
  props: {},
  computed: {},
  components: {
    ErrorPage,
  },
}
</script>
