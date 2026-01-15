<template>
  <Modal
    :title="$t('session_stats_modal.title')"
    :value="value"
    size="lg"
    :withActions="false"
    :withActionApply="false"
    :withActionCancel="false"
    :withClose="true"
    customModalClass="modal-session-stats"
    @input="$emit('input', $event)"
    @close="$emit('close')">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open"></slot>
    </template>

    <template #content>
      <div class="session-stats" role="region" :aria-busy="loading">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="session-stats__loading"
          role="status"
          aria-live="polite">
          <Loading :title="$t('session_stats_modal.loading')" />
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="session-stats__error"
          role="alert"
          aria-live="assertive">
          <div class="session-stats__error-content">
            <ph-icon
              name="warning-circle"
              size="lg"
              color="var(--danger-color)" />
            <p class="session-stats__error-message">
              {{ $t("session_stats_modal.error") }}
            </p>
            <Button
              variant="primary"
              icon="arrow-clockwise"
              @click="fetchSessionStats">
              {{ $t("session_stats_modal.retry") }}
            </Button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="sessionKpi" class="session-stats__content">
          <!-- Channels Section -->
          <section
            class="session-stats__section session-stats__channels"
            aria-labelledby="channels-title">
            <h3 id="channels-title" class="session-stats__section-title">
              <ph-icon name="broadcast" size="md" />
              {{ $t("session_stats_modal.channels.title") }}
            </h3>

            <div
              v-if="sessionKpi.channels && sessionKpi.channels.length"
              class="flex col gap-medium">
              <ChannelStatsCard
                v-for="channel in sessionKpi.channels"
                :key="channel.channelId"
                :channel="channel"
                :sessionStart="sessionKpi.firstChannelMountAt"
                :sessionEnd="sessionKpi.lastChannelUnmountAt" />
            </div>

            <div v-else class="session-stats__no-channels" role="status">
              <ph-icon
                name="broadcast-slash"
                size="lg"
                color="var(--neutral-40)" />
              <p>{{ $t("session_stats_modal.channels.no_channels") }}</p>
            </div>
          </section>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import ChannelStatsCard from "@/components/ChannelStatsCard.vue"
import { getSessionKpiById } from "@/api/kpi"

export default {
  name: "ModalSessionStats",
  components: {
    Modal,
    Loading,
    Button,
    ChannelStatsCard,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    sessionId: {
      type: String,
      required: true,
    },
    sessionName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      sessionKpi: null,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(isOpen) {
        if (isOpen && this.sessionId) {
          this.fetchSessionStats()
        }
      },
    },
    sessionId(newId) {
      if (this.value && newId) {
        this.fetchSessionStats()
      }
    },
  },
  methods: {
    async fetchSessionStats() {
      if (!this.sessionId) return

      this.loading = true
      this.error = null

      try {
        const data = await getSessionKpiById(this.sessionId)
        if (data) {
          this.sessionKpi = data
        } else {
          this.error = "not_found"
        }
      } catch (err) {
        console.error("Failed to fetch session KPI:", err)
        this.error = err.message || "unknown"
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.session-stats {
  min-height: 300px;
}

.session-stats__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.session-stats__error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.session-stats__error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.session-stats__error-message {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.session-stats__content {
  display: flex;
  flex-direction: column;
  gap: var(--medium-gap, 1.5rem);
  animation: fadeIn 0.3s ease-out;
}

.session-stats__section {
  background: var(--background-primary);
  border-radius: 12px;
  padding: var(--medium-gap, 1.25rem);
  border: 1px solid var(--neutral-10);
}

.session-stats__section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--medium-gap, 1rem) 0;

  .icon-svg {
    color: var(--primary-color);
  }
}

// Channels Grid
.session-stats__channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--small-gap, 1rem);
}

.session-stats__no-channels {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  background: var(--neutral-05, rgba(0, 0, 0, 0.02));
  border-radius: 8px;

  p {
    margin: 0;
  }
}

// Animation
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .session-stats__content {
    animation: none;
  }
}

// Responsive
@media (max-width: 768px) {
  .session-stats__channels-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style lang="scss">
// Global styles for modal customization
.modal-session-stats {
  .modal-body {
    background: var(--neutral-05, #f9fafb);
  }
}
</style>
