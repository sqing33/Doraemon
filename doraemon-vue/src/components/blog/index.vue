<template>
  <div class="blog" style="--progress: 0; --header-progress: 0; --header-offset: 450px">
    <BlogHeaderNav />

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
          <BlogSidebar
            :categories="categories"
            v-model:keyword="keyword"
            v-model:categoryValue="categoryValue"
            @search="search"
            @selectCategory="selectCategory"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import _axios from "@/api";
import { useRouter } from "vue-router";
import dateFunction from "@/utils/Date";
import BlogCard from "./BlogCard.vue";
import BlogHeaderNav from "./BlogHeaderNav.vue";
import BlogSidebar from "./BlogSidebar.vue";

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

const stripHtml = (html: string) => {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const stripMarkdown = (md: string) => {
  return (md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*?\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*?\]\([^)]+\)/g, " ")
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/^>\s+/gm, " ")
    .replace(/^[-*+]\s+/gm, " ")
    .replace(/^\d+\.\s+/gm, " ")
    .replace(/[*_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const isProbablyHtml = (value: string) => {
  return /<\/?[a-z][\s\S]*>/i.test(value || "");
};

const buildExcerpt = (content?: string) => {
  const raw = content || "";
  const text = isProbablyHtml(raw) ? stripHtml(raw) : stripMarkdown(raw);
  if (!text) return "暂无摘要";
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
};

const estimateReadingMinutes = (content?: string) => {
  const raw = content || "";
  const text = isProbablyHtml(raw) ? stripHtml(raw) : stripMarkdown(raw);
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
  padding-top: var(--header-offset, 450px);
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

.panel__header {
  position: relative;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  z-index: 1;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  box-shadow: 0 14px 36px rgba(17, 24, 39, 0.12);
  border: 1px solid rgba(17, 24, 39, 0.06);
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
  margin-top: calc(-100px * var(--progress));
  will-change: margin-top;
  position: sticky;
  top: 85px;
  align-self: flex-start;
  z-index: 10;
}

.main-col {
  transform: translateY(calc(-100px * var(--progress)));
  will-change: transform;
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
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  box-shadow: 0 14px 36px rgba(17, 24, 39, 0.12);
  border: 1px solid rgba(17, 24, 39, 0.06);
}

@media screen and (max-width: 768px) {
  .post-grid-container {
    grid-template-columns: 1fr; // 手机端强制单列
    gap: 20px;
    // 手机端不需要 dense，因为都是单列，按顺序排就行
    grid-auto-flow: row;
  }
}

</style>
