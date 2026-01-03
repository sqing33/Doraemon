<template>
  <article
    class="blog-card group"
    :class="{
      'blog-card--hero': isHero,
      'blog-card--standard': !isHero,
    }"
    @click="$emit('click')"
  >
    <!-- 图片区域 -->
    <div class="card-media">
      <div class="media-inner">
        <img :src="coverSrc" :alt="post.title" class="card-image" />
        <el-tag class="card-tag" effect="light" size="small" :class="tagClass">
          {{ post.category || "Blog" }}
        </el-tag>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="card-content">
      <h3 class="content-title">{{ post.title }}</h3>
      <p v-if="isHero" class="content-excerpt">{{ post.excerpt }}</p>

      <div class="content-footer" :class="{ 'content-footer--hero': isHero }">
        <template v-if="isHero">
          <div class="author-inline">
            <img class="author-avatar" :src="authorAvatar" alt="" />
            <span class="author-name">{{ post.nickname || "Admin" }}</span>
          </div>
          <div class="content-meta content-meta--bottom">
            <span class="meta-date">{{ post.create_time?.split(" ")[0] }}</span>
            <span class="meta-dot"></span>
            <span class="meta-read">{{ post.readingMinutes }} 分钟阅读</span>
          </div>
        </template>
        <template v-else>
          <div class="content-meta content-meta--bottom">
            <span class="meta-date">{{ post.create_time?.split(" ")[0] }}</span>
            <span class="meta-dot"></span>
            <span class="meta-read">{{ post.readingMinutes }} 分钟阅读</span>
          </div>
          <span class="author-name">{{ post.nickname || "Admin" }}</span>
        </template>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import fallbackCover from "@/assets/Doraemon/Doraemon.jpg";
import avatarFallback from "@/assets/avatar.png";

// 定义 Props
const props = defineProps<{
  post: {
    title: string;
    excerpt: string;
    coverUrl?: string;
    avatarUrl?: string;
    category?: string;
    create_time?: string;
    readingMinutes?: number;
    nickname?: string;
    // 关键参数：由后端返回，或者前端处理时加上
    layoutType?: "hero" | "standard" | string;
  };
}>();

// 判断是否为大卡片
// 逻辑：如果数据里明确写了 hero，或者是 large，则为大卡片
const isHero = computed(() => {
  return props.post.layoutType === "hero" || props.post.layoutType === "large";
});

const coverSrc = computed(() => props.post.coverUrl || fallbackCover);
const authorAvatar = computed(() => props.post.avatarUrl || avatarFallback);

const tagClass = computed(() => {
  const raw = props.post.category || "";
  const category = raw.trim().toLowerCase();

  if (["设计", "design"].includes(category)) return "card-tag--design";
  if (["旅行", "travel"].includes(category)) return "card-tag--travel";
  if (["美食", "food"].includes(category)) return "card-tag--food";
  if (["生活", "lifestyle"].includes(category)) return "card-tag--life";
  if (["科技", "tech", "technology"].includes(category))
    return "card-tag--tech";

  // repo 里常见分类
  if (["分享", "share"].includes(category)) return "card-tag--share";
  if (["娱乐", "fun"].includes(category)) return "card-tag--fun";
  if (["杂谈", "chat"].includes(category)) return "card-tag--talk";

  // 默认
  return "card-tag--default";
});

defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.blog-card {
  position: relative;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 10px 26px rgba(17, 24, 39, 0.08);
  transition: transform 180ms ease, box-shadow 180ms ease,
    border-color 180ms ease;
  height: 325px;

  &:hover {
    box-shadow: 0 18px 44px rgba(17, 24, 39, 0.14);
    border-color: rgba(17, 24, 39, 0.12);

    .card-image {
      transform: scale(1.03);
    }
    .content-title {
      color: #4b5563;
    }
  }
}

/* --- Shared layout --- */
.card-media {
  position: relative;
  overflow: hidden;
  background: #f3f4f6;
}

.card-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card-tag :deep(.el-tag__content) {
  font-weight: 800;
}

/* Match the sample's "obvious" tag look */
.card-tag :deep(.el-tag) {
  border: 0;
  border-radius: 6px;
  padding: 6px 10px;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.12);
}

.card-tag--default :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.card-tag--design :deep(.el-tag) {
  background: #fff7ed;
  color: #9a3412;
}
.card-tag--travel :deep(.el-tag) {
  background: #ecfdf5;
  color: #065f46;
}
.card-tag--food :deep(.el-tag) {
  background: #fff1f2;
  color: #9f1239;
}
.card-tag--life :deep(.el-tag) {
  background: #f1f5f9;
  color: #334155;
}
.card-tag--tech :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
.card-tag--share :deep(.el-tag) {
  background: #eef2ff;
  color: #3730a3;
}
.card-tag--fun :deep(.el-tag) {
  background: #ecfeff;
  color: #155e75;
}
.card-tag--talk :deep(.el-tag) {
  background: #fefce8;
  color: #854d0e;
}

.card-media::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    rgba(17, 24, 39, 0),
    rgba(17, 24, 39, 0.08)
  );
}

.card-content {
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1 1 auto;
}

/* --- Hero样式 (跨列，横向) --- */
.blog-card--hero {
  // 关键：告诉 Grid 我要占两列
  grid-column: span 2;
  display: flex;
  flex-direction: row;
  height: 325px;

  .card-media {
    height: 100%;
    position: relative;
  }

  .card-content {
    width: 45%;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .card-tag {
    top: 14px;
    left: 14px;
  }

  .content-title {
    font-size: 1.7rem;
    margin-bottom: 12px;
  }
  .content-excerpt {
    -webkit-line-clamp: 3;
    margin-bottom: 18px;
  }
}

/* --- Standard样式 (单列，纵向) --- */
.blog-card--standard {
  // 关键：告诉 Grid 我只占一列
  grid-column: span 1;
  display: flex;
  flex-direction: column;

  .card-media {
    width: 100%;
    height: 225px;
    border-radius: 0 0 16px 16px;
  }

  .card-tag {
    top: 12px;
    left: 12px;
  }

  .content-title {
    font-size: 1rem;
    margin: auto 0;
  }
}

/* --- 公共子元素样式 --- */
.media-inner {
  width: 100%;
  height: 100%;
  position: relative;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease-out;
  display: block;
}
.content-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 12px;
}
.content-meta--bottom {
  margin: 0;
}
.meta-dot {
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 50%;
}
.content-title {
  font-family: var(--font-title);
  font-weight: 700;
  line-height: 1.22;
  color: #111827;
  transition: color 0.18s ease;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.content-excerpt {
  font-size: 0.95rem;
  line-height: 1.65;
  font-weight: 300;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.content-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  height: 25px;
  box-sizing: border-box;
  border-top: 1px solid rgba(17, 24, 39, 0.06);
  padding-top: 0;
}
.content-footer--hero {
  border-top: 0;
  height: 45px;
}
.author-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
  background: #f3f4f6;
}
.author-name {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

// 手机端强制全部变成 Standard 样式 (CSS Override)
@media screen and (max-width: 768px) {
  .blog-card {
    height: auto;
  }

  .blog-card--hero {
    grid-column: span 1;
    flex-direction: column;
    height: auto;

    .card-media {
      width: 100%;
      height: 240px;
    }
    .card-content {
      width: 100%;
      padding: 20px 18px 16px;
    }
    .content-title {
      font-size: 1.5rem;
    }
  }
}
</style>
