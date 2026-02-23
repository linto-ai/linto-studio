<template>
  <div class="wizard-step">
    <h4>{{ $t("integrations.teams_wizard.calendar.title") }}</h4>
    <p>{{ $t("integrations.teams_wizard.calendar.description") }}</p>
    <CalendarSubscriptionsList :organizationId="organizationId" />
  </div>
</template>

<script>
import CalendarSubscriptionsList from "@/components/CalendarSubscriptionsList.vue"

export default {
  name: "TeamsStepCalendar",
  components: { CalendarSubscriptionsList },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
}
</script>
