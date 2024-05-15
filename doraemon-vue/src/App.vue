<template>
  <index/>
</template>

<script setup>
import Index from "@/views/index.vue";
</script>

<style>
@font-face {
  font-family: "Haiyanzhishi";
  src: url("@/assets/ttf/Haiyanzhishidongdong-Regular-2.ttf");
}

html {
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}

body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  opacity: 0.75;
  z-index: -99999;
}

a {
  text-decoration: none !important;
}

.el-main {
  --el-main-padding: 0 !important;
}
</style>
