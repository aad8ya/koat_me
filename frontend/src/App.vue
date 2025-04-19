<script setup>
import { NMessageProvider, NConfigProvider } from "naive-ui";
import { PRIMARY_BLUE } from "./styles/theme";

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
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>
