<template>
  <div class="graph-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { Bar } from "vue-chartjs"

export default {
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    dataTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
      },
    }
  },
  mounted() {},
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.dataTitle,
            data: this.data,
            backgroundColor: "#000",
            barPercentage: 0.5,
            barThickness: "flex",
            maxBarThickness: 16,
            borderRadius: 16,
          },
        ],
      }
    },
  },
  methods: {},
  components: {
    Bar,
  },
}
</script>
<style lang="scss" scoped>
.graph-container {
  border: 1px solid var(--neutral-30);
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--primary-soft);
  margin: 1rem;
  max-height: 250px;
  position: relative;
}
</style>
