<template>
  <div class="toolbar">
    <div class="logo">Koat-me</div>
    <div class="toolbar-actions">
      <n-button
        quaternary
        :type="currentRoute === '/' ? 'primary' : 'default'"
        @click="navigateTo('/')"
      >
        Submit Quote
      </n-button>
      <n-button
        quaternary
        :type="currentRoute === '/dashboard' ? 'primary' : 'default'"
        @click="navigateTo('/dashboard')"
      >
        View Dashboard
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NButton } from "naive-ui";

const router = useRouter();
const route = useRoute();

const currentRoute = computed(() => route.path);

const navigateTo = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 16px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #ddd;
}

.logo {
  font-weight: bold;
  font-size: 1.25rem;
  color: #1e3a8a;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}
</style>
