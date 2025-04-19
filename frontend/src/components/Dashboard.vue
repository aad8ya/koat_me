<template>
  <div class="dashboard-container">
    <n-card size="large" embedded class="dashboard-card">
      <template #header>
        <div class="dashboard-header">
          <div class="dashboard-title">Performance Dashboard</div>
          <n-button round ghost color="white" @click="exportPdf">
            ⇪ Export PDF
          </n-button>
        </div>
      </template>

      <div class="filters-card">
        <n-grid cols="1 s:2 m:5" x-gap="8" y-gap="16" responsive="screen">
          <n-grid-item>
            <n-date-picker
              v-model:value="filters.startDate"
              type="date"
              placeholder="Start Date"
              clearable
            />
          </n-grid-item>
          <n-grid-item>
            <n-date-picker
              v-model:value="filters.endDate"
              type="date"
              placeholder="End Date"
              clearable
            />
          </n-grid-item>
          <n-grid-item>
            <n-select
              v-model:value="filters.state"
              :options="stateOptions"
              placeholder="Select State"
              clearable
              filterable
              multiple
              :max-tag-count="1"
            />
          </n-grid-item>
          <n-grid-item>
            <n-select
              v-model:value="filters.roofTypeId"
              :options="roofTypeOptions"
              placeholder="Select Roof Type"
              clearable
              filterable
              multiple
              :max-tag-count="1"
            />
          </n-grid-item>
          <n-grid-item>
            <div class="filter-actions-inline">
              <n-button round quaternary @click="resetFilters">Reset</n-button>
              <n-button round type="primary" @click="applyFilters"
                >Apply</n-button
              >
            </div>
          </n-grid-item>
        </n-grid>
      </div>

      <div ref="pdfContent">
        <div class="summary-section">
          <SummaryStats :summary="summary.summaryStats" :loading="isLoading" />
        </div>

        <n-space vertical :size="20">
          <n-grid cols="1 s:2" x-gap="20" y-gap="20" responsive="screen">
            <n-grid-item>
              <ChartCard title="Average Roof Size (sq. ft.) by Type">
                <AverageRoofSizeChart
                  :data="summary.avgRoofSizeByType"
                  :loading="isLoading"
                />
              </ChartCard>
            </n-grid-item>
            <n-grid-item>
              <ChartCard title="Estimated Energy Savings (kWh)">
                <EnergySavingsChart
                  :data="summary.energySavingsByType"
                  :loading="isLoading"
                />
              </ChartCard>
            </n-grid-item>
          </n-grid>

          <ChartCard title="Projects per Month">
            <MonthlyTrendChart
              :data="summary.monthlyProjects"
              :loading="isLoading"
            />
          </ChartCard>

          <ChartCard title="Projects by State">
            <ProjectsByState
              :data="summary.projectsByState"
              :states="stateOptions"
              :loading="isLoading"
              :isPdfExport="isPdfExport"
            />
          </ChartCard>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "@/api";
import html2pdf from "html2pdf.js";
import {
  NCard,
  NDatePicker,
  NSelect,
  NButton,
  NGrid,
  NGridItem,
  NSpace,
} from "naive-ui";

import ChartCard from "./charts/ChartCard.vue";
import SummaryStats from "./charts/SummaryStats.vue";
import ProjectsByState from "./charts/ProjectsByState.vue";
import AverageRoofSizeChart from "./charts/AverageRoofSizeChart.vue";
import EnergySavingsChart from "./charts/EnergySavingsChart.vue";
import MonthlyTrendChart from "./charts/MonthlyTrendChart.vue";

const summary = ref({});
const isLoading = ref(false);
const isPdfExport = ref(false);
const pdfContent = ref(null);

const filters = ref({
  startDate: null,
  endDate: null,
  state: [],
  roofTypeId: [],
});

const roofTypeOptions = ref([]);
const stateOptions = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District Of Columbia", value: "DC" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

async function fetchSummary(params = {}) {
  isLoading.value = true;
  const { data } = await api.get("/api/dashboard-summary", { params });
  summary.value = data;
  isLoading.value = false;
}

async function fetchRoofTypes() {
  try {
    const { data } = await api.get("/api/roof-types");
    roofTypeOptions.value = data.map((rt) => ({
      label: rt.name,
      value: String(rt.id),
    }));
  } catch (err) {
    console.error("Failed to load roof types", err);
  }
}

function resetFilters() {
  filters.value = { startDate: null, endDate: null, state: [], roofTypeId: [] };
  fetchSummary();
}

function applyFilters() {
  const payload = {};

  if (filters.value.startDate)
    payload.startDate = new Date(filters.value.startDate).toISOString();
  if (filters.value.endDate)
    payload.endDate = new Date(filters.value.endDate).toISOString();
  if (filters.value.state?.length)
    payload.state = filters.value.state.join(",");
  if (filters.value.roofTypeId?.length)
    payload.roofTypeId = filters.value.roofTypeId.join(",");

  fetchSummary(payload);
}

function exportPdf() {
  isPdfExport.value = true;

  const opt = {
    filename: `koat-dashboard-${new Date().toISOString().split("T")[0]}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
  };

  html2pdf()
    .set(opt)
    .from(pdfContent.value)
    .save()
    .then(() => {
      isPdfExport.value = false;
    });
}

onMounted(() => {
  fetchRoofTypes();
  fetchSummary();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.dashboard-card {
  background-color: #1e3a8a;
  border-color: #1e3a8a;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #ffffff;
}

.filters-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.filter-actions-inline {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
</style>
