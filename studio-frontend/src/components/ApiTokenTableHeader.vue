<template>
  <thead>
    <tr>
      <th @click="sortBy('name')">
        {{ $t("api_tokens_settings.token_name_label") }}
      </th>
      <th @click="sortBy('role')">
        {{ $t("api_tokens_settings.token_role_label") }}
      </th>
      <th @click="sortBy('expiresAt')">
        {{ $t("api_tokens_settings.token_creation_date_label") }}
      </th>
      <th @click="sortBy('expiresAt')">
        {{ $t("api_tokens_settings.token_expiration_date_label") }}
      </th>
      <th>{{ $t("api_tokens_settings.token_actions_label") }}</th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: {
    sortListKey: {
      type: String,
      required: true,
    },
    sortListDirection: {
      type: String,
      required: true,
    },
  },
  methods: {
    sortBy(key) {
      return
    },
  },
}
</script>
