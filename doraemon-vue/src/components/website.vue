<template>
  <el-row class="website">
    <el-col :lg="16" :md="24" :xs="24">
      <el-row :gutter="20">
        <el-col
          :sm="12"
          :xs="24"
          class="card"
          v-for="(item, index) in website"
          :key="index"
        >
          <a
            :href="item.url"
            target="_blank"
            style="text-decoration: none; color: inherit"
          >
            <div
              :href="item.url"
              style="
                position: relative;
                height: 200px;
                margin-bottom: 20px;
                background: rgba(255, 252, 255, 0.5);
                border-radius: 10px;
                overflow: hidden;
              "
            >
              <span style="position: absolute; right: 20px; width: 50%">
                <h3 style="text-align: center">{{ item.name }}</h3>
                <p>{{ item.intro }}</p>
              </span>
              <img :src="item.img" alt="" />
            </div>
          </a>
        </el-col>
      </el-row>
    </el-col>
    <el-col :lg="8" :md="24" :xs="24">
      <el-row>
        <el-col
          :lg="24"
          :md="6"
          :xs="24"
          v-for="(item, index) in web_video"
          :key="index"
          style="text-align: center; margin-bottom: 20px"
          class="video-card"
        >
          <a
            :href="item.url"
            target="_blank"
            style="text-decoration: none; color: inherit"
          >
            <img
              :src="item.img"
              alt=""
              style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
              "
            />
            <h3>{{ item.name }}</h3>
          </a>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";

const website = reactive([
  {
    name: "哆啦A梦官网",
    url: "http://www.dora-world.com.cn/",
    img: new URL("@/assets/website/0.png", import.meta.url).href,
    intro:
      "影(上海)商贸有限公司经授权在中国大陆地区独家享有“哆啦A梦”形象的著作权权益。",
  },
  {
    name: "哆啦A夢中文網",
    url: "https://chinesedora.com/",
    img: new URL("@/assets/website/1.png", import.meta.url).href,
    intro:
      "全面掌握哆啦A夢 (港譯:多啦A夢) 即時消息,是哆啦A夢迷最信賴的領導品牌。",
  },
  {
    name: "哆啦A夢wiki",
    url: "https://doraemon.fandom.com/zh/wiki/%E9%A6%96%E9%A0%81",
    img: new URL("@/assets/website/2.png", import.meta.url).href,
    intro:
      "哆啦A梦Wiki成立于2006年11月10日，自成立以来，我们已经共同度过了16年！",
  },
  {
    name: "藤子・F・不二雄博物馆",
    url: "https://fujiko-museum.com/sc/",
    img: new URL("@/assets/website/3.png", import.meta.url).href,
    intro:
      "这里是展示孕育出以“哆啦A梦”为主的众多著名作品的漫画家藤子・F・不二雄先生原画的博物馆。",
  },
  {
    name: "“哆啦A梦”电车",
    url: "https://visit-toyama-japan.com/zh-CN/things-to-do/21137",
    img: new URL("@/assets/website/4.png", import.meta.url).href,
    intro: "来万叶线高冈站，乘坐“哆啦A梦” 电车，快乐出行！",
  },
  {
    name: "哆啦A夢未来百货公司",
    url: "https://mirai.dora-world.com/zh_hans/",
    img: new URL("@/assets/website/5.png", import.meta.url).href,
    intro:
      "「哆啦A梦未来百货店」是世界第一家哆啦A梦官方商店，在心情兴奋的同时可以享受选购礼物或购物的乐趣。",
  },
]);

const web_video = reactive([
  {
    name: "哆啦A梦电影官方网站",
    url: "https://doraeiga.com/",
    img: new URL("@/assets/website/02.png", import.meta.url).href,
  },
  {
    name: "哆啦新番社",
    url: "https://www.dora-video.cn/",
    img: new URL("@/assets/website/01.png", import.meta.url).href,
  },
  {
    name: "哆啦A梦|朝日电视台",
    url: "https://www.tv-asahi.co.jp/doraemon/",
    img: new URL("@/assets/website/03.png", import.meta.url).href,
  },
  {
    name: "机器猫吧大全",
    url: "https://www.dora-family.com/Resource:TV",
    img: new URL("@/assets/website/04.png", import.meta.url).href,
  },
]);
</script>

<style lang="scss" scoped>
.website {
  height: calc(100vh - 140px);
  width: calc(100vw - 60px);
  margin: 30px;

  .card {
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      object-fit: cover;
      transition: 0.5s;
      border-radius: 10px;
    }

    &:hover {
      cursor: pointer;

      img {
        position: absolute;

        width: 150px;
        height: 150px;
        border-radius: 50%;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    @media screen and (max-width: 768px) {
      img {
        position: absolute;

        width: 100px;
        height: 100px;
        border-radius: 50%;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .video-card {
    &:hover {
      transform: scale(1.1);
      cursor: pointer;
    }
  }
}
</style>
