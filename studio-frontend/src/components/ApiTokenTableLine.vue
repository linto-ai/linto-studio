<template>
  <tr>
    <td>{{ token.name }}</td>
    <td>{{ token.role }}</td>
    <td>{{ formatDate(token.lastUsed) }}</td>
    <td>{{ formatDate(token.createdDate) }}</td>
    <td>
      <button @click="viewToken">View</button>
      <button @click="deleteToken">Delete</button>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      // Implement your date formatting logic here
      return new Date(date).toLocaleDateString()
    },
    viewToken() {
      this.$emit("view-token", this.token)
    },
    deleteToken() {
      this.$emit("delete-token", this.token)
    },
  },
}
</script>
