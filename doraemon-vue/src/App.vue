<template>
  <index />
</template>

<script setup>
import Index from "@/views/index.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

watch(route, (to) => {
  const isBlogRoute = /^\/blog(?:\/|$)/.test(to.path);
  const isNewsRoute = /^\/news(?:\/|$)/.test(to.path);
  const isAdminRoute = /^\/admin(?:\/|$)/.test(to.path);
  const isAdminRoutes = /^\/admin\/[^\/]+(?:\/[^\/]+)*$/.test(to.path);

  if (isBlogRoute) {
    document.documentElement.style.setProperty(
      "--background",
      "url('/src/assets/background/1.jpg')"
    );
  } else if (isNewsRoute) {
    document.documentElement.style.setProperty(
      "--background",
      "url('/src/assets/background/6.jpg')"
    );
  } else if ("/login") {
    document.documentElement.style.setProperty(
      "--background",
      "url('/src/assets/background/2.jpg')"
    );
  } else {
    document.documentElement.style.setProperty("--background", "white");
  }

  if (isAdminRoute || isAdminRoutes) {
    document.documentElement.style.setProperty(
      "--font-family",
      "Arial, sans-serif"
    );
  }
});
</script>

<style>
@font-face {
  font-family: "Haiyanzhishi";
  src: url("@/assets/ttf/Haiyanzhishidongdong-Regular-2.ttf");
}

:root {
  --background: white;
  --font-family: "Haiyanzhishi", sans-serif;
}

html {
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background: var(--background);
  background-size: cover;
  font-family: var(--font-family);
}

a {
  text-decoration: none !important;
}

.el-main {
  --el-main-padding: 0 !important;
}
</style>
