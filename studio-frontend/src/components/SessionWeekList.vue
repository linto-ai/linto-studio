<template>
  <div class="session-week-list">
    <WeekSelector v-model="startDate"></WeekSelector>
    <div class="flex col gap-medium session-day-list">
      <SessionDayLine :lineIndex="7" :date="mondayDate"></SessionDayLine>
      <SessionDayLine :lineIndex="6" :date="tuesdayDate"></SessionDayLine>
      <SessionDayLine :lineIndex="5" :date="wednesdayDate"></SessionDayLine>
      <SessionDayLine :lineIndex="4" :date="thursdayDate"></SessionDayLine>
      <SessionDayLine :lineIndex="3" :date="fridayDate"></SessionDayLine>
      <SessionDayLine :lineIndex="2" :date="saturdayDate"></SessionDayLine>
      <SessionDayLine :lineIndex="1" :date="sundayDate"></SessionDayLine>
    </div>
  </div>
</template>
<script>
import WeekSelector from "@/components/WeekSelector.vue"
import SessionDayLine from "@/components/SessionDayLine.vue"
import getStartOfWeek from "../tools/getStartOfWeek"

export default {
  props: {},
  data() {
    return {
      startDate: getStartOfWeek(new Date()),
    }
  },
  mounted() {},
  methods: {},
  computed: {
    mondayDate() {
      return new Date(this.startDate)
    },
    tuesdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 1),
      )
    },
    wednesdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 2),
      )
    },
    thursdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 3),
      )
    },
    fridayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 4),
      )
    },
    saturdayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 5),
      )
    },
    sundayDate() {
      return new Date(
        new Date(this.startDate).setDate(this.startDate.getDate() + 6),
      )
    },
  },
  components: {
    WeekSelector,
    SessionDayLine,
  },
}
</script>
