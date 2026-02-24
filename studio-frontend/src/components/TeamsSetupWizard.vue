<template>
  <div class="teams-wizard">
    <div class="teams-wizard__header">
      <Button
        variant="text"
        :label="'\u2190 ' + $t('integrations.teams_wizard.back_to_catalog')"
        @click="$emit('close')" />
      <h3>{{ isPlatform
          ? $t("integrations.teams_wizard.title_platform")
          : $t("integrations.teams_wizard.title") }}</h3>
      <div class="teams-wizard__progress">
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span>{{
          $t("integrations.teams_wizard.progress", {
            current: completedSteps,
            total: totalSteps,
          })
        }}</span>
      </div>
    </div>

    <TeamsHealthPanel
      v-if="config && config.status === 'active'"
      :config="config"
      :organizationId="organizationId"
      :scope="scope" />

    <div class="teams-wizard__body" v-if="!loading">
      <nav class="teams-wizard__stepper">
        <ol>
          <li
            v-for="(step, index) in steps"
            v-show="!step.skipped"
            :key="step.key"
            :class="{
              'step--completed': step.completed,
              'step--active': index === currentStep,
              'step--pending':
                !step.completed && index !== currentStep,
            }"
            @click="goToStep(index)">
            <span class="step__indicator">{{
              step.completed ? "\u2713" : visibleStepNumber(index)
            }}</span>
            <span class="step__label">{{ step.label }}</span>
          </li>
        </ol>
      </nav>

      <div class="teams-wizard__content">
        <TeamsStepAzureApp
          v-if="currentStep === 0"
          :config="config"
          :organizationId="organizationId"
          :scope="scope"
          @validated="onStepValidated(0, $event)" />
        <TeamsStepMediaHost
          v-if="currentStep === 1"
          :config="config"
          :organizationId="organizationId"
          :scope="scope"
          @validated="onStepValidated(1, $event)" />
        <TeamsStepAzureBot
          v-if="currentStep === 2"
          :config="config"
          :organizationId="organizationId"
          :scope="scope"
          @validated="onStepValidated(2, $event)" />
        <TeamsStepTeamsApp
          v-if="currentStep === 3"
          :config="config"
          :organizationId="organizationId"
          :scope="scope"
          @validated="onStepValidated(3, $event)" />
        <TeamsStepConnectionTest
          v-if="currentStep === 4"
          :config="config"
          :organizationId="organizationId"
          :scope="scope"
          @validated="onStepValidated(4, $event)" />
        <TeamsStepCalendar
          v-if="currentStep === 5"
          :organizationId="organizationId" />
      </div>
    </div>

    <div class="teams-wizard__footer" v-if="!loading">
      <Button
        variant="secondary"
        :label="$t('integrations.teams_wizard.previous')"
        :disabled="currentStep <= firstVisibleStepIndex"
        @click="prevStep" />
      <Button
        variant="primary"
        v-if="currentStep < lastVisibleStepIndex"
        :label="$t('integrations.teams_wizard.next')"
        @click="nextStep" />
      <Button
        variant="primary"
        v-else
        :label="$t('integrations.teams_wizard.close')"
        @click="$emit('close')" />
    </div>
  </div>
</template>

<script>
import {
  createIntegrationConfig,
  createPlatformIntegrationConfig,
} from "@/api/integrationConfig"
import integrationApiMixin from "@/mixins/integrationApiMixin"
import TeamsHealthPanel from "@/components/TeamsHealthPanel.vue"
import TeamsStepAzureApp from "@/components/TeamsStepAzureApp.vue"
import TeamsStepAzureBot from "@/components/TeamsStepAzureBot.vue"
import TeamsStepMediaHost from "@/components/TeamsStepMediaHost.vue"
import TeamsStepTeamsApp from "@/components/TeamsStepTeamsApp.vue"
import TeamsStepConnectionTest from "@/components/TeamsStepConnectionTest.vue"
import TeamsStepCalendar from "@/components/TeamsStepCalendar.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "TeamsSetupWizard",
  components: {
    TeamsHealthPanel,
    TeamsStepAzureApp,
    TeamsStepAzureBot,
    TeamsStepMediaHost,
    TeamsStepTeamsApp,
    TeamsStepConnectionTest,
    TeamsStepCalendar,
    Button,
  },
  mixins: [integrationApiMixin],
  props: {
    configId: {
      type: String,
      default: null,
    },
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentStep: 0,
      config: null,
      loading: true,
      steps: [
        {
          key: "azure_app",
          label: this.$t("integrations.teams_wizard.step_azure_app"),
          completed: false,
          skipped: false,
        },
        {
          key: "media_host",
          label: this.$t("integrations.teams_wizard.step_media_host"),
          completed: false,
          skipped: false,
        },
        {
          key: "azure_bot",
          label: this.$t("integrations.teams_wizard.step_azure_bot"),
          completed: false,
          skipped: false,
        },
        {
          key: "teams_app",
          label: this.$t("integrations.teams_wizard.step_teams_app"),
          completed: false,
          skipped: false,
        },
        {
          key: "connection_test",
          label: this.$t("integrations.teams_wizard.step_connection_test"),
          completed: false,
          skipped: false,
        },
        {
          key: "calendar",
          label: this.$t("integrations.teams_wizard.step_calendar"),
          completed: false,
          skipped: false,
        },
      ],
    }
  },
  computed: {
    visibleSteps() {
      return this.steps.filter((s) => !s.skipped)
    },
    totalSteps() {
      return this.visibleSteps.length
    },
    completedSteps() {
      return this.visibleSteps.filter((s) => s.completed).length
    },
    progressPercent() {
      return this.totalSteps > 0
        ? (this.completedSteps / this.totalSteps) * 100
        : 0
    },
    firstVisibleStepIndex() {
      return this.steps.findIndex((s) => !s.skipped)
    },
    lastVisibleStepIndex() {
      for (let i = this.steps.length - 1; i >= 0; i--) {
        if (!this.steps[i].skipped) return i
      }
      return this.steps.length - 1
    },
  },
  async mounted() {
    // Auto-skip platform-irrelevant steps
    if (this.isPlatform) {
      const skippedKeys = ["teams_app", "calendar"]
      this.steps.forEach((step) => {
        if (skippedKeys.includes(step.key)) {
          step.skipped = true
          step.completed = true
        }
      })
    }

    try {
      if (this.configId) {
        const res = await this.api.getConfig(this.configId)
        this.config = res
        if (res?.setupProgress) {
          this.currentStep = res.setupProgress.currentStep || 0
          this.steps.forEach((step) => {
            step.completed = !!res.setupProgress.completedSteps?.[step.key]
          })
          // Ensure skipped steps stay completed
          if (this.isPlatform) {
            this.steps.forEach((step) => {
              if (step.skipped) step.completed = true
            })
          }
        }
        // If current step is skipped, jump to next visible step
        if (this.steps[this.currentStep]?.skipped) {
          this.nextStep()
        }
      } else if (this.isPlatform) {
        const res = await createPlatformIntegrationConfig({
          provider: "teams",
        })
        this.config = res?.data || res
      } else {
        const res = await createIntegrationConfig(this.organizationId, {
          provider: "teams",
        })
        this.config = res?.data || res
      }
    } catch {
      // error handled silently, config stays null
    } finally {
      this.loading = false
    }
  },
  methods: {
    visibleStepNumber(index) {
      let count = 0
      for (let i = 0; i <= index; i++) {
        if (!this.steps[i].skipped) count++
      }
      return count
    },
    goToStep(index) {
      if (this.steps[index].skipped) return
      if (this.steps[index].completed || index <= this.currentStep) {
        this.currentStep = index
      }
    },
    prevStep() {
      let prev = this.currentStep - 1
      while (prev >= 0 && this.steps[prev].skipped) {
        prev--
      }
      if (prev >= 0) {
        this.currentStep = prev
      }
    },
    nextStep() {
      let next = this.currentStep + 1
      while (next < this.steps.length && this.steps[next].skipped) {
        next++
      }
      if (next < this.steps.length) {
        this.currentStep = next
      }
    },
    async onStepValidated(stepIndex, data) {
      this.steps[stepIndex].completed = true
      if (data) {
        this.config = { ...this.config, ...data }
      }
      try {
        const completedSteps = {}
        this.steps.forEach((s) => {
          if (s.completed) completedSteps[s.key] = true
        })
        const progressPayload = {
          setupProgress: {
            currentStep: this.currentStep,
            completedSteps,
          },
        }
        await this.api.updateConfig(this.config.id, progressPayload)
        // Reload config from API so next steps see fresh data (decrypted credentials)
        const fresh = await this.api.getConfig(this.config.id)
        if (fresh) {
          this.config = fresh
        }
      } catch {
        // silently ignore save errors
      }
      this.nextStep()
    },
  },
}
</script>

<style scoped>
.teams-wizard__header {
  margin-bottom: 1.5rem;
}
.teams-wizard__header h3 {
  margin: 0.5rem 0;
}
.teams-wizard__progress {
  margin-top: 0.5rem;
}
.progress-bar {
  height: 6px;
  background: var(--bg-secondary, #e0e0e0);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}
.progress-bar__fill {
  height: 100%;
  background: var(--color-primary, #2196f3);
  transition: width 0.3s ease;
}
.teams-wizard__body {
  display: flex;
  gap: 2rem;
}
.teams-wizard__stepper ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
.teams-wizard__stepper li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  cursor: pointer;
  color: var(--text-secondary, #666);
}
.teams-wizard__stepper li.step--active {
  color: var(--color-primary, #2196f3);
  font-weight: 600;
}
.teams-wizard__stepper li.step--completed {
  color: var(--color-success, #27ae60);
}
.step__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid currentColor;
  font-size: 0.85em;
  flex-shrink: 0;
}
.step--completed .step__indicator {
  background: var(--color-success, #27ae60);
  color: white;
  border-color: var(--color-success, #27ae60);
}
.step--active .step__indicator {
  border-color: var(--color-primary, #2196f3);
  background: var(--color-primary, #2196f3);
  color: white;
}
.teams-wizard__content {
  flex: 1;
}
.teams-wizard__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
}
</style>
