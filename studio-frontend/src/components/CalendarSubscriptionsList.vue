<template>
  <div>
    <div class="flex row gap-medium align-center" style="margin-bottom: 1rem">
      <h4 class="flex1" style="margin: 0">
        {{ $t("integrations.calendar.subscriptions_title") }}
      </h4>
      <Button
        @click="showForm = true"
        size="sm"
        variant="primary"
        :label="$t('integrations.calendar.add_subscription')" />
    </div>

    <div v-if="loading" class="loading-state">
      {{ $t("common.loading") || "Loading..." }}
    </div>

    <table v-else-if="subscriptions.length > 0" class="subscriptions-table">
      <thead>
        <tr>
          <th>{{ $t("integrations.calendar.col_graph_user_id") }}</th>
          <th>{{ $t("integrations.calendar.col_profile") }}</th>
          <th>{{ $t("integrations.calendar.col_status") }}</th>
          <th>{{ $t("integrations.calendar.col_created") }}</th>
          <th>{{ $t("actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sub in subscriptions" :key="sub.id">
          <td class="graph-user-cell" :title="sub.graphUserId">
            {{ sub.graphUserId }}
          </td>
          <td>{{ getProfileName(sub.transcriberProfileId) }}</td>
          <td>
            <span :class="['status-badge', `status-${sub.status}`]">
              {{ sub.status }}
            </span>
          </td>
          <td>{{ formatDate(sub.createdAt) }}</td>
          <td>
            <Button
              size="sm"
              variant="secondary"
              intent="destructive"
              icon="trash"
              @click="confirmDelete(sub)" />
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty-state">
      {{ $t("integrations.calendar.no_subscriptions") }}
    </p>

    <CalendarSubscriptionForm
      v-if="showForm"
      :organizationId="organizationId"
      :transcriberProfiles="transcriberProfiles"
      @close="showForm = false"
      @created="onSubscriptionCreated" />

    <Modal
      v-model="showDeleteModal"
      :title="$t('integrations.calendar.delete_title')"
      @apply="executeDelete">
      <p>{{ $t("integrations.calendar.delete_confirm") }}</p>
    </Modal>
  </div>
</template>

<script>
import {
  getCalendarSubscriptions,
  deleteCalendarSubscription,
} from "@/api/calendarSubscription.js"
import { apiGetTranscriberProfilesByOrganization } from "@/api/session.js"
import CalendarSubscriptionForm from "@/components/CalendarSubscriptionForm.vue"
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "CalendarSubscriptionsList",
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  components: {
    CalendarSubscriptionForm,
    Modal,
    Button,
  },
  data() {
    return {
      subscriptions: [],
      transcriberProfiles: [],
      loading: false,
      showForm: false,
      showDeleteModal: false,
      subscriptionToDelete: null,
    }
  },
  mounted() {
    this.fetchSubscriptions()
    this.fetchProfiles()
  },
  methods: {
    async fetchSubscriptions() {
      this.loading = true
      const data = await getCalendarSubscriptions(this.organizationId)
      this.subscriptions = Array.isArray(data) ? data : []
      this.loading = false
    },
    async fetchProfiles() {
      this.transcriberProfiles =
        await apiGetTranscriberProfilesByOrganization(this.organizationId)
    },
    getProfileName(profileId) {
      const profile = this.transcriberProfiles.find((p) => p.id === profileId)
      return profile?.config?.name || profileId || "—"
    },
    formatDate(dateStr) {
      if (!dateStr) return "—"
      return new Date(dateStr).toLocaleDateString()
    },
    confirmDelete(sub) {
      this.subscriptionToDelete = sub
      this.showDeleteModal = true
    },
    async executeDelete() {
      if (!this.subscriptionToDelete) return
      const res = await deleteCalendarSubscription(
        this.organizationId,
        this.subscriptionToDelete.id,
      )
      if (res.status === "success") {
        this.subscriptions = this.subscriptions.filter(
          (s) => s.id !== this.subscriptionToDelete.id,
        )
        this.$store.dispatch("system/addNotification", {
          message: this.$t("integrations.calendar.delete_success"),
          type: "success",
          timeout: 5000,
        })
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("integrations.calendar.delete_error"),
          type: "error",
          timeout: 5000,
        })
      }
      this.showDeleteModal = false
      this.subscriptionToDelete = null
    },
    onSubscriptionCreated() {
      this.showForm = false
      this.fetchSubscriptions()
    },
  },
}
</script>

<style lang="scss" scoped>
.subscriptions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;

  th,
  td {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid var(--neutral-20, #e0e0e0);
  }

  th {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.85em;
  }
}

.graph-user-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8em;
  font-weight: 600;

  &.status-active {
    background-color: var(--green-soft, #d4edda);
    color: var(--green-hard, #155724);
  }

  &.status-pending {
    background-color: var(--yellow-soft, #fff3cd);
    color: var(--yellow-hard, #856404);
  }

  &.status-error {
    background-color: var(--red-soft, #f8d7da);
    color: var(--red-hard, #721c24);
  }
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem 0;
}

.loading-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem 0;
}
</style>
