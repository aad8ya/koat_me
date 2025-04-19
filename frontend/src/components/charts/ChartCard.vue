<template>
  <n-card :title="renderTitle" size="large" embedded class="chart-wrapper">
    <div class="chart-content">
      <slot />
    </div>
  </n-card>
</template>

<script setup>
import { h } from "vue";
import { PRIMARY_BLUE } from "../../styles/theme";
import { NCard } from "naive-ui";

const props = defineProps({
  title: String,
});

const renderTitle = () =>
  h(
    "div",
    {
      style: {
        color: PRIMARY_BLUE,
        fontSize: "1.25rem",
        fontWeight: 600,
        textAlign: "center",
      },
    },
    props.title
  );
</script>

<style scoped>
.chart-wrapper {
  background: white;
  border-radius: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
