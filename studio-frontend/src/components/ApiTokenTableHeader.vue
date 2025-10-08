<template>
  <thead>
    <tr>
      <th @click="sortBy('name')">
        Name
        <span v-if="sortListKey === 'name'">
          {{ sortListDirection === "asc" ? "↑" : "↓" }}
        </span>
      </th>
      <th @click="sortBy('role')">
        Role
        <span v-if="sortListKey === 'role'">
          {{ sortListDirection === "asc" ? "↑" : "↓" }}
        </span>
      </th>
      <th @click="sortBy('lastUsed')">
        Last Used
        <span v-if="sortListKey === 'lastUsed'">
          {{ sortListDirection === "asc" ? "↑" : "↓" }}
        </span>
      </th>
      <th @click="sortBy('createdDate')">
        Created Date
        <span v-if="sortListKey === 'createdDate'">
          {{ sortListDirection === "asc" ? "↑" : "↓" }}
        </span>
      </th>
      <th>Actions</th>
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
