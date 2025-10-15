<template>
  <tr>
    <td>{{ token.firstname }}</td>
    <td>
      <OrgaRoleSelector v-model="token.role" readonly />
    </td>
    <td>{{ formatDate(token.createdAt) }}</td>
    <td>{{ formatDate(token.expiresAt) }}</td>
    <td class="flex gap-small">
      <!-- <button @click="viewToken">View</button>
      <button @click="deleteToken">Delete</button> 
      :label="$t('api_tokens_settings.view_token')"
              :label="$t('api_tokens_settings.delete_token')"

      -->
      <Button
        icon="eye"
        variant="tertiary"
        @click="viewToken"
        iconWeight="regular" />
      <Button
        icon="copy"
        variant="tertiary"
        @click="viewToken"
        iconWeight="regular" />
      <Button icon="arrows-clockwise" variant="tertiary" @click="viewToken" />
      <Button
        icon="trash"
        variant="secondary"
        intent="destructive"
        iconWeight="regular"
        @click="deleteToken" />
    </td>
  </tr>
</template>

<script>
import OrgaRoleSelector from "./molecules/OrgaRoleSelector.vue"

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
  components: {
    OrgaRoleSelector,
  },
}
</script>
