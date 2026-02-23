<template>
  <div class="teams-wizard">
    <div class="teams-wizard__header">
      <Button
        variant="text"
        :label="'\u2190 ' + $t('integrations.teams_wizard.back_to_catalog')"
        @click="$emit('close')" />
      <h3>{{ $t("integrations.teams_wizard.title") }}</h3>
      <div class="teams-wizard__progress">
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span>{{
          $t("integrations.teams_wizard.progress", {
            current: completedSteps,
            total: 6,
          })
        }}</span>
      </div>
    </div>

    <TeamsHealthPanel
      v-if="config && config.status === 'active'"
      :config="config"
      :organizationId="organizationId" />

    <div class="teams-wizard__body" v-if="!loading">
      <nav class="teams-wizard__stepper">
        <ol>
          <li
            v-for="(step, index) in steps"
            :key="step.key"
            :class="{
              'step--completed': step.completed,
              'step--active': index === currentStep,
              'step--pending':
                !step.completed && index !== currentStep,
            }"
            @click="goToStep(index)">
            <span class="step__indicator">{{
              step.completed ? "\u2713" : index + 1
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
          @validated="onStepValidated(0, $event)" />
        <TeamsStepAzureBot
          v-if="currentStep === 1"
          :config="config"
          :organizationId="organizationId"
          @validated="onStepValidated(1, $event)" />
        <TeamsStepMediaHost
          v-if="currentStep === 2"
          :config="config"
          :organizationId="organizationId"
          @validated="onStepValidated(2, $event)" />
        <TeamsStepTeamsApp
          v-if="currentStep === 3"
          :config="config"
          :organizationId="organizationId"
          @validated="onStepValidated(3, $event)" />
        <TeamsStepConnectionTest
          v-if="currentStep === 4"
          :config="config"
          :organizationId="organizationId"
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
        :disabled="currentStep === 0"
        @click="prevStep" />
      <Button
        variant="primary"
        v-if="currentStep < 5"
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
  getIntegrationConfig,
  createIntegrationConfig,
  updateIntegrationConfig,
} from "@/api/integrationConfig"
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
        },
        {
          key: "azure_bot",
          label: this.$t("integrations.teams_wizard.step_azure_bot"),
          completed: false,
        },
        {
          key: "media_host",
          label: this.$t("integrations.teams_wizard.step_media_host"),
          completed: false,
        },
        {
          key: "teams_app",
          label: this.$t("integrations.teams_wizard.step_teams_app"),
          completed: false,
        },
        {
          key: "connection_test",
          label: this.$t("integrations.teams_wizard.step_connection_test"),
          completed: false,
        },
        {
          key: "calendar",
          label: this.$t("integrations.teams_wizard.step_calendar"),
          completed: false,
        },
      ],
    }
  },
  computed: {
    completedSteps() {
      return this.steps.filter((s) => s.completed).length
    },
    progressPercent() {
      return (this.completedSteps / 6) * 100
    },
  },
  async mounted() {
    try {
      if (this.configId) {
        const res = await getIntegrationConfig(
          this.organizationId,
          this.configId
        )
        this.config = res
        if (res?.setupProgress) {
          this.currentStep = res.setupProgress.currentStep || 0
          this.steps.forEach((step, i) => {
            step.completed = !!res.setupProgress.completedSteps?.[step.key]
          })
        }
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
    goToStep(index) {
      if (this.steps[index].completed || index <= this.currentStep) {
        this.currentStep = index
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },
    nextStep() {
      if (this.currentStep < 5) {
        this.currentStep++
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
        await updateIntegrationConfig(this.organizationId, this.config.id, {
          setupProgress: {
            currentStep: this.currentStep,
            completedSteps,
          },
        })
      } catch {
        // silently ignore save errors
      }
      if (this.currentStep < 5) {
        this.currentStep++
      }
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
