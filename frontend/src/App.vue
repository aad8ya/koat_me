<script setup>
import { NMessageProvider, NConfigProvider } from "naive-ui";
import { PRIMARY_BLUE } from "./styles/theme";
import Toolbar from "@/components/Toolbar.vue";

const themeOverrides = {
  common: {
    primaryColor: PRIMARY_BLUE,
    primaryColorHover: PRIMARY_BLUE,
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <Toolbar />
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>
