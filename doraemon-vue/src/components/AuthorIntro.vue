<template>
  <div class="author-intro">

    <div class="author-search">
      <a href="https://zh.wikipedia.org/wiki/藤子·F·不二雄" target="_blank">
        <el-text>去维基百科搜索<br></br>藤子·F·不二雄</el-text>
      </a>
      <br><br>
      <a href="https://baike.baidu.com/item/藤子·F·不二雄" target="_blank">
        <el-text>去百度百科搜索<br></br>藤子·F·不二雄</el-text>
      </a>
    </div>

    <div class="author-content">
      <div class="left">
        <span v-html="_content_1"></span>
      </div>
      <div class="right">
        <span v-html="_content_2"></span>
      </div>
    </div>

    <div class="author-img">
      <span v-html="_content_author" v-for="i in 7" :key="i"></span>
    </div>
  </div>


</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";

const content_1 = '       ' + '藤子·F·不二雄（ふじこ·F·ふじお）（1933年12月1日—1996年9月23日），原名藤本弘，又名藤子不二雄F。\n' +
    '       ' + '日本男性漫画家，出生于日本富山县的高冈市，毕业于富山县立高冈工艺高等学校电气科。小学馆的代表漫画家之一，代表作《哆啦A梦》' +
    '《小鬼Q太郎》《小超人帕门》《超能力魔美》。\n' + '       ' + '曾经长期与另一位著名日本漫画家安孙子素雄（笔名藤子不二雄A）以藤子不二雄作为共用的笔名，' +
    '先后在艰难的生存环境下画了十多年，并未造成太大热潮，直至实际上可以算是两个人最后的合作《Q太郎》。';

const content_2 = '       ' + '1947年受到漫画大师手冢治虫的启发，立志成为儿童漫画家。\n' +
    '       ' + '1964年凭《Q太郎》一炮走红，从此奠定了他在日本漫画界的重要地位，而他的代表作《哆啦A梦》更掀起了无法抵挡的旋风，\n' +
    '       ' + '成为了成千上万儿童心目中永恒的经典，《哆啦A梦》为藤本弘的单人作品。\n' +
    '       ' + '1993年，为了纪念藤本弘的成就，在日本的高冈市建成了“哆啦A梦散步道”。\n' +
    '       ' + '1996年9月23日凌晨02：10，藤本弘因肝衰竭逝世，享年63岁。';

const content_author = "藤子·F·不二雄（藤本弘，ふじもと ひろし，Fujimoto Hiroshi，1933年12月1日－1996年9月23日），是日本著名的漫画家，以创作《哆啦A梦》（Doraemon）而闻名于世。他出生于日本富山县高冈市，从小对绘画和漫画表现出浓厚的兴趣，并在中学时结识了同样热爱漫画的安孙子素雄（藤子不二雄A），两人合作多年，共同使用“藤子不二雄”这一笔名创作了多部作品。1969年，《哆啦A梦》首次连载，讲述了一只来自未来的机器人猫哆啦A梦和小学生野比大雄的冒险故事，该作品迅速获得了广泛欢迎，成为日本乃至全球的经典作品。1987年，两人分道扬镳，藤本弘独自使用“藤子·F·不二雄”的名义继续创作，包括《奇天烈大百科》和《大雄的恐龙》等著名作品。藤子·F·不二雄以其独特的创作风格和深刻的故事内涵，在日本漫画史上占有重要地位，他的作品不仅影响了几代日本读者，也在全球范围内拥有广泛的影响力。1997年，在他的家乡高冈市建立了藤子·F·不二雄纪念馆，以纪念他的贡献和展示他的创作历程。他的创作不仅给无数读者带来了欢乐，也启迪了许多后来者投身于漫画创作，成为日本漫画文化的重要象征，至今仍被广泛阅读和喜爱。"

const _content_1 = ref('');

const _content_2 = ref('');

const _content_author = ref("");

onMounted(() => {
  leftContent();
  rightContent();
  authorContent();
})

const leftContent = () => {
  let index = 0;
  setInterval(() => {
    if (index < content_1.length) {
      _content_1.value += content_1[index];
      index++;
    }
  }, 50)
}

const rightContent = () => {
  let index = 0;
  setInterval(() => {
    if (index < content_2.length) {
      _content_2.value += content_2[index];
      index++;
    }
  }, 50)
}

const authorContent = () => {
  let index = 0;
let iterationCount = 0;
const maxIterations = 4;
const intervalTime = 1; // 毫秒

const interval = setInterval(() => {
  if (index < content_author.length) {
    _content_author.value += content_author[index];
    index++;
  } else {
    index = 0; // 重置索引
    iterationCount++;
    if (iterationCount >= maxIterations) {
      clearInterval(interval);
    }
  }
}, intervalTime);

}


</script>

<style lang="scss" scoped>
body {
  background-color: #000;
}

.author-intro {
  background: black;
  position: relative;

  .author-search {
    position: absolute;
    z-index: 10;
    bottom: 30vh;
    left: 10vw;
    text-align: center;

    a:first-child:hover {
      span:first-child {
        color: #f0f0f0;
      }
    }

    a:last-child:hover {
      span:last-child {
        color: #f0f0f0;
      }
    }
  }

  .author-content {
    width: 100vw;
    height: 95vh;
    position: absolute;
    white-space: pre-wrap;
    font-size: 2.1vmin;
    z-index: 9;

    div {
      width: 25vw;
    }

    .left {
      position: absolute;
      top: 5vh;
      left: 5vw;
    }

    .right {
      position: absolute;
      top: 5vh;
      right: 5vw;
    }

    span {
      position: relative;
      color: white;


      &:after {
        content: '';
        position: absolute;
        right: 0;
        width: 2px;
        height: 3vmin;
        transform: translate(5px, 0.5vmin);
        animation: animation 1.1s infinite;
      }

      @keyframes animation {
        0%, 100% {
          background: transparent;
        }
        50% {
          background-color: #f0f0f0;
        }
      }
    }
  }

  .author-img {
    height: 100vh;
    overflow: hidden;
    font-size: 1em;
    font-family: Arial, sans-serif;
    letter-spacing: -0.01em;
    line-height: 0.4em;
    color: transparent;
    background-image: url("@/assets/author.png"), url("@/assets/author.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-blend-mode: soft-light;
    -webkit-background-clip: text;
  }
}


</style>