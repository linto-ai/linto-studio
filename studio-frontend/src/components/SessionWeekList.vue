<template>
  <Loading v-if="loading" />
  <div class="session-week-list" v-else>
    <WeekSelector v-model="startDate"></WeekSelector>
    <div class="flex col gap-medium session-day-list">
      <SessionDayLine
        :lineIndex="7"
        :date="mondayDate"
        :sessions="mondaySessions"></SessionDayLine>
      <SessionDayLine
        :lineIndex="6"
        :date="tuesdayDate"
        :sessions="tuesdaySessions"></SessionDayLine>
      <SessionDayLine
        :lineIndex="5"
        :date="wednesdayDate"
        :sessions="wednesdaySessions"></SessionDayLine>
      <SessionDayLine
        :lineIndex="4"
        :date="thursdayDate"
        :sessions="thursdaySessions"></SessionDayLine>
      <SessionDayLine
        :lineIndex="3"
        :date="fridayDate"
        :sessions="fridaySessions"></SessionDayLine>
      <SessionDayLine
        :lineIndex="2"
        :date="saturdayDate"
        :sessions="saturdaySessions"></SessionDayLine>
      <SessionDayLine
        :lineIndex="1"
        :date="sundayDate"
        :sessions="sundaySessions"></SessionDayLine>
    </div>
  </div>
</template>
<script>
import getStartOfWeek from "../tools/getStartOfWeek"
import { apiGetSessionsBetweenDates } from "@/api/session.js"

import WeekSelector from "@/components/WeekSelector.vue"
import SessionDayLine from "@/components/SessionDayLine.vue"
import Loading from "@/components/Loading.vue"

export default {
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      startDate: getStartOfWeek(new Date()),
      loading: true,
      error: null,
      sessions: [],
    }
  },
  mounted() {
    this.fetchSessions()
  },
  methods: {
    async fetchSessions() {
      this.loading = true
      try {
        const response = await apiGetSessionsBetweenDates(
          this.currentOrganizationScope,
          this.mondayDate,
          this.sundayDate,
        )
        console.log(response)
        this.sessions = response.sessions
        this.loading = false
      } catch (error) {
        this.error = error
        this.loading = false
      }
    },
  },
  computed: {
    mondayDate() {
      return new Date(this.startDate)
    },
    mondaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 1,
      )
    },
    tuesdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 1),
      )
    },
    tuesdaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 2,
      )
    },
    wednesdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 2),
      )
    },
    wednesdaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 3,
      )
    },
    thursdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 3),
      )
    },
    thursdaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 4,
      )
    },
    fridayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 4),
      )
    },
    fridaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 5,
      )
    },
    saturdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 5),
      )
    },
    saturdaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 6,
      )
    },
    sundayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 6),
      )
    },
    sundaySessions() {
      return this.sessions.filter(
        (session) => new Date(session.startTime).getDay() === 0,
      )
    },
  },
  components: {
    WeekSelector,
    SessionDayLine,
    Loading,
  },
}
</script>
