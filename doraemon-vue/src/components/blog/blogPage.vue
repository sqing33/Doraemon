<template>
  <div class="blog blog-page" style="--progress: 0; --header-progress: 1; --header-offset: 0px">
    <div class="blog-shell">
      <el-row :gutter="18" class="blog-layout">
        <el-col :lg="16" :md="16" :sm="24" :xs="24" class="main-col">
          <section ref="heroRef" class="blog-hero">
            <div class="blog-hero__inner">
              <router-link class="blog-hero__back" to="/blog">
                <el-icon>
                  <Back />
                </el-icon>
              </router-link>
              <div class="blog-hero__top">
                <div class="blog-hero__content">
                  <p class="blog-hero__label">Doraemon Blog</p>
                  <div class="blog-hero_title">
                    <h1 class="blog-title">{{ blog.title }}</h1>
                    <img v-if="blog.coverUrl" :src="blog.coverUrl" alt="" class="blog-cover" />
                  </div>
                </div>
              </div>
              <div class="blog-meta">
                <span class="blog-meta__item">{{
                  blog.nickname || "匿名"
                }}</span>
                <span class="blog-meta__dot">•</span>
                <span class="blog-meta__item">{{ blog.create_time }}</span>
                <template v-if="blog.category">
                  <span class="blog-meta__dot">•</span>
                  <span class="blog-meta__item">{{ blog.category }}</span>
                </template>
                <span class="blog-meta__dot">•</span>
                <span class="blog-meta__item">约 {{ readingMinutes }} 分钟阅读</span>
              </div>
            </div>
          </section>

          <section class="blog-body">
            <article class="blog-article">
              <div class="blog-divider"></div>
              <el-skeleton v-if="blogLoading" :rows="12" animated />
              <div v-else ref="contentRef" class="blog-content blog-content-container">
                <VditorViewer :content="blog.content" @rendered="buildToc" />
              </div>
            </article>
          </section>

          <BlogComments ref="commentsRef" :blog-id="id" />
        </el-col>

        <el-col :lg="8" :md="8" :sm="24" :xs="24" class="aside-col">
          <div class="blog-sidebar">
            <section ref="accountRef" class="side-card side-card--account">
              <div class="side-card__header">
                <h4 class="side-card__title">账号</h4>
                <span class="side-card__hint">{{
                  isLogined ? "已登录" : "游客模式"
                  }}</span>
              </div>

              <el-dropdown trigger="click">
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
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <router-link v-if="!isLogined" to="/login">
                      <el-dropdown-item>登录/注册</el-dropdown-item>
                    </router-link>

                    <el-dropdown-item v-if="isLogined" @click="goToUserInfo">
                      用户信息
                    </el-dropdown-item>

                    <router-link v-if="isLogined" to="/user/myBlogs">
                      <el-dropdown-item divided>我的发帖</el-dropdown-item>
                    </router-link>

                    <router-link v-if="isLogined" to="/user/feedback">
                      <el-dropdown-item divided>反馈</el-dropdown-item>
                    </router-link>

                    <el-dropdown-item divided @click="goToAdmin">
                      后台管理
                    </el-dropdown-item>

                    <el-dropdown-item v-if="isLogined" divided @click="logout">
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <div class="user-card__quick">
                <el-button v-if="!isLogined" round size="large" type="primary" class="user-card__primary"
                  @click="goLogin">
                  登录/注册
                </el-button>
                <el-button v-else round size="large" class="user-card__primary" @click="goToUserInfo">
                  个人中心
                </el-button>
              </div>
            </section>

            <div class="blog-actions-wrapper">
              <nav class="blog-actions">
                <button ref="shareRef" class="blog-action" type="button" @click="doShare">
                  <div class="blog-action__circle">
                    <el-icon>
                      <Share />
                    </el-icon>
                  </div>
                  <span class="blog-action__text">分享</span>
                </button>
                <el-popover :virtual-ref="shareRef" title="已复制链接" trigger="click" virtual-triggering width="300">
                  <span>{{ shareText }}</span>
                </el-popover>

                <button class="blog-action" type="button" @click="collect">
                  <div class="blog-action__circle">
                    <el-icon>
                      <Star />
                    </el-icon>
                  </div>
                  <span class="blog-action__text">收藏</span>
                </button>

                <button class="blog-action" type="button" @click="scrollToComments">
                  <div class="blog-action__circle">
                    <el-icon>
                      <ChatDotRound />
                    </el-icon>
                  </div>
                  <span class="blog-action__text">评论</span>
                </button>
              </nav>
            </div>

            <section class="blog-toc">
              <h4 class="blog-toc__title">文章目录</h4>
              <ul class="toc">
                <li v-for="item in toc" :key="item.id" :class="['toc-item', `toc-item--l${item.level}`]"
                  @click="scrollToHeading(item.id)">
                  {{ item.text }}
                </li>
                <li v-if="!toc.length" class="toc-item toc-item--empty">
                  暂无目录
                </li>
              </ul>
            </section>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  computed,
  nextTick,
  watch,
} from "vue";
import _axios, { InterfaceUrl } from "@/api";
import axios from "axios";
import { ElMessage } from "element-plus";
import {
  ChatDotRound,
  Share,
  Star,
  Back,
} from "@element-plus/icons-vue";
import dateFunction from "@/utils/Date";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BlogHeaderNav from "./BlogHeaderNav.vue";
import BlogComments from "./BlogComments.vue";
import VditorViewer from "@/utils/VditorViewer.vue";
import { useCodeCollapse } from "@/hooks/useCodeCollapse";
import avatarFallback from "@/assets/avatar.png";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// 注册插件
gsap.registerPlugin(ScrollTrigger);

const store = useStore();
const router = useRouter();

// GSAP 动画引用
const heroRef = ref<HTMLElement | null>(null);
const accountRef = ref<HTMLElement | null>(null);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

interface Blog {
  id: string;
  title: string;
  content: string;
  create_time: string;
  category?: string;
  coverUrl?: string;
  nickname?: string;
  username?: string;
  user_id?: number;
}

const blog = ref<Blog>({
  id: "",
  title: "",
  content: "",
  create_time: "",
  category: "",
  coverUrl: "",
  nickname: "",
  username: "",
  user_id: 0,
});

const blogLoading = ref(false);

const stripHtml = (html: string) => {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const stripMarkdown = (md: string) => {
  let result = md || "";

  // 提取代码块中的内容（保留代码内容用于计算阅读时长）
  result = result.replace(/```[\s\S]*?```/g, (match) => {
    // 移除代码块标记，但保留代码内容
    return match.replace(/^```\w*\n?/gm, "").replace(/```$/gm, "");
  });

  // 移除行内代码标记，但保留内容
  result = result.replace(/`([^`]+)`/g, "$1");

  // 移除图片
  result = result.replace(/!\[[^\]]*?\]\([^)]+\)/g, " ");

  // 移除链接，保留链接文本
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 移除标题标记
  result = result.replace(/^#{1,6}\s+/gm, " ");

  // 移除引用标记
  result = result.replace(/^>\s+/gm, " ");

  // 移除列表标记
  result = result.replace(/^[-*+]\s+/gm, " ");
  result = result.replace(/^\d+\.\s+/gm, " ");

  // 移除加粗、斜体、删除线标记
  result = result.replace(/[*_~]+/g, " ");

  // 合并多余空格
  result = result.replace(/\s+/g, " ");

  return result.trim();
};

const contentToText = (raw: string) => {
  // Handle both legacy HTML and pure Markdown content.
  return stripMarkdown(stripHtml(raw || ""));
};

const readingMinutes = computed(() => {
  const text = contentToText(blog.value.content || "");
  const minutes = Math.round(text.length / 300);
  return Math.max(1, minutes || 1);
});

const contentRef = ref<HTMLElement | null>(null);
const toc = ref<Array<{ id: string; text: string; level: number }>>([]);

// 初始化代码折叠功能
const { initCodeCollapse } = useCodeCollapse(".blog-content-container");

const buildToc = () => {
  toc.value = [];
  const container = contentRef.value;
  if (!container) return;

  // 等待一小段时间确保 DOM 完全更新
  setTimeout(() => {
    const vditorReset = container.querySelector(".vditor-reset");
    const searchContainer = vditorReset || container;

    const headings = Array.from(
      searchContainer.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );

    headings.forEach((el, index) => {
      const text = (el.textContent || "").trim();
      if (!text) return;
      const level = Number(el.tagName.slice(1)) || 1;
      const id = el.id || `heading-${index + 1}`;
      el.id = id;
      toc.value.push({ id, text, level });
    });
  }, 100);
};

watch(
  () => blog.value.content,
  async () => {
    await nextTick();
    // 延迟 300ms 等待 Vditor 渲染完成
    setTimeout(() => initCodeCollapse(), 300);
  }
);

const commentsRef = ref<any>(null);
const scrollToComments = () => {
  commentsRef.value?.scrollToComments();
};

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const ensureLogin = () => {
  const token = localStorage.getItem("token");
  if (!token || !userInfo.value?.id) {
    ElMessage.warning("请先登录");
    router.push("/login");
    return false;
  }
  return true;
};

const collect = () => {
  if (!ensureLogin()) return;
  _axios
    .post("/user/collect", {
      blog_id: props.id,
      user_id: userInfo.value.id,
    })
    .then((res) => {
      ElMessage.success("收藏成功");
    });
};

onMounted(async () => {
  blogLoading.value = true;
  _axios
    .post("/blog/blogPage", null, { params: { id: props.id } })
    .then(async (res) => {
      blog.value = res.data;
      blog.value.create_time = dateFunction(blog.value.create_time);
      await nextTick();
      // 延迟 300ms 等待 Vditor 渲染完成
      setTimeout(() => initCodeCollapse(), 300);
    })
    .finally(() => {
      blogLoading.value = false;
    });

  // GSAP 动画逻辑
  await nextTick();
  // 稍微延迟一下确保 ElementPlus 的结构完全生成
  await new Promise((r) => setTimeout(r, 500));

  // 找到 Element Plus 的滚动容器
  const scrollEl = document.querySelector(".el-scrollbar__wrap");

  if (!heroRef.value || !accountRef.value || !scrollEl) {
    console.warn("GSAP: 缺少必要的 DOM 元素");
    return;
  }

  // 创建时间轴 (Timeline)
  const tl = gsap.timeline({
    scrollTrigger: {
      scroller: ".el-scrollbar__wrap", // 关键：告诉 GSAP 监听哪个容器滚动
      trigger: "body", // 触发源（整个页面）
      start: "top top", // 从顶部开始
      end: "300px top", // 滚动 300px 后结束动画
      scrub: 1, // 1秒的平滑缓冲 (像 PR 拖拽一样的感觉)
    },
  });

  // 左侧大标题
  tl.to(
    heroRef.value,
    {
      x: () => {
        const rect = heroRef.value!.getBoundingClientRect();
        const currentLeft = rect.left;
        return -currentLeft;
      },
      y: -50,
      width: () => {
        const screenW = window.innerWidth;
        return screenW - 182;
      },
      height: 50,
      borderRadius: 0,
      padding: 0,
      borderLeftWidth: 0,
      transformOrigin: "left top",
      duration: 1,
    },
    0
  );

  tl.to(
    heroRef.value!.querySelector(".blog-hero__inner"),
    {
      padding: 0,
      height: 50,
      borderRadius: 0,
      transformOrigin: "left center",
      duration: 1.5,
    },
    0
  );

  // Doraemon Blog 文字
  tl.to(
    heroRef.value!.querySelector(".blog-hero__label"),
    {
      autoAlpha: 0,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  // 标题和封面的父容器相关元素
  const titleContainerEl = heroRef.value!.querySelector(
    ".blog-hero_title"
  ) as HTMLElement;
  const titleEl = heroRef.value!.querySelector(".blog-title") as HTMLElement;
  const coverEl = heroRef.value!.querySelector(
    ".blog-cover"
  ) as HTMLImageElement;

  // 获取父级 hero 的位置信息（用于补偿父级移动带来的偏移）
  const heroRect = heroRef.value!.getBoundingClientRect();

  // 获取 inner 的左内边距（因为动画中 padding 会变成 0，导致内容左移，需要补偿回来）
  const innerEl = heroRef.value!.querySelector(".blog-hero__inner");
  const innerStyle = innerEl ? window.getComputedStyle(innerEl) : null;
  const innerPaddingLeft = innerStyle
    ? parseFloat(innerStyle.paddingLeft) || 0
    : 0;

  // 1. 预计算【标题】终点宽度
  let targetTitleWidth = 0;
  if (titleEl) {
    const originalFontSize = titleEl.style.fontSize;
    const originalWidth = titleEl.style.width;
    const originalWhiteSpace = titleEl.style.whiteSpace;

    titleEl.style.fontSize = "24px";
    titleEl.style.width = "max-content";
    titleEl.style.whiteSpace = "nowrap";

    targetTitleWidth = titleEl.getBoundingClientRect().width;

    titleEl.style.fontSize = originalFontSize;
    titleEl.style.width = originalWidth;
    titleEl.style.whiteSpace = originalWhiteSpace;
  }

  // 2. 预计算【封面】终点宽度
  let targetCoverWidth = 0;
  if (coverEl) {
    const naturalWidth = coverEl.naturalWidth || coverEl.width || 280;
    const naturalHeight = coverEl.naturalHeight || coverEl.height || 200;
    const targetHeight = 45;
    targetCoverWidth = (naturalWidth / naturalHeight) * targetHeight;
  }

  // 3. 计算终点总宽度 (标题 + 图片 + 间距10)
  const totalTargetWidth =
    targetTitleWidth + (targetCoverWidth ? targetCoverWidth + 10 : 0);

  // 4. 计算修正后的居中位移 X
  const containerRect = titleContainerEl.getBoundingClientRect();
  const currentLeft = containerRect.left; // 当前标题容器在屏幕的绝对左坐标
  const windowWidth = window.innerWidth;

  // 公式解析：
  // (屏幕中心 - 物体一半宽) -> 这是理想的绝对坐标
  // - currentLeft -> 减去当前坐标，得到需要的位移量
  // + heroRect.left -> 补偿：因为父级向左移动了 heroRect.left 这么多，我们要反向加回来
  // + innerPaddingLeft -> 补偿：因为父级 padding 没了，内容自然左移了，我们要反向推回来
  const finalX =
    windowWidth / 2 -
    totalTargetWidth / 2 -
    currentLeft +
    heroRect.left +
    innerPaddingLeft;

  tl.to(
    titleContainerEl,
    {
      x: finalX,
      y: -20,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  // 标题文字变形动画
  tl.to(
    titleEl,
    {
      fontSize: 24,
      width: targetTitleWidth,
      duration: 1,
    },
    0
  );

  // 封面图变形动画
  if (coverEl) {
    tl.to(
      coverEl,
      {
        width: targetCoverWidth,
        height: 45,
        borderRadius: 3,
        marginTop: 2,
        marginLeft: 10,
        duration: 1,
      },
      0
    );
  }

  // 作者、发布时间
  tl.to(
    heroRef.value!.querySelector(".blog-meta"),
    {
      y: -95,
      marginTop: 0,
      marginLeft: 70,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  tl.to(
    heroRef.value!.querySelector(".blog-hero__back"),
    {
      x: 80,
      y: 70,
      width: 40,
      height: 40,
      borderRadius: 20,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  tl.to(
    heroRef.value!.querySelector(".el-icon"),
    {
      x: 0,
      y: 0,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  // 让 category 和 reading time 逐渐消失
  const metaEl = heroRef.value!.querySelector(".blog-meta");
  if (metaEl) {
    const metaItems = metaEl.querySelectorAll(".blog-meta__item");
    const metaDots = metaEl.querySelectorAll(".blog-meta__dot");

    if (metaDots[1]) {
      tl.to(
        metaDots[1],
        {
          autoAlpha: 0,
          duration: 1,
        },
        0
      );
    }

    // category（第3个 item，索引2）和 dot（第3个 dot，索引2）
    if (metaItems[2]) {
      tl.to(
        metaItems[2],
        {
          autoAlpha: 0,
          duration: 1,
        },
        0
      );
    }
    if (metaDots[2]) {
      tl.to(
        metaDots[2],
        {
          autoAlpha: 0,
          duration: 1,
        },
        0
      );
    }

    // reading time（第4个 item，索引3）和 dot（第4个 dot，索引3）
    if (metaItems[3]) {
      tl.to(
        metaItems[3],
        {
          autoAlpha: 0,
          duration: 1,
        },
        0
      );
    }
    if (metaDots[3]) {
      tl.to(
        metaDots[3],
        {
          autoAlpha: 0,
          duration: 1,
        },
        0
      );
    }
  }

  // 右侧账号卡片
  tl.to(
    accountRef.value,
    {
      x: () => {
        const rect = accountRef.value!.getBoundingClientRect();
        const currentRight = rect.right;
        const windowWidth = window.innerWidth;
        return windowWidth - (currentRight - 150);
      },
      y: -10,
      width: 200,
      borderRadius: 0,
      backgroundColor: "rgba(255, 255, 255, 0.92)",
      padding: 0,
      transformOrigin: "right top",
      duration: 1,
    },
    0
  );

  tl.to(
    accountRef.value,
    {
      height: 50,
      transformOrigin: "right top",
      duration: 1.5,
    },
    0
  );

  tl.to(
    accountRef.value!.querySelector(".user-card"),
    {
      top: -46,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  tl.to(
    accountRef.value!.querySelector(".user-card__avatar"),
    {
      width: 40,
      height: 40,
      marginLeft: 10,
      marginTop: 5,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  tl.to(
    accountRef.value!.querySelector(".user-card__name"),
    {
      margin: 0,
      transformOrigin: "left center",
      duration: 1,
    },
    0
  );

  tl.to(
    accountRef.value!.querySelector(".side-card__header"),
    {
      autoAlpha: 0,
      transformOrigin: "left center",
      duration: 0.5,
    },
    0
  );

  tl.to(
    accountRef.value!.querySelector(".user-card__desc"),
    {
      autoAlpha: 0,
      height: 0,
      transformOrigin: "left center",
      duration: 0.5,
    },
    0
  );
});

// 销毁时清理，防止内存泄漏
onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});

const shareRef = ref();

const shareText = ref("");

const doShare = () => {
  const title: string = blog.value.title || "分享链接";
  const url: string = window.location.href;
  shareText.value = `${title}: ${url}`;
  copyToClipboard(shareText.value);
};

const copyToClipboard = (text: string) => {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .catch(() => ElMessage.warning("复制失败，请手动复制"));
    return;
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  } catch {
    ElMessage.warning("复制失败，请手动复制");
  }
};

const userInfo = computed(() => store.getters.getUserInfo || {});
const isLogined = computed(() => !!userInfo.value?.nickname);
const userAvatar = computed(() => userInfo.value?.avatarUrl || avatarFallback);
const userNickname = computed(() => userInfo.value?.nickname || "游客");

const goLogin = () => router.push("/login");

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("vuex");
  router.push("/login");
};

const goToUserInfo = () => {
  if (!ensureLogin()) return;
  _axios.post("/user/info").then(() => router.push("/user/info"));
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
</script>

<style lang="scss" scoped>
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.side-card__hint {
  color: var(--muted);
  font-size: 0.85rem;
}

.blog-page {
  --paper: rgba(255, 255, 255, 0.92);
  --paper-strong: rgba(255, 255, 255, 0.98);
  --ink: #1a2230;
  --muted: #667085;
  --accent: #2f76d2;
  --accent-soft: rgba(47, 118, 210, 0.12);
  --accent-2: #e84b3c;
  --accent-3: #f3c14b;
  --shadow: 0 18px 60px rgba(18, 38, 63, 0.18);
  --radius-lg: 26px;
  --radius-md: 18px;
  --radius-sm: 12px;
  position: relative;
  padding: 0;
  color: var(--ink);
  font-family: var(--font-family);
  z-index: 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: -1;
  }

  &::before {
    background: radial-gradient(circle at 15% 20%,
        rgba(47, 118, 210, 0.25),
        transparent 45%),
      radial-gradient(circle at 85% 10%,
        rgba(243, 193, 75, 0.25),
        transparent 40%),
      radial-gradient(circle at 85% 80%,
        rgba(232, 75, 60, 0.18),
        transparent 45%);
  }

  &::after {
    background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.6),
        rgba(255, 255, 255, 0));
  }
}

.blog-shell {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 60px;
}

.blog-layout {
  align-items: flex-start;
  padding: 0 24px;
}

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

.aside-col {
  position: sticky;
  top: 10px;
  align-self: flex-start;
  z-index: 10;
}

.blog-hero,
.blog-body {
  width: 100%;
}

.blog-hero {
  position: sticky;
  top: 50px;
  z-index: 20;
}

.blog-hero__inner {
  background: var(--paper);
  border-radius: var(--radius-lg);
  padding: 32px 36px 28px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 1);
    pointer-events: none;
  }
}

.blog-hero__back {
  position: absolute;
  top: -65px;
  left: -65px;
  width: 125px;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(47, 118, 210, 0.1);
  border-radius: 50%;
  color: var(--accent);
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(47, 118, 210, 0.2);
    transform: scale(1.1);
  }

  .el-icon {
    font-size: 1.4rem;
    transform: translate(25px, 25px);
  }
}

.blog-hero__top {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 20px;
}

.blog-hero__content {
  position: relative;
  flex: 1;
  min-width: 0;
}

.blog-hero__label {
  position: relative;
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent-2);
  font-weight: 600;
}

.blog-hero_title {
  display: flex;
}

.blog-title {
  position: relative;
  margin: 10px 0 8px;
  font-size: clamp(1.8rem, 2.5vw + 1rem, 2.8rem);
  line-height: 1.15;
}

.blog-meta {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.95rem;
  padding-top: 20px;
  border-top: 1px solid rgba(47, 118, 210, 0.12);
}

.blog-meta__dot {
  color: var(--accent-3);
  font-size: 1.4rem;
  line-height: 0;
}

.blog-cover {
  position: relative;
  width: 280px;
  height: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: 0 12px 40px rgba(18, 38, 63, 0.2);
  flex-shrink: 0;
}

.blog-body {
  margin-top: 28px;
  animation: fadeUp 0.8s ease 0.12s both;
}

.blog-actions-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(47, 118, 210, 0.15);
  padding: 24px 20px 20px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.12);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
        rgba(47, 118, 210, 0.05),
        rgba(243, 193, 75, 0.04));
    pointer-events: none;
  }
}

.blog-actions {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  position: relative;
}

.blog-action {
  appearance: none;
  background: transparent;
  border: none;
  outline: none;
  color: var(--ink);
  font-family: var(--font-family);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    .blog-action__circle {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(47, 118, 210, 0.25);
    }
  }

  &:active {
    transform: translateY(0);

    .blog-action__circle {
      transform: scale(1);
    }
  }

  &:focus {
    outline: none;
  }
}

.blog-action__circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.9) 100%);
  border: 1px solid rgba(47, 118, 210, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(18, 38, 63, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 28px;
    height: 28px;
    color: var(--accent);
  }
}

.blog-action__text {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.2;
  text-align: center;
  color: var(--ink);
}

.side-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  padding: 14px 14px 16px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.12);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 1);

    pointer-events: none;
  }
}

.side-card--account {
  background: rgba(255, 255, 255, 1);
}

.side-card__title {
  position: relative;
  margin: 0 0 12px;
  font-size: 1rem;
  color: var(--ink);
}

.user-card {
  position: relative;
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
  background: rgba(47, 118, 210, 0.08);
  box-shadow: inset 0 0 0 1px rgba(47, 118, 210, 0.12);

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
}

.user-card__quick {
  position: relative;
  margin-top: 14px;
}

.user-card__primary {
  width: 100%;
  font-weight: 700;
}

.nav-list {
  position: relative;
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
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 12px 26px rgba(18, 38, 63, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 34px rgba(18, 38, 63, 0.12);
    background: rgba(255, 255, 255, 0.92);
  }

  &.router-link-active {
    border-color: rgba(47, 118, 210, 0.32);
    background: rgba(47, 118, 210, 0.12);
    color: var(--accent);
    font-weight: 800;
  }
}

.side-info {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.92rem;
}

.side-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.side-row__label {
  color: var(--muted);
  flex: none;
}

.side-row__value {
  color: var(--ink);
  font-weight: 600;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(47, 118, 210, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(47, 118, 210, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(47, 118, 210, 0.5);
    }
  }
}

.toc-item {
  padding: 8px 10px;
  border-radius: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    background: rgba(47, 118, 210, 0.08);
    color: var(--accent);
    transform: translateY(-1px);
  }
}

.toc-item--l2 {
  padding-left: 14px;
  font-size: 0.95em;
}

.toc-item--l3 {
  padding-left: 20px;
  font-size: 0.9em;
}

.toc-item--l4 {
  padding-left: 26px;
  font-size: 0.85em;
}

.toc-item--l5 {
  padding-left: 32px;
  font-size: 0.8em;
}

.toc-item--l6 {
  padding-left: 38px;
  font-size: 0.75em;
}

.toc-item--empty {
  padding: 12px 10px;
  color: var(--muted);
  font-size: 0.9em;
  text-align: center;
  font-style: italic;
  cursor: default;

  &:hover {
    background: transparent;
    color: var(--muted);
    transform: none;
  }
}

.blog-toc {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(47, 118, 210, 0.15);
  padding: 24px 20px 20px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.12);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
        rgba(47, 118, 210, 0.05),
        rgba(243, 193, 75, 0.04));
    pointer-events: none;
  }
}

.blog-toc__title {
  position: relative;
  margin: 0 0 16px;
  font-size: 1.1rem;
  color: var(--ink);
  font-weight: 700;
}

.blog-article {
  background: var(--paper);
  border-radius: var(--radius-lg);
  padding: 32px 36px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(47, 118, 210, 0.12);
    pointer-events: none;
  }
}

.blog-divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(47, 118, 210, 0.5),
      rgba(243, 193, 75, 0.6),
      transparent);
  margin-bottom: 24px;
}

.blog-content {
  position: relative;
  font-size: 1.05rem;
  line-height: 1.9;
  color: #2a303c;
}

/* 代码块折叠样式 */
:deep(.code-wrapper) {
  position: relative;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1em;
  max-height: 300px;
}

/* 折叠状态：限制高度 */
:deep(.code-wrapper.collapsed) {
  max-height: 300px;
  /* 与 JS 中的 MAX_HEIGHT 保持一致 */
}

/* 展开状态：不限制高度 */
:deep(.code-wrapper.expanded) {
  /* max-height 会由 JS 动态设置 */
}

/* 遮罩层 */
:deep(.code-mask) {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  /* 渐变高度 */
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  pointer-events: auto;
  padding-bottom: 10px;
  user-select: none;
  transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
}

/* 深色模式适配 */
.dark :deep(.code-mask) {
  background: linear-gradient(to bottom,
      rgba(31, 41, 55, 0),
      rgba(31, 41, 55, 1));
}

:deep(.mask-content) {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  user-select: none;
  transform: translateY(0);
}

:deep(.mask-content:hover) {
  background: #f3f4f6;
  color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.mask-content:active) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 展开后的遮罩样式（变为底部的收起按钮，不需要渐变遮挡了） */
:deep(.code-mask.is-expanded-mask) {
  position: relative;
  /* 不再覆盖 */
  height: 40px;
  background: none !important;
  margin-top: -20px;
  /* 调整位置 */
  padding-bottom: 0;
  opacity: 0.9;
}

:deep(.code-mask.is-expanded-mask:hover) {
  opacity: 1;
}

:deep(.code-mask.is-expanded-mask .mask-content) {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.code-mask.is-expanded-mask .mask-content:hover) {
  background: #f3f4f6;
  color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1000px) {
  .blog-layout {
    padding: 0 12px;
  }

  .blog-hero__inner {
    padding: 24px;
  }

  .blog-actions-wrapper {
    padding: 20px 16px 16px;
  }

  .blog-actions {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .blog-action {
    flex: 1 1 auto;
    min-width: 70px;
  }

  .blog-action__circle {
    width: 52px;
    height: 52px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .blog-action__text {
    font-size: 11px;
  }

  .blog-toc {
    padding: 20px 16px 16px;
    margin-top: 16px;
  }

  .blog-toc__title {
    font-size: 1rem;
  }

  .toc {
    max-height: 400px;
  }

  .blog-article {
    padding: 24px;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
