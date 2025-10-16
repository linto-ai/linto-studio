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
      <CopyButton :value="fetchTokenValue" />
      <!-- <Button
        icon="copy"
        variant="tertiary"
        @click="viewToken"
        iconWeight="regular" /> -->
      <Button icon="arrows-clockwise" variant="tertiary" @click="renewToken" />
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
import { apiGetToken } from "@/api/token"
import { mapGetters } from "vuex"

export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tokenKey: "",
    }
  },
  computed: {
    ...mapGetters("organizations", {
      organizationId: "getCurrentOrganizationScope",
    }),
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
    renewToken() {
      this.$emit("renew-token", this.token)
    },
    async fetchTokenValue() {
      const req = await apiGetToken(this.organizationId, this.token.userId)
      if (req.status == "success") {
        const tokenData = req.data
        return tokenData.auth_token
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.error_fetching_token_details"),
          type: "error",
          timeout: 5000,
        })
        throw new Error("Failed to fetch token details")
      }
    },
  },
  components: {
    OrgaRoleSelector,
  },
}
</script>
