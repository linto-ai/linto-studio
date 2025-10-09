<template>
  <thead>
    <tr>
      <th @click="sortBy('name')">
        {{ $t("api_tokens_settings.token_name_label") }}
        <span v-if="sortListKey === 'name'">
          {{ sortListDirection === "asc" ? "↑" : "↓" }}
        </span>
      </th>
      <th @click="sortBy('role')">
        {{ $t("api_tokens_settings.token_role_label") }}
        <span v-if="sortListKey === 'role'">
          {{ sortListDirection === "asc" ? "↑" : "↓" }}
        </span>
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
      this.$emit("list_sort_by", key)
    },
  },
}
</script>
