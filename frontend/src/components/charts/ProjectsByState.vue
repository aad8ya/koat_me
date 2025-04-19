<script setup>
import { computed } from "vue";
import { NDataTable, NSpin } from "naive-ui";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  states: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isPdfExport: {
    type: Boolean,
    default: false,
  },
});

const hasData = computed(() => props.data.length > 0);

const stateMap = computed(() => {
  const map = {};
  props.states.forEach((s) => {
    map[s.value] = s.label;
  });
  return map;
});

const columns = [
  { title: "State", key: "stateLabel", align: "center" },
  { title: "Number of Projects", key: "_count", align: "center" },
];

const tableData = computed(() =>
  props.data
    .map((item) => ({
      ...item,
      stateLabel: stateMap.value[item.state] || item.state,
    }))
    .sort((a, b) => a.stateLabel.localeCompare(b.stateLabel))
);
</script>

<template>
  <div :class="['table-wrapper', { scrollable: !props.isPdfExport }]">
    <NSpin v-if="loading" size="large" />
    <n-data-table
      v-else-if="hasData"
      :columns="columns"
      :data="tableData"
      :bordered="false"
      striped
      size="large"
    />
    <p v-else style="text-align: center; color: #1e3a8a; padding: 12px">
      No data available
    </p>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
}

.scrollable {
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
  display: none;
}

::v-deep(.n-data-table .n-data-table-th),
::v-deep(.n-data-table .n-data-table-td) {
  color: #1e3a8a;
}
</style>
