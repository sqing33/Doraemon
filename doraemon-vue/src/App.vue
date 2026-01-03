<template>
  <index />
</template>

<script setup>
import Index from "@/views/index.vue";
import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

watch(route, (to) => {
  const isAdminRoute = /^\/admin(?:\/|$)/.test(to.path);
  const isAdminRoutes = /^\/admin\/[^\/]+(?:\/[^\/]+)*$/.test(to.path);

  if (isAdminRoute || isAdminRoutes) {
    document.documentElement.style.setProperty(
      "--font-family",
      "Arial, sans-serif"
    );
    document.documentElement.style.setProperty("--font-title", "Arial, sans-serif");
  } else {
    document.documentElement.style.removeProperty("--font-family");
    document.documentElement.style.removeProperty("--font-title");
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap");

:root {
  --background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
  --font-family: "Noto Sans SC", system-ui, -apple-system, "PingFang SC",
    "Microsoft YaHei", sans-serif;
  --font-title: "Noto Serif SC", "Songti SC", "STSong", serif;
}

html {
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background-image: var(--background-image);
  background-color: #ffffff;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  font-family: var(--font-family);
  position: relative;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-title);
}

#app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

a {
  text-decoration: none !important;
}

.el-main {
  --el-main-padding: 0 !important;
}
</style>
