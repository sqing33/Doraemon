<template>
  <div class="anime-detail" :class="`anime-detail--${animeId}`">
    <!-- 哆啦A梦使用全屏样式 + 浮动导航栏 -->
    <template v-if="animeId === 'doraemon'">
      <!-- 浮动导航栏 -->
      <nav class="anime-nav anime-nav--floating">
        <div class="anime-nav__container">
          <el-button round @click="goBack" class="anime-nav__back">
            <el-icon><Back /></el-icon>
            返回博客
          </el-button>
          <div class="anime-nav__links">
            <router-link
              :to="`/anime/${animeId}/author`"
              class="anime-nav__item"
              :class="{ 'anime-nav__item--active': currentTab === 'author' }"
            >
              作者介绍
            </router-link>
            <router-link
              :to="`/anime/${animeId}/character`"
              class="anime-nav__item"
              :class="{ 'anime-nav__item--active': currentTab === 'character' }"
            >
              动漫人物
            </router-link>
            <router-link
              :to="`/anime/${animeId}/website`"
              class="anime-nav__item"
              :class="{ 'anime-nav__item--active': currentTab === 'website' }"
            >
              相关网站
            </router-link>
          </div>
        </div>
      </nav>

      <!-- 全屏内容 -->
      <div class="doraemon-fullscreen">
        <router-view :anime-id="animeId" :anime-config="animeConfig"></router-view>
      </div>
    </template>

    <!-- 其他动漫使用新的布局 -->
    <template v-else>
      <!-- 动漫头部横幅 -->
      <section class="anime-header">
        <div class="anime-header__background" :style="{ backgroundImage: `url(${animeConfig.banner})` }"></div>
        <div class="anime-header__content">
          <div class="anime-header__info">
            <h1 class="anime-header__title">{{ animeConfig.name }}</h1>
            <p class="anime-header__subtitle">{{ animeConfig.subtitle }}</p>
          </div>
          <div class="anime-header__actions">
            <el-button round @click="goBack">返回首页</el-button>
          </div>
        </div>
      </section>

      <!-- 二级导航栏 -->
      <nav class="anime-nav">
        <div class="anime-nav__container">
          <router-link
            :to="`/anime/${animeId}/author`"
            class="anime-nav__item"
            :class="{ 'anime-nav__item--active': currentTab === 'author' }"
          >
            <el-icon><EditPen /></el-icon>
            作者介绍
          </router-link>
          <router-link
            :to="`/anime/${animeId}/character`"
            class="anime-nav__item"
            :class="{ 'anime-nav__item--active': currentTab === 'character' }"
          >
            <el-icon><User /></el-icon>
            动漫人物
          </router-link>
          <router-link
            :to="`/anime/${animeId}/website`"
            class="anime-nav__item"
            :class="{ 'anime-nav__item--active': currentTab === 'website' }"
          >
            <el-icon><Link /></el-icon>
            相关网站
          </router-link>
        </div>
      </nav>

      <!-- 内容区域 -->
      <main class="anime-content">
        <router-view :anime-id="animeId" :anime-config="animeConfig"></router-view>
      </main>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { EditPen, User, Link, Back } from '@element-plus/icons-vue';
import animeConfigData from '@/config/animeConfig';

const route = useRoute();
const router = useRouter();

const animeId = computed(() => route.params.animeId as string);
const currentTab = computed(() => {
  const path = route.path;
  if (path.includes('/author')) return 'author';
  if (path.includes('/character')) return 'character';
  if (path.includes('/website')) return 'website';
  return 'author';
});

const animeConfig = computed(() => {
  return animeConfigData[animeId.value] || animeConfigData['doraemon'];
});

const goBack = () => {
  router.push('/blog');
};
</script>

<style lang="scss" scoped>
.anime-detail {
  min-height: 100vh;
  position: relative;
  background: #f5f7fa;
}

// 哆啦A梦全屏样式
.doraemon-fullscreen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding-top: 60px; // 为浮动导航栏留出空间

  @media screen and (max-width: 768px) {
    padding-top: 100px; // 移动端导航栏更高
  }
}

// 浮动导航栏
.anime-nav--floating {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  &__back {
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__links {
    display: flex;
    gap: 8px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-weight: 600;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &__item--active {
    color: white;
    background: #2f76d2;
  }
}

.anime-header {
  position: relative;
  height: 400px;
  overflow: hidden;

  &__background {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(3px);
    transform: scale(1.05);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.7) 100%
      );
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 100%;
  }

  &__info {
    color: white;
  }

  &__title {
    margin: 0 0 16px;
    font-size: 3.5rem;
    font-weight: 800;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  &__subtitle {
    margin: 0;
    font-size: 1.25rem;
    opacity: 0.9;
  }
}

.anime-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    gap: 8px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    color: #5e6b7a;
    text-decoration: none;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;

    &:hover {
      color: #2f76d2;
      background: rgba(47, 118, 210, 0.05);
    }
  }
}

.anime-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 600px;
}

.anime-footer {
  background: #1b2430;
  color: white;
  padding: 40px 24px;
  text-align: center;
}

// 不同动漫的主题色
.anime-detail--doraemon .anime-nav__item--active {
  color: #2f76d2;
  border-bottom-color: #2f76d2;
}

.anime-detail--koe-no-katachi .anime-nav__item--active {
  color: #f5b942;
  border-bottom-color: #f5b942;
}

.anime-detail--bunny-girl .anime-nav__item--active {
  color: #f0654a;
  border-bottom-color: #f0654a;
}

@media screen and (max-width: 768px) {
  .anime-header {
    height: 300px;

    &__content {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    &__title {
      font-size: 2rem;
    }

    &__subtitle {
      font-size: 1rem;
    }
  }

  .anime-nav__container {
    overflow-x: auto;
    padding: 0 16px;
  }

  .anime-nav__item {
    padding: 12px 16px;
    white-space: nowrap;
  }

  .anime-content {
    padding: 24px 16px;
  }

  // 浮动导航栏响应式
  .anime-nav--floating {
    &__container {
      flex-direction: column;
      padding: 8px 16px;
      gap: 10px;
    }

    &__links {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    &__item {
      padding: 8px 16px;
      font-size: 0.9rem;
      white-space: nowrap;
    }
  }
}
</style>