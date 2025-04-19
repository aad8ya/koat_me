<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { PRIMARY_BLUE } from "../../styles/theme.js";
import { NSpin } from "naive-ui";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
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

const chartData = computed(() => {
  const sortedData = [...props.data].sort((a, b) =>
    a.roofTypeName.localeCompare(b.roofTypeName)
  );

  return {
    labels: sortedData.map((item) => item.roofTypeName),
    datasets: [
      {
        label: "Estimated Energy Savings (kWh)",
        backgroundColor: PRIMARY_BLUE,
        data: sortedData.map((item) => item.totalKwhSaved),
        borderRadius: 6,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { ticks: { color: PRIMARY_BLUE } },
    y: { ticks: { color: PRIMARY_BLUE } },
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
      align-items: center;
      justify-content: center;
    "
  >
    <NSpin v-if="loading" size="large" />
    <Bar v-else-if="hasData" :data="chartData" :options="chartOptions" />
    <p v-else style="text-align: center; color: #1e3a8a">No data available</p>
  </div>
</template>
