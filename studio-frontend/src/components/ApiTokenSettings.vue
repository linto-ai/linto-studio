<template>
  <div>
    <div class="flex row gap-medium">
      <h2>{{ $t("api_tokens_settings.title") }}</h2>
      <Button
        @click="createToken"
        size="sm"
        variant="primary"
        :label="$t('api_tokens_settings.create_token')" />
      <ApiTokenTable :apiTokens="apiTokens" />
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {},
  data() {
    return {
      apiTokens: [],
    }
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
<style lang="scss" scoped></style>
