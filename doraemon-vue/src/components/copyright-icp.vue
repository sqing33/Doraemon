<template>
  <div class="icp">
    {{ `© ${year} ${author} `
    }}<a href="http://beian.miit.gov.cn/" target="_blank">{{ record }}</a>
  </div>
</template>

<script setup>
let year = new Date().getFullYear();
let author = "三青";
let record = "桂ICP备2024030188号-1";
</script>

<style>
.icp {
  text-align: center;
  color: gray;
  z-index: 1000;
}

.icp > a {
  color: gray;
  text-decoration: none;
}

.icp > a:hover {
  color: aqua;
  text-decoration: none;
}
</style>
