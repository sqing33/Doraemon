<template>
  <index />
</template>

<script setup>
import Index from "@/views/index.vue";
import { onMounted, ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const background_1 = new URL("@/assets/background/1.jpg", import.meta.url).href;
const background_2 = new URL("@/assets/background/6.jpg", import.meta.url).href;
const background_3 = new URL("@/assets/background/4.jpg", import.meta.url).href;
const background_4 = new URL("@/assets/background/2.jpg", import.meta.url).href;

watch(route, (to) => {
  const isAuthorIntroRoute = /^\/author(?:\/|$)/.test(to.path);
  const isBlogRoute = /^\/blog(?:\/|$)/.test(to.path);
  const isNewsRoute = /^\/news(?:\/|$)/.test(to.path);
  const isAdminRoute = /^\/admin(?:\/|$)/.test(to.path);
  const isAdminRoutes = /^\/admin\/[^\/]+(?:\/[^\/]+)*$/.test(to.path);
  const isWebsitesRoute = /^\/website(?:\/|$)/.test(to.path);

  if (isAuthorIntroRoute) {
    document.documentElement.style.setProperty("--background", "black");
  } else if (isBlogRoute) {
    document.documentElement.style.setProperty(
      "--background",
      `url('${background_1}')`
    );
  } else if (isNewsRoute) {
    document.documentElement.style.setProperty(
      "--background",
      `url('${background_2}')`
    );
  } else if (isWebsitesRoute) {
    document.documentElement.style.setProperty(
      "--background",
      `url('${background_3}')`
    );
  } else if ("/login") {
    document.documentElement.style.setProperty(
      "--background",
      `url('${background_4}')`
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
