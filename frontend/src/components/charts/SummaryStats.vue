<template>
  <div class="summary-section">
    <div v-if="loading" class="summary-center stat-card">
      <n-spin size="large" />
    </div>

    <div v-else-if="summary">
      <n-grid cols="1 s:2 m:3" x-gap="24" y-gap="16" responsive="screen">
        <n-grid-item v-for="stat in stats" :key="stat.label">
          <div class="stat-card">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </n-grid-item>
      </n-grid>
    </div>

    <div v-else class="summary-center">
      <p class="no-data-text">No data available</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { NGrid, NGridItem, NSpin } from "naive-ui";

const props = defineProps({
  summary: Object,
  loading: Boolean,
});

const formattedAvgRoofSize = computed(() =>
  props.summary?.avgRoofSize != null
    ? props.summary.avgRoofSize.toFixed(2)
    : "-"
);

const formattedEnergySavings = computed(() =>
  props.summary?.totalEnergySaved != null
    ? props.summary.totalEnergySaved.toFixed(2)
    : "-"
);

const stats = computed(() => [
  {
    label: "Total Projects",
    value: props.summary?.totalProjects ?? "-",
  },
  {
    label: "Avg Roof Size (sq. ft.)",
    value: formattedAvgRoofSize.value,
  },
  {
    label: "Estimated Energy Savings (kWh)",
    value: formattedEnergySavings.value,
  },
]);
</script>

<style scoped>
.summary-section {
  margin-bottom: 32px;
}

.summary-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}

.no-data-text {
  color: #1e3a8a;
  font-size: 1rem;
  font-weight: 500;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  font-size: 1rem;
  color: #1e3a8a;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  color: #1e3a8a;
  font-weight: 700;
}
</style>
