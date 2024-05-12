<template>
  <div class="main">
    <div class="img">
      <img :src="checkTheater.img" alt="" style="width: 100%;height: 100%;object-fit: cover;"/>
    </div>
    <div class="change">
      <div class="prev" @click="prev">{{ prevTheater.name }}</div>
      <div class="check">{{ checkTheater.name }}</div>
      <div class="next" @click="next">{{ nextTheater.name }}</div>
    </div>
    <CopyrightIcp style="position: absolute;bottom: 0;left: 50%;transform: translateX(-50%)"/>
  </div>
</template>

<script lang="ts" setup>
import CopyrightIcp from "@/components/copyright-icp.vue";
import {reactive, ref} from "vue";

const theater = reactive([
  {
    id: 1,
    name: "测试1",
    img: "http://101.34.255.5:3000/uploads/images/news/news_2024-04-10_00-42-29_71911a6bbea9160d_cheese-cake-202404-1.webp"
  },
  {
    id: 2,
    name: "测试2",
    img: "http://101.34.255.5:3000/uploads/images/news/news_2024-04-10_00-39-33_bcabacfcf0f43272_greeting_pht_01.jpg"
  },
  {
    id: 3,
    name: "测试3",
    img: "https://i0.hdslb.com/bfs/article/7b9fae92e1f69f228569f31adfc039f38ec911ab.png@1256w_1890h_!web-article-pic.avif"
  },
  {
    id: 4,
    name: "测试4",
    img: "http://101.34.255.5:3000/uploads/images/news/news_2024-04-10_00-39-33_bcabacfcf0f43272_greeting_pht_01.jpg"
  },
  {
    id: 5,
    name: "测试5",
    img: "http://101.34.255.5:3000/uploads/images/news/news_2024-04-10_00-17-18_467fdea15e468636_1.jpg"
  }
])

const checkTheater = ref(theater[2]);

const prevTheater = ref(theater[1]);

const nextTheater = ref(theater[3]);

const a = ref(0);

const prev = () => {
  console.log(checkTheater.value);
  if (prevTheater.value.id === 1) {
    prevTheater.value = theater.find(item => item.id === theater.length);
    checkTheater.value = theater.find(item => item.id === 1);
    nextTheater.value = theater.find(item => item.id === 2);
    prevTheater.value.id = theater.length;
    a.value = 1;
    return;
  }

  if (a.value === 1) {
    prevTheater.value = theater.find(item => item.id === theater.length - 1);
    checkTheater.value = theater.find(item => item.id === theater.length);
    nextTheater.value = theater.find(item => item.id === 1);
    a.value = 0;
    return;
  }

  if (nextTheater.value.id === 1) {
    checkTheater.value = theater.find(item => item.id === checkTheater.value.id - 1);
    prevTheater.value = theater.find(item => item.id === prevTheater.value.id - 1);
    nextTheater.value = theater.find(item => item.id === theater.length);
    return;
  }

  checkTheater.value = theater.find(item => item.id === checkTheater.value.id - 1);
  prevTheater.value = theater.find(item => item.id === prevTheater.value.id - 1);
  nextTheater.value = theater.find(item => item.id === nextTheater.value.id - 1);
}

const next = () => {
  if (nextTheater.value.id === theater.length) {
    nextTheater.value = theater.find(item => item.id === 1);
    checkTheater.value = theater.find(item => item.id === theater.length);
    prevTheater.value = theater.find(item => item.id === theater.length - 1);
    nextTheater.value.id = 1;
    a.value = 1;
    return;
  }

  if (a.value === 1) {
    nextTheater.value = theater.find(item => item.id === 2);
    checkTheater.value = theater.find(item => item.id === 1);
    prevTheater.value = theater.find(item => item.id === theater.length);
    a.value = 0;
    return;
  }

  if (prevTheater.value.id === theater.length) {
    checkTheater.value = theater.find(item => item.id === checkTheater.value.id + 1);
    nextTheater.value = theater.find(item => item.id === nextTheater.value.id + 1);
    prevTheater.value = theater.find(item => item.id === 1);
    return;
  }

  checkTheater.value = theater.find(item => item.id === checkTheater.value.id + 1);
  nextTheater.value = theater.find(item => item.id === nextTheater.value.id + 1);
  prevTheater.value = theater.find(item => item.id === prevTheater.value.id + 1);
}


</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 95vh;
  position: relative;
  overflow: hidden;

  .img {
    width: 100%;
    height: 95vh;
    position: absolute;
    background-size: cover;
  }

  .change {
    height: 180px;
    width: 80%;
    background-color: #f5f5f5;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .check {
      font-size: 30px;
      margin: 10px;

    }

    .prev, .next {
      opacity: 0.6;
      font-size: 24px;
      margin: 10px;

    }


  }
}

</style>
