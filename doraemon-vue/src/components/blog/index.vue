<template>
  <div class="blog" ref="blogRef" style="--progress: 0">
    <section class="blog-header">
      <div ref="blogHeaderCardRef" class="blog-header__card">
        <!-- Layer 1: 轮播图背景层 -->
        <div class="blog-header__carousel-layer">
          <div class="carousel-wrapper">
            <div
              v-for="(anime, index) in animeList"
              :key="anime.id"
              class="carousel-slide"
              :class="{ 'carousel-slide--active': index === currentSlideIndex }"
            >
              <router-link :to="`/anime/${anime.id}`" class="carousel-link">
                <img
                  :src="anime.image"
                  :alt="anime.name"
                  class="carousel-image"
                />
                <!-- 添加动漫名称和描述 -->
                <div class="carousel-text">
                  <h3 class="carousel-title">{{ anime.name }}</h3>
                  <p class="carousel-subtitle">{{ anime.subtitle }}</p>
                </div>
              </router-link>
            </div>
          </div>

          <!-- 轮播指示器 -->
          <div class="carousel-indicators">
            <button
              v-for="(anime, index) in animeList"
              :key="`indicator-${index}`"
              class="carousel-indicator"
              :class="{
                'carousel-indicator--active': index === currentSlideIndex,
              }"
              @click="goToSlide(index)"
              :aria-label="`Go to slide ${index + 1}`"
            ></button>
          </div>
        </div>

        <!-- Layer 2: 白色背景层 -->
        <div class="blog-header__bg-layer"></div>

        <!-- Layer 3: 内容层 -->
        <div class="blog-header__content-layer">
          <div class="blog-header__content text-light">
            <p class="blog-header__eyebrow">Anime World</p>
            <h1 class="blog-header__title">动漫世界</h1>
            <p class="blog-header__subtitle">探索经典动漫，分享精彩故事</p>
          </div>
        </div>
      </div>
    </section>

    <div class="blog-shell">
      <el-row :gutter="18" class="blog-layout">
        <el-col :lg="16" :md="16" :sm="24" :xs="24" class="main-col">
          <section class="panel">
            <div class="panel__header">
              <h3 class="panel__title">最新文章</h3>
              <div class="panel__header-right">
                <span class="panel__count" v-if="total">共 {{ total }} 篇</span>
                <span class="panel__hint">按发布时间展示</span>
              </div>
            </div>
            <el-skeleton v-if="loading" :rows="6" animated />

            <el-empty
              v-else-if="!posts.length"
              description="暂无文章，去写一篇吧"
            />

            <div v-else class="post-grid-container">
              <BlogCard
                v-for="post in posts"
                :key="post.id"
                :post="post"
                @click="goToPost(post.id)"
              />
            </div>

            <div v-if="total > pagination.size" class="pagination">
              <el-pagination
                :current-page="pagination.page"
                :page-size="pagination.size"
                :pager-count="7"
                :total="total"
                background
                layout="prev, pager, next"
                @current-change="currentChange"
              />
            </div>
          </section>
        </el-col>

        <el-col :lg="8" :md="8" :sm="24" :xs="24" class="aside-col">
          <aside class="aside">
            <section class="panel panel--aside">
              <div class="panel__header">
                <h3 class="panel__title">账号</h3>
                <span class="panel__hint">{{
                  isLogined ? "已登录" : "游客模式"
                }}</span>
              </div>

              <div class="user-card">
                <div class="user-card__avatar">
                  <img :src="userAvatar" alt="" />
                </div>
                <div class="user-card__info">
                  <div class="user-card__name">{{ userNickname }}</div>
                  <div class="user-card__desc">
                    {{
                      isLogined
                        ? "欢迎回来，去看看最新帖子吧"
                        : "登录后可发帖、收藏和评论"
                    }}
                  </div>
                </div>

                <el-dropdown trigger="click">
                  <el-button round size="small" class="user-card__more"
                    >操作</el-button
                  >
                  <template #dropdown>
                    <el-dropdown-menu>
                      <router-link v-if="!isLogined" to="/login">
                        <el-dropdown-item>登录/注册</el-dropdown-item>
                      </router-link>

                      <el-dropdown-item v-if="isLogined" @click="goToUserInfo"
                        >用户信息</el-dropdown-item
                      >

                      <router-link v-if="isLogined" to="/user/myBlogs">
                        <el-dropdown-item divided>我的发帖</el-dropdown-item>
                      </router-link>

                      <router-link v-if="isLogined" to="/user/feedback">
                        <el-dropdown-item divided>反馈</el-dropdown-item>
                      </router-link>

                      <el-dropdown-item divided @click="goToAdmin"
                        >后台管理</el-dropdown-item
                      >

                      <el-dropdown-item v-if="isLogined" divided @click="logout"
                        >退出登录</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>

              <div class="user-card__quick">
                <el-button
                  v-if="!isLogined"
                  round
                  size="large"
                  type="primary"
                  class="user-card__primary"
                  @click="goLogin"
                >
                  登录/注册
                </el-button>
                <el-button
                  v-else
                  round
                  size="large"
                  class="user-card__primary"
                  @click="goToUserInfo"
                >
                  个人中心
                </el-button>
              </div>

              <div class="cta-section">
                <p class="cta__desc">把灵感放进时光胶囊，分享给更多人。</p>
                <el-button
                  v-if="isLogined"
                  round
                  size="large"
                  type="primary"
                  class="cta__button"
                  @click="writeBlog"
                >
                  发表帖子
                </el-button>
                <el-button
                  v-else
                  round
                  size="large"
                  type="primary"
                  class="cta__button"
                  @click="goLogin"
                >
                  登录后发表
                </el-button>
              </div>
            </section>

            <section class="panel panel--aside aside-filter">
              <div class="panel__header">
                <h3 class="panel__title">筛选</h3>
                <span class="panel__hint">搜索 + 分类</span>
              </div>

              <div class="filter-row">
                <div class="filter-search">
                  <el-input
                    v-model="keyword"
                    clearable
                    placeholder="搜索标题或内容…"
                    size="large"
                    class="filter__input"
                    @keyup.enter="search"
                  >
                    <template #append>
                      <el-button @click="search">搜索</el-button>
                    </template>
                  </el-input>
                </div>
                <div class="filter-categories">
                  <button
                    type="button"
                    :class="['chip', { 'chip--active': categoryValue === 0 }]"
                    @click="selectCategory(0)"
                  >
                    全部
                  </button>
                  <button
                    v-for="item in categories"
                    :key="item.value"
                    type="button"
                    :class="[
                      'chip',
                      { 'chip--active': categoryValue === item.value },
                    ]"
                    @click="selectCategory(item.value)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import _axios from "@/api";
import { InterfaceUrl } from "@/api";
import { useRouter } from "vue-router";
import dateFunction from "@/utils/Date";
import fallbackCover from "@/assets/Doraemon/Doraemon.jpg";
import avatarFallback from "@/assets/avatar.png";
import axios from "axios";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { animeList } from "@/config/animeConfig";
import BlogCard from "./BlogCard.vue";

// 滚动进度状态 (0-1) - 仅用于逻辑控制，不用于视图更新
const scrollProgress = ref(0);

// 当前轮播图索引
const currentSlideIndex = ref(0);

// 滚动容器引用
const scrollContainer = ref<HTMLElement | null>(null);

// Blog header card 引用
const blogHeaderCardRef = ref<HTMLElement | null>(null);

// Blog 根容器引用
const blogRef = ref<HTMLElement | null>(null);

// 轮播图自动播放计时器
let carouselTimer: number | null = null;
let rafId: number | null = null;
let lastScrollY = 0;
let ticking = false;

// 使用 requestAnimationFrame 优化的滚动处理
const handleScroll = () => {
  const scrollY = getScrollY();

  // 只有滚动位置变化时才更新
  if (scrollY !== lastScrollY) {
    lastScrollY = scrollY;

    if (!ticking) {
      rafId = requestAnimationFrame(() => {
        const range = 250;
        // 计算 0 到 1 的进度
        const newProgress = Math.min(Math.max(scrollY / range, 0), 1);
        const progressStr = newProgress.toString();

        // --- 核心优化：只操作头部 Header，别的什么都不碰！ ---
        // 将变量挂载到父级 .blog，这样内部所有组件都能吃到这个变量
        if (blogRef.value) {
          blogRef.value.style.setProperty("--progress", progressStr);
        }

        // BoxShadow 还是需要单独设置在 Card 上
        if (blogHeaderCardRef.value) {
          // 阴影优化：不要每一帧都去改字符串，只在阈值切换时改
          const shadowStyle =
            newProgress > 0.8
              ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
              : "0 20px 50px -12px rgb(0 0 0 / 0.25)";

          if (blogHeaderCardRef.value.style.boxShadow !== shadowStyle) {
            blogHeaderCardRef.value.style.boxShadow = shadowStyle;
          }
        }

        // 仅保留非视觉布局的逻辑给 Vue (如暂停轮播)
        // 使用一个单独的 ref 来控制逻辑，避免频繁触发视图更新
        if (Math.abs(newProgress - scrollProgress.value) > 0.1) {
          scrollProgress.value = newProgress; // 降低更新频率
          if (newProgress > 0.1) stopCarousel();
          else startCarousel();
        }

        ticking = false;
      });
      ticking = true;
    }
  }
};

// 获取滚动位置
const getScrollY = (): number => {
  const scrollbarWrap = document.querySelector(".el-scrollbar__wrap");
  if (scrollbarWrap) {
    return (scrollbarWrap as HTMLElement).scrollTop;
  }
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

// 轮播图自动播放
const startCarousel = () => {
  if (carouselTimer) return;
  carouselTimer = window.setInterval(() => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % animeList.length;
  }, 5000);
};

// 停止轮播图自动播放
const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
};

// 手动切换轮播图
const goToSlide = (index: number) => {
  currentSlideIndex.value = index;
  stopCarousel();
  startCarousel();
};

// 组件挂载时添加滚动监听
onMounted(async () => {
  await nextTick();

  const scrollbarWrap = document.querySelector(".el-scrollbar__wrap");
  if (scrollbarWrap) {
    scrollbarWrap.addEventListener("scroll", handleScroll, { passive: true });
  } else {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  window.addEventListener("resize", handleScroll, { passive: true });

  handleScroll();
  startCarousel();
});

// 组件卸载时移除监听
onUnmounted(() => {
  const scrollbarWrap = document.querySelector(".el-scrollbar__wrap");
  if (scrollbarWrap) {
    scrollbarWrap.removeEventListener("scroll", handleScroll);
  } else {
    window.removeEventListener("scroll", handleScroll);
  }
  window.removeEventListener("resize", handleScroll);
  stopCarousel();

  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});

const store = useStore();
const router = useRouter();

type CategoryOption = {
  label: string;
  value: string;
};

type BlogPost = {
  id: string | number;
  title: string;
  content?: string;
  coverUrl?: string;
  create_time: string;
  createTimeMs: number;
  category?: string;
  nickname?: string;
  excerpt: string;
  readingMinutes: number;
  layoutType?: "hero" | "standard" | string;
};

const categories = ref<CategoryOption[]>([
  { label: "分享", value: "分享" },
  { label: "娱乐", value: "娱乐" },
  { label: "杂谈", value: "杂谈" },
]);

const keyword = ref<string>("");
const categoryValue = ref<string | number>(0);

const loading = ref(false);
const total = ref(0);
const pagination = reactive({
  page: 1,
  size: 8,
});

const posts = ref<BlogPost[]>([]);

onMounted(async () => {
  await fetchCategories();
  await fetchPosts();
});

const userInfo = computed(() => store.getters.getUserInfo || {});
const isLogined = computed(() => !!userInfo.value?.nickname);
const userAvatar = computed(() => userInfo.value?.avatarUrl || avatarFallback);
const userNickname = computed(() => userInfo.value?.nickname || "游客");

const ensureLogin = () => {
  const token = localStorage.getItem("token");
  if (!token || !userInfo.value?.id) {
    ElMessage.warning("请先登录");
    router.push("/login");
    return false;
  }
  return true;
};

const goLogin = () => {
  router.push("/login");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("vuex");
  router.push("/login");
};

const goToAdmin = () => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    router.push("/adminLogin");
    return;
  }

  axios
    .post(InterfaceUrl + "/admin/checkToken", { adminToken })
    .then((res) => {
      if (res?.data?.state === 0) router.push("/admin");
      else router.push("/adminLogin");
    })
    .catch(() => {
      router.push("/adminLogin");
    });
};

const goToUserInfo = () => {
  if (!ensureLogin()) return;
  _axios.post("/user/info").then(() => router.push("/user/info"));
};

const stripHtml = (html: string) => {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const buildExcerpt = (content?: string) => {
  const text = stripHtml(content || "");
  if (!text) return "暂无摘要";
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
};

const estimateReadingMinutes = (content?: string) => {
  const text = stripHtml(content || "");
  const minutes = Math.round(text.length / 300);
  return Math.max(1, minutes || 1);
};

const normalizePost = (raw: any): BlogPost => {
  const createTimeMs = raw?.create_time
    ? new Date(raw.create_time).getTime()
    : 0;
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    coverUrl: raw.coverUrl,
    category: raw.category,
    nickname: raw.nickname,
    createTimeMs,
    create_time: raw?.create_time ? dateFunction(raw.create_time) : "",
    excerpt: buildExcerpt(raw?.content),
    readingMinutes: estimateReadingMinutes(raw?.content),
    // 如果后端传了 layoutType 就用后端的，没有就默认为 standard
    layoutType: raw.layoutType || "standard",
  };
};

const fetchCategories = async () => {
  try {
    const res: any = await _axios.get("/blog/categories");
    const list = Array.isArray(res?.data) ? res.data : [];
    const options = list
      .filter((item: any) => item?.name)
      .filter(
        (item: any) =>
          item?.state === 1 ||
          item?.state === "1" ||
          item?.state === true ||
          item?.state == null
      )
      .map((item: any) => ({
        label: item.name,
        value: item.name,
      }));

    if (options.length) categories.value = options;
  } catch {
    // 兜底使用本地静态分类
  }
};

const fetchPosts = async () => {
  loading.value = true;
  try {
    const res: any = await _axios.post("/blog", null, {
      params: {
        page: pagination.page,
        pageSize: pagination.size,
        category: categoryValue.value,
        keyword: keyword.value || "",
      },
    });

    const data = res?.data || {};
    const list = Array.isArray(data?.blogArr) ? data.blogArr : [];
    const mapped = list
      .map(normalizePost)
      .sort((a: BlogPost, b: BlogPost) => b.createTimeMs - a.createTimeMs);

    // 写死：列表第一个帖子使用大卡片布局（占两列）
    posts.value = mapped.map((post, index) =>
      index === 0 ? { ...post, layoutType: "hero" } : post
    );
    total.value = data?.total || mapped.length;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchPosts();
});

const currentChange = (page: number) => {
  pagination.page = page;
  fetchPosts();
};

const search = () => {
  pagination.page = 1;
  fetchPosts();
};

const selectCategory = (value: string | number) => {
  categoryValue.value = value;
  pagination.page = 1;
  fetchPosts();
};

const goToPost = (id: string | number) => {
  router.push({ name: "blogPage", params: { id } });
};

const writeBlog = () => {
  router.push("/blog/postBlog");
};
</script>

<style lang="scss" scoped>
.blog {
  width: 100%;
  padding: 0 0 60px;
  position: relative;
  color: #1b2430;
  font-family: var(--font-family);
  --panel: #ffffff;
  --panel-strong: #ffffff;
  --ink: #1b2430;
  --muted: #5e6b7a;
  --accent: #2f76d2;
  --accent-2: #f5b942;
  --accent-3: #f0654a;
  --shadow: 0 14px 36px rgba(17, 24, 39, 0.12);
  --radius-lg: 26px;
  --radius-md: 18px;
  --radius-sm: 12px;
  --transition-speed: 0.5s;
  --transition-ease: cubic-bezier(0.76, 0, 0.24, 1);
}

.blog-shell {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 450px;
}

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

.blog-layout {
  align-items: flex-start;
  padding: 0 24px;
}

// 下半部分：固定容器宽度 1200px，右侧固定 300px（>= md）
@media screen and (min-width: 992px) {
  .aside-col {
    flex: 0 0 350px !important;
    max-width: 350px !important;
  }

  .main-col {
    flex: 1 1 auto !important;
    max-width: calc(100% - 350px) !important;
  }
}

.blog-header__card {
  pointer-events: auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  position: relative;
  transform: translateZ(0); /* 启用 GPU 加速 */

  // 使用 calc 执行线性插值
  // 高度: 380 -> 50 (380 - 330 * progress)
  height: calc(380px - (330px * var(--progress)));

  // Margin Top: 30 -> 0
  margin-top: calc(30px * (1 - var(--progress)));

  // Margin X: 30 -> 0
  margin-left: calc(30px * (1 - var(--progress)));
  margin-right: calc(30px * (1 - var(--progress)));

  // Radius: 24 -> 0
  border-radius: calc(24px * (1 - var(--progress)));

  // Max Width: 80vw -> 100vw
  max-width: calc(80vw + 100px + (100vw * var(--progress)));

  // 阴影效果 - 通过 JS 动态设置
  box-shadow: 0 20px 50px -12px rgb(0 0 0 / 0.25);

  // 【关键】告诉浏览器这些属性要高频变化，请开启硬件加速
  will-change: height, margin, border-radius, max-width;

  // 确保移除 transition (除了 shadow)，避免和滚动冲突
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

// Layer 1: 轮播图背景层
.blog-header__carousel-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  overflow: hidden;
  will-change: opacity;
  transform: translateZ(0); /* 启用 GPU 加速 */

  // opacity: 1 - progress * 1.5，防止出现负数 opacity
  opacity: max(0, calc(1 - var(--progress) * 1.5));
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
  transform: translateZ(0); /* 启用 GPU 加速 */

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
  transform: translateZ(0); /* 启用 GPU 加速 */
}

.carousel-indicators {
  position: absolute;
  bottom: 24px;
  right: 32px;
  display: flex;
  gap: 8px;
  z-index: 10;
  will-change: transform;
  transform: translateZ(0); /* 启用 GPU 加速 */
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

// Layer 2: 白色背景层
.blog-header__bg-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  pointer-events: none;
  will-change: opacity;
  transform: translateZ(0); /* 启用 GPU 加速 */

  // opacity: progress
  opacity: var(--progress);
}

// Layer 3: 内容层
.blog-header__content-layer {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
  will-change: padding;
  transform: translateZ(0); /* 启用 GPU 加速 */

  // Padding: 48 -> 24
  padding-left: calc(48px - (24px * var(--progress)));
  padding-right: calc(48px - (24px * var(--progress)));
}

.blog-header__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: color 0.3s ease;
}

// 文字颜色类
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

.carousel-link {
  display: block;
  text-decoration: none;
  height: 100%;
  width: 100%;
}

.carousel-item {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
  background: #f5f5f5;
}

// 轮播图文字内容
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

.panel {
  background: var(--panel);
  border-radius: var(--radius-lg);
  padding: 18px 18px 20px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(17, 24, 39, 0.06);
  position: relative;
  overflow: hidden;
}

// 左侧主内容区：去掉整块面板背景（只保留单个 BlogCard 自己的背景）
.main-col {
  .panel {
    background: transparent;
    box-shadow: none;
    border: none;
  }
}

.panel--filter {
  padding: 20px 22px;
  margin-bottom: 16px;
}

.filter-row {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.filter-search {
  flex: 1;
  min-width: 280px;
}

.filter__input {
  width: 100%;
}

.filter-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.panel__header {
  position: relative;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  z-index: 1;
  flex-wrap: wrap;
}

.panel__header-right {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.panel__title {
  margin: 0;
  font-size: 1.2rem;
  color: var(--ink);
}

.panel__hint {
  font-size: 0.85rem;
  color: var(--muted);
}

.panel__count {
  font-size: 0.85rem;
  color: var(--muted);
}

.panel__badge {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--accent-3);
  background: #fff1ee;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.aside-col {
  // 【关键】使用 margin-top 代替 transform
  // 这样不会破坏 position: sticky 的上下文
  // 让它初始时也跟着左侧一起往上跑一点
  margin-top: calc(-100px * var(--progress));
  will-change: margin-top; // 侧边栏内容少，margin 变化不会太卡

  // 【关键】Sticky 定位
  position: sticky;
  // 这里设置 85px 是为了让它固定在导航栏(50px)的下方，留一点空隙
  // 不要写 top: 0，否则就被导航栏盖住了
  top: 85px;

  align-self: flex-start;
  z-index: 10; // 确保层级
}

// 左侧列：负责"重"内容的流畅移动
.main-col {
  // 使用 GPU 加速向上拉，填补空隙
  // 计算逻辑：头部变小了约 330px，我们拉大概 100px-120px 即可
  transform: translateY(calc(-100px * var(--progress)));

  // 开启优化
  will-change: transform;
}

.aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aside-filter {
  position: relative;
  z-index: 1;
}

.aside-filter .filter-row {
  flex-direction: column;
  gap: 14px;
}

.aside-filter .filter-search {
  min-width: 0;
}

.user-card {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  align-items: center;
}

.user-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  overflow: hidden;
  background: #eff6ff;
  box-shadow: inset 0 0 0 1px rgba(29, 78, 216, 0.12);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.user-card__info {
  min-width: 0;
}

.user-card__name {
  font-weight: 800;
  color: var(--ink);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card__desc {
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.user-card__more {
  position: relative;
  z-index: 1;
}

.cta-section {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  padding: 18px 16px;
  background: #f9fafb;
  border-radius: var(--radius-md);
  border: 1px solid rgba(47, 118, 210, 0.1);
  text-align: center;
}

.cta-section .cta__title {
  margin: 0 0 6px;
  font-size: 1.1rem;
  color: var(--ink);
}

.cta-section .cta__desc {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.cta-section .cta__button {
  width: 100%;
  font-weight: 700;
}

.user-card__quick {
  position: relative;
  z-index: 1;
  margin-top: 14px;
}

.user-card__primary {
  width: 100%;
  font-weight: 700;
}

.user-card__write {
  width: 100%;
  font-weight: 700;
  margin-top: 10px;
  background: linear-gradient(135deg, #e84b3c 0%, #f3c14b 100%);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #d43f32 0%, #e8b23f 100%);
  }
}

.nav-list {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  color: var(--ink);
  border: 1px solid rgba(47, 118, 210, 0.12);
  background: #ffffff;
  box-shadow: 0 12px 26px rgba(18, 38, 63, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 34px rgba(18, 38, 63, 0.12);
    background: #ffffff;
  }

  &.router-link-active {
    border-color: rgba(47, 118, 210, 0.32);
    background: rgba(47, 118, 210, 0.12);
    color: var(--accent);
    font-weight: 800;
  }
}

.chip {
  appearance: none;
  border: 1px solid rgba(47, 118, 210, 0.16);
  background: #ffffff;
  color: var(--ink);
  font-family: var(--font-family);
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(18, 38, 63, 0.12);
  }
}

.chip--active {
  border-color: rgba(47, 118, 210, 0.35);
  background: rgba(47, 118, 210, 0.14);
  color: var(--accent);
  font-weight: 700;
}

.post-grid-container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding-bottom: 40px;
  align-items: start;
  grid-auto-flow: row;

  // 补充：给文章列表开启渲染优化
  // 如果文章很多，这行代码能救命。它告诉浏览器："屏幕外的文章先别花力气渲染"
  content-visibility: auto;
  contain-intrinsic-size: 200px; // 预估一个卡片高度
}

.pagination {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.cta__title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  color: var(--ink);
  position: relative;
  z-index: 1;
}

.cta__desc {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

.cta__button {
  position: relative;
  z-index: 1;
  font-weight: 700;
  box-shadow: 0 14px 28px rgba(47, 118, 210, 0.22);
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

  .post-grid-container {
    grid-template-columns: 1fr; // 手机端强制单列
    gap: 20px;
    // 手机端不需要 dense，因为都是单列，按顺序排就行
    grid-auto-flow: row;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
