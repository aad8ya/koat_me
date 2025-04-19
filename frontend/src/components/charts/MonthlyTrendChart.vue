<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { PRIMARY_BLUE } from "../../styles/theme.js";
import { NSpin } from "naive-ui";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const hasData = computed(() => props.data.length > 0);

const chartData = computed(() => ({
  labels: props.data.map((item) => item.month),
  datasets: [
    {
      label: "Projects per Month",
      data: props.data.map((item) => item.count),
      borderColor: PRIMARY_BLUE,
      backgroundColor: PRIMARY_BLUE,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: false,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: { color: PRIMARY_BLUE },
    },
    y: {
      ticks: { color: PRIMARY_BLUE },
    },
  },
  layout: {
    padding: 16,
  },
};
</script>

<template>
  <div
    style="
      height: 280px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <NSpin v-if="loading" size="large" />
    <template v-else-if="hasData">
      <Line :data="chartData" :options="chartOptions" />
    </template>
    <template v-else>
      <p style="text-align: center; color: #1e3a8a">No data available</p>
    </template>
  </div>
</template>
