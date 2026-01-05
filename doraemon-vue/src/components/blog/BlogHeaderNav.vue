<template>
  <section class="blog-header">
    <div ref="blogHeaderCardRef" class="blog-header__card">
      <!-- Layer 1: Carousel background -->
      <div
        v-if="showCarousel && !collapsed"
        class="blog-header__carousel-layer"
      >
        <div class="carousel-wrapper">
          <div
            v-for="(anime, index) in animeList"
            :key="anime.id"
            class="carousel-slide"
            :class="{ 'carousel-slide--active': index === currentSlideIndex }"
          >
            <router-link :to="`/anime/${anime.id}`" class="carousel-link">
              <img :src="anime.image" :alt="anime.name" class="carousel-image" />
              <div class="carousel-text">
                <h3 class="carousel-title">{{ anime.name }}</h3>
                <p class="carousel-subtitle">{{ anime.subtitle }}</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="carousel-indicators">
          <button
            v-for="(anime, index) in animeList"
            :key="`indicator-${index}`"
            class="carousel-indicator"
            :class="{ 'carousel-indicator--active': index === currentSlideIndex }"
            type="button"
            @click="goToSlide(index)"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>

      <!-- Layer 2: White background -->
      <div class="blog-header__bg-layer"></div>

      <!-- Layer 3: Foreground content -->
      <div class="blog-header__content-layer">
        <div class="blog-header__content" :class="contentToneClass">
          <p class="blog-header__eyebrow">{{ eyebrow }}</p>
          <h1 class="blog-header__title">{{ title }}</h1>
          <p class="blog-header__subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { animeList } from "@/config/animeConfig";

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    showCarousel?: boolean;
    collapsed?: boolean;
    syncLayoutProgress?: boolean;
  }>(),
  {
    eyebrow: "",
    title: "",
    subtitle: "",
    showCarousel: true,
    collapsed: false,
    syncLayoutProgress: true,
  }
);

const currentSlideIndex = ref(0);
const blogHeaderCardRef = ref<HTMLElement | null>(null);

let carouselTimer: number | null = null;
let rafId: number | null = null;
let lastScrollY = 0;
let ticking = false;
let progress = 0;

const getScrollY = (): number => {
  const scrollbarWrap = document.querySelector(".el-scrollbar__wrap");
  if (scrollbarWrap) return (scrollbarWrap as HTMLElement).scrollTop;

  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

const applyProgress = (newProgress: number) => {
  progress = newProgress;
  const progressStr = newProgress.toString();

  const host = blogHeaderCardRef.value;
  const container = host?.closest(".blog") as HTMLElement | null;
  container?.style.setProperty("--header-progress", progressStr);
  if (props.syncLayoutProgress) {
    container?.style.setProperty("--progress", progressStr);
  }

  if (host) {
    const shadowStyle =
      newProgress > 0.8
        ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
        : "0 20px 50px -12px rgb(0 0 0 / 0.25)";

    if (host.style.boxShadow !== shadowStyle) host.style.boxShadow = shadowStyle;
  }
};

const handleScroll = () => {
  const scrollY = getScrollY();
  if (scrollY === lastScrollY) return;
  lastScrollY = scrollY;

  if (ticking) return;
  ticking = true;

  rafId = requestAnimationFrame(() => {
    const range = 250;
    const newProgress = Math.min(Math.max(scrollY / range, 0), 1);
    applyProgress(newProgress);

    if (newProgress > 0.1) stopCarousel();
    else startCarousel();

    ticking = false;
  });
};

const startCarousel = () => {
  if (!props.showCarousel || props.collapsed) return;
  if (carouselTimer) return;
  carouselTimer = window.setInterval(() => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % animeList.length;
  }, 5000);
};

const stopCarousel = () => {
  if (!carouselTimer) return;
  clearInterval(carouselTimer);
  carouselTimer = null;
};

const goToSlide = (index: number) => {
  currentSlideIndex.value = index;
  stopCarousel();
  startCarousel();
};

const contentToneClass = computed(() => {
  if (props.collapsed) return "text-dark";
  return progress > 0.55 ? "text-dark" : "text-light";
});

onMounted(() => {
  if (props.collapsed) {
    applyProgress(1);
    stopCarousel();
    return;
  }

  const scrollbarWrap = document.querySelector(".el-scrollbar__wrap");
  if (scrollbarWrap) {
    scrollbarWrap.addEventListener("scroll", handleScroll, { passive: true });
  } else {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  window.addEventListener("resize", handleScroll, { passive: true });

  applyProgress(0);
  startCarousel();
});

onUnmounted(() => {
  if (props.collapsed) return;
  const scrollbarWrap = document.querySelector(".el-scrollbar__wrap");
  if (scrollbarWrap) scrollbarWrap.removeEventListener("scroll", handleScroll);
  else window.removeEventListener("scroll", handleScroll);

  window.removeEventListener("resize", handleScroll);
  stopCarousel();
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style lang="scss" scoped>
.blog-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.blog-header__card {
  pointer-events: auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  position: relative;
  transform: translateZ(0);
  height: calc(380px - (330px * var(--header-progress)));
  margin-top: calc(30px * (1 - var(--header-progress)));
  margin-left: calc(30px * (1 - var(--header-progress)));
  margin-right: calc(30px * (1 - var(--header-progress)));
  border-radius: calc(24px * (1 - var(--header-progress)));
  max-width: calc(80vw + 100px + (100vw * var(--header-progress)));
  box-shadow: 0 20px 50px -12px rgb(0 0 0 / 0.25);
  will-change: height, margin, border-radius, max-width;
  transition: box-shadow 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(47, 118, 210, 0.12),
      rgba(245, 185, 66, 0.1)
    );
    pointer-events: none;
    z-index: -1;
  }
}

.blog-header__carousel-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  overflow: hidden;
  will-change: opacity;
  transform: translateZ(0);
  opacity: max(0, calc(1 - var(--header-progress) * 1.5));
}

.carousel-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  pointer-events: none;
  will-change: opacity;
  transform: translateZ(0);

  &.carousel-slide--active {
    opacity: 1;
    pointer-events: auto;
  }
}

.carousel-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #f5f5f5;
  will-change: transform;
  transform: translateZ(0);
}

.carousel-text {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  z-index: 5;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.carousel-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
}

.carousel-subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.carousel-indicators {
  position: absolute;
  bottom: 24px;
  right: 32px;
  display: flex;
  gap: 8px;
  z-index: 10;
  will-change: transform;
  transform: translateZ(0);
}

.carousel-indicator {
  appearance: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  will-change: transform, background-color, width;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    transform: scale(1.1);
  }

  &.carousel-indicator--active {
    background-color: #fff;
    width: 24px;
    border-radius: 4px;
  }
}

.blog-header__bg-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  pointer-events: none;
  will-change: opacity;
  transform: translateZ(0);
  opacity: var(--header-progress);
}

.blog-header__content-layer {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
  will-change: padding;
  transform: translateZ(0);
  padding-left: calc(48px - (24px * var(--header-progress)));
  padding-right: calc(48px - (24px * var(--header-progress)));
}

.blog-header__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: color 0.3s ease;
}

.text-light {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.text-dark {
  color: #1b2430;
}

.blog-header__eyebrow {
  margin: 0 0 6px;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
}

.blog-header__title {
  margin: 0 0 6px;
  font-size: 32px;
  font-weight: 700;
}

.blog-header__subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

@media screen and (max-width: 768px) {
  .blog-header__content {
    width: 100%;
    padding: 0;
    text-align: center;
  }

  .blog-header__title {
    font-size: 24px;
  }

  .blog-header__subtitle {
    font-size: 14px;
  }

  .carousel-text {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .carousel-title {
    font-size: 20px;
  }

  .carousel-subtitle {
    font-size: 14px;
  }
}
</style>
