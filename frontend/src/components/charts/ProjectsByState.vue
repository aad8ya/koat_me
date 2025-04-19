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
  <div class="scroll-wrapper">
    <NSpin v-if="loading" size="large" />
    <n-data-table
      v-else-if="hasData"
      :columns="columns"
      :data="tableData"
      :bordered="false"
      striped
      size="large"
      class="scroll-table"
    />
    <p v-else style="text-align: center; color: #1e3a8a; padding: 12px">
      No data available
    </p>
  </div>
</template>

<style scoped>
.scroll-wrapper {
  max-height: 320px;
  width: 100%;
  overflow-y: auto;
  scrollbar-width: none;
}
.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

::v-deep(.n-data-table .n-data-table-th),
::v-deep(.n-data-table .n-data-table-td) {
  color: #1e3a8a;
}
</style>
