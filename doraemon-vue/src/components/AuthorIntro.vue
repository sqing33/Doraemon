<template>
  <div style="height: 100vh; width: 100vw; position: relative; z-index: 1">
    <img
      src="@/assets/author/0.jpg"
      alt=""
      style="
        height: 40vh;
        border-radius: 30px;
        position: absolute;
        top: 36%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
    />

    <div class="bubble" style="transform: translate(-26vw, -40vh)">
      <img src="@/assets/author/1.png" alt="" />
      <span style="transform: translateX(-2vw)">
        {{ intro.a }}<br />{{ intro.b }}
      </span>
    </div>

    <div class="bubble" style="transform: translate(23vw, -40vh)">
      <img src="@/assets/author/2.png" alt="" />
      <span style="transform: translateY(-1.5vh)">
        {{ intro.c }}<br />{{ intro.d }}<br />{{ intro.e }}
      </span>
    </div>
  </div>
</template>

<script setup>
const intro = {
  a: "你们好，我是藤子·F·不二雄，是一名漫画家",
  b: "本名是藤本弘，于1933年12月1日出生在日本富山县",
  c: "《哆啦A梦》无疑是我最著名的作品，它讲述了一只来自未来的",
  d: "机器猫哆啦A梦和一个小男孩野比大雄的故事",
  e: "这部作品深受读者的喜爱，成为了跨越年龄和国界的经典",
};
</script>

<style lang="scss" scoped>
.bubble {
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 20vh;
    width: 35vw;
  }

  span {
    position: absolute;
    text-align: center;
    font-size: 1.15vw;
  }
}
</style>
