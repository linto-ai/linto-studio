<template>
  <ErrorPage>
    <Button
      variant="primary"
      :to="{ name: 'explore' }"
      :label="$t('global_error.back_to_home')" />
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
