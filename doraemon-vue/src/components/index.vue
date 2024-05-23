<template>
  <div class="container">
    <section id="img-header" class="img">
      <h1>欢迎探索哆啦A梦的奇妙世界！</h1>
      <div class="mouse">
        <div class="moving-line"></div>
        <img alt="" src="@/assets/index/mouse.png" />
      </div>
    </section>

    <section
      v-for="(item, index) in content"
      :key="index"
      :class="`content-${index + 1}`"
      class="content"
    >
      <div class="content-box">
        <div class="content-text">
          <div class="content-item">
            <h2>{{ item.title }}</h2>
            <img :src="item.img" alt="" />
          </div>
          <span style="white-space: pre">{{ item.desc }}</span>
        </div>
      </div>
    </section>

    <section id="img-footer" class="img">
      <h1>让我们一起踏上这场奇妙的旅程吧！</h1>
      <CopyrightIcp
        style="position: absolute; bottom: 10px; right: 0; left: 0"
      />
    </section>

    <div class="navigation" @click="click">
      <div
        :class="{ 'navigation-text-click': navigation_text_click }"
        class="navigation-text"
      >
        <a v-for="(item, index) in href" :key="index" :href="item.href">
          <el-text :class="{ 'el-text-2': textColor }">{{
            item.title
          }}</el-text>
        </a>
        <div>
          <el-text @click="goToAdmin" :class="{ 'el-text-2': textColor }">
            后台管理
          </el-text>
        </div>
      </div>
      <img :src="navigationImg" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CopyrightIcp from "@/components/copyright-icp.vue";
import { useStore } from "vuex";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useStore();

const content = [
  {
    title: "这里是一个为哆啦A梦粉丝打造的世界！",
    desc: "无论你是对这位蓝色小猫机器人的忠实粉丝，还是刚刚开始接触哆啦A梦的世界\n我们都竭诚欢迎你的到来！",
    img: new URL("@/assets/index/skip/1.jpg", import.meta.url).href,
  },
  {
    title: "在这里，你可以深入了解这部动漫作品！",
    desc: "你可以深入了解哆啦A梦的作者藤子·F·不二雄先生的生平故事\n探索哆啦A梦和其他动漫人物的丰富背景和故事！",
    img: new URL("@/assets/index/skip/2.jpg", import.meta.url).href,
  },
  {
    title: "这里有更新颖的内容展现方式！",
    desc: "从作者团队介绍，到动漫角色信息的展示\n让你有更独特的体验！",
    img: new URL("@/assets/index/skip/3.jpg", import.meta.url).href,
  },
  {
    title: "这是一个互动讨论的好地方！",
    desc: "从用户之间的互动讨论，到最新的新闻活动\n我们力求让每位访问者都能在这里找到自己感兴趣的内容！",
    img: new URL("@/assets/index/skip/4.jpg", import.meta.url).href,
  },
  {
    title: "我们邀请你加入我们这个大家庭！",
    desc: "一起分享和发现关于哆啦A梦的一切\n无论是回忆童年的美好时光，还是探索哆啦A梦带来的无限想象\n这里都是你的乐园",
    img: new URL("@/assets/index/skip/5.jpg", import.meta.url).href,
  },
];

const user = {
  title: "用户中心",
  href: "/user/info",
};

const userInfo = store.getters.getUserInfo;

if (userInfo === null) {
  user.title = "登录/注册";
  user.href = "/login";
}

const href = [
  {
    title: "作者介绍",
    href: "/author",
  },
  {
    title: "动漫人物",
    href: "/character",
  },
  {
    title: "用户互动",
    href: "/blog",
  },
  {
    title: "新闻活动",
    href: "/news",
  },
  {
    title: "相关网站",
    href: "/website",
  },
  user,
  {
    title: "反馈",
    href: "/feedback",
  },
];

const goToAdmin = () => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    router.push("/adminLogin");
    return;
  }
  router.push("/admin");
};

const navigationImg = ref(
  new URL("@/assets/index/navigation.png", import.meta.url).href
);

const textColor = ref(false);

const windowHeight = ref(window.innerHeight);

onMounted(() => {
  const handleResize = () => {
    windowHeight.value = window.innerHeight;
  };
  window.addEventListener("resize", handleResize);
  handleResize();
});

watch(
  () => [store.getters.getScroll, windowHeight.value],
  ([getScroll, getWindowHeight]) => {
    if (getScroll > getWindowHeight) {
      navigationImg.value = new URL(
        "@/assets/index/navigation2.png",
        import.meta.url
      ).href;
      textColor.value = true;
    } else {
      navigationImg.value = new URL(
        "@/assets/index/navigation.png",
        import.meta.url
      ).href;
      textColor.value = false;
    }
  }
);

const navigation_text_click = ref(false);

const click = () => {
  navigation_text_click.value = !navigation_text_click.value;
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: auto;
  font-family: "Haiyanzhishi", sans-serif;
}

#img-header,
#img-footer {
  @media screen and (max-width: 768px) {
    display: none;
  }
}

section {
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;

  &:first-child {
    align-items: flex-end;
  }

  h1 {
    font-size: 10vmin;
    background: linear-gradient(
      90deg,
      rgb(7, 114, 185),
      rgb(96, 149, 183),
      rgb(227, 227, 227),
      rgb(96, 149, 183),
      rgb(7, 114, 185)
    );
    color: white;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    white-space: nowrap;
    margin: 1vw 0 5vw 0;
    animation: text 4s linear infinite;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  @keyframes text {
    0% {
      background-position: 0;
    }
    100% {
      background-position: 100vw;
    }
  }

  .mouse {
    position: absolute;
    z-index: 10;
    right: 5vw;
    top: 30vh;

    img {
      width: 30px;
    }

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .moving-line {
    border-left: 1px dashed #000;
    transform: translateX(50%);
    animation: line 4s linear infinite;
  }

  @keyframes line {
    0% {
      height: 0;
    }
    100% {
      height: 45vh;
    }
  }
}

.img {
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  user-select: none;
}

#img-header {
  background-image: url(@/assets/index/1.jfif);
}

#img-footer {
  background-image: url(@/assets/index/8.jfif);
}

.content {
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}

.content-1 {
  background-image: url(@/assets/index/2.jpg);
}

.content-2 {
  background-image: url(@/assets/index/4.jpg);
}

.content-3 {
  background-image: url(@/assets/index/5.jpg);
}

.content-4 {
  background-image: url(@/assets/index/6.jpg);
}

.content-5 {
  background-image: url(@/assets/index/7.jpg);
}

.content-box {
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 25%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  transform-origin: center bottom;
  transform: skew(0, -8deg);

  .content-text {
    display: inline-block;
    text-align: left;
    margin-top: 10vh;
    width: 90%;
    max-width: 990px;
    transform-origin: right bottom;
    transform: skew(0, 8deg);

    .content-item {
      display: flex;
      text-align: right;
      margin: 17vh 0 2vh 0;
      justify-content: flex-end;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      h2 {
        font-size: 4.5vmin;
        text-shadow: 1px 0 0 #323232;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #fff;
        margin: 5px 0;
      }

      @media screen and (max-width: 768px) {
        flex-direction: column;
        margin: 5vw;

        h2 {
          font-size: 24px;
        }
      }
    }

    span {
      font-size: 2.5vmin;
      line-height: 2;
      color: #fff;

      @media screen and (max-width: 768px) {
        font-size: 18px;
        white-space: unset !important;
      }
    }
  }
}

.navigation {
  position: absolute;
  top: 20px;
  right: 30px;
  display: flex;
  font-family: initial;

  @media screen and (max-width: 768px) {
    display: none;
  }

  .navigation-text {
    width: 0;
    overflow: hidden;
    transition: 0.5s;
    height: 22px;
    margin-right: 10px;
    display: flex;

    a,
    div {
      margin-left: 15px;

      .el-text {
        font-size: 18px;
      }

      .el-text-2 {
        color: #fff;
      }

      .el-text:hover {
        color: #000;
      }
    }
  }

  img {
    width: 3vmin;
    height: 3vmin;
    transition: 0.5s;
  }

  &:hover {
    img {
      transform: rotate(360deg);
    }

    .navigation-text {
      width: 670px;
    }
  }

  .navigation-text-click {
    width: 670px;
  }
}
</style>
