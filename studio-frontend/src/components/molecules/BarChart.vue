<template>
  <div class="bar-chart">
    <div class="bar-chart__container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-if="isEmpty" class="bar-chart__empty">
      <span class="bar-chart__empty-text">{{ emptyText || 'No data available' }}</span>
    </div>
  </div>
</template>
<script>
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
    emptyText: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // Primary color from design system: #11977c
      primaryColor: '#11977c',
      primaryColorHover: '#0d7a64',
    }
  },
  mounted() {},
  computed: {
    isEmpty() {
      return !this.data || this.data.length === 0 || this.data.every(v => v === 0)
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(51, 51, 51, 0.95)',
            titleColor: '#fff',
            titleFont: {
              size: 12,
              weight: '600',
            },
            bodyColor: '#fff',
            bodyFont: {
              size: 13,
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (items) => items[0]?.label || '',
              label: (item) => `${this.dataTitle}: ${item.formattedValue}`
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: '#666',
              font: {
                size: 11,
                weight: '500',
              },
              padding: 8,
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.04)',
              drawBorder: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: '#666',
              font: {
                size: 11,
              },
              padding: 8,
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 500,
          easing: 'easeOutQuart',
        },
      }
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.dataTitle,
            data: this.data,
            backgroundColor: this.primaryColor,
            hoverBackgroundColor: this.primaryColorHover,
            barPercentage: 0.7,
            barThickness: 'flex',
            maxBarThickness: 28,
            borderRadius: 6,
            borderSkipped: false,
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
.bar-chart {
  position: relative;
  background: var(--background-primary);
  border: var(--border-block);
  border-radius: 12px;
  box-shadow: var(--shadow-2);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-3);
  }

  &__container {
    padding: 1rem 1rem 0.75rem;
    height: 220px;
    position: relative;
  }

  &__empty {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-10);
  }

  &__empty-text {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    font-style: italic;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .bar-chart {
    transition: none;
  }
}
</style>
