<template>
  <div style="height: 100vh; display: flex; justify-content: center; align-items: center;background-color: #000">
    <div class="animated-text">这里是一些文字</div>
  </div>


</template>

<script lang="ts" setup>

</script>

<style scoped>
.animated-text {
  background: url('https://img.mp.itc.cn/upload/20170531/f004eda9b7e440339aef568e3b879165.jpg') repeat;
  background-size: cover;
  color: white;
  font-size: 40px;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  white-space: nowrap;
}

</style>