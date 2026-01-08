<template>
  <section class="panel panel--aside aside-latest">
    <div class="panel__header">
      <h3 class="panel__title">最新帖子</h3>
      <span class="panel__hint">最新发布的文章</span>
    </div>

    <el-skeleton v-if="loading" :rows="5" animated />

    <div v-else-if="posts.length === 0" class="latest-empty">
      暂无帖子
    </div>

    <div v-else class="latest-posts">
      <router-link v-for="post in posts" :key="post.id" :to="{ name: 'blogPage', params: { id: post.id } }"
        class="latest-post-item">
        <div class="latest-post__title">{{ post.title }}</div>
        <div class="latest-post__meta">
          <span>{{ post.create_time }}</span>
          <span v-if="post.category" class="latest-post__category">{{ post.category }}</span>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import _axios from "@/api";
import dateFunction from "@/utils/Date";

type LatestPost = {
  id: string | number;
  title: string;
  create_time: string;
  category?: string;
};

const posts = ref<LatestPost[]>([]);
const loading = ref(false);

const fetchLatestPosts = async () => {
  loading.value = true;
  try {
    const res: any = await _axios.post("/blog", null, {
      params: {
        page: 1,
        pageSize: 5,
        category: 0,
        keyword: "",
      },
    });

    const data = res?.data || {};
    const list = Array.isArray(data?.blogArr) ? data.blogArr : [];

    posts.value = list
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        create_time: item?.create_time ? dateFunction(item.create_time) : "",
        category: item.category,
      }))
      .slice(0, 5);
  } catch (error) {
    console.error("获取最新帖子失败:", error);
    posts.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLatestPosts();
});
</script>

<style lang="scss" scoped>
.panel {
  background: #ffffff;
  border-radius: 26px;
  padding: 18px 18px 20px;
  box-shadow: 0 14px 36px rgba(17, 24, 39, 0.12);
  border: 1px solid rgba(17, 24, 39, 0.06);
  position: relative;
  overflow: hidden;
}

.panel--aside {
  padding: 18px 18px 20px;
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

.panel__title {
  margin: 0;
  font-size: 1.2rem;
  color: #1b2430;
}

.panel__hint {
  font-size: 0.85rem;
  color: #5e6b7a;
}

.aside-latest {
  position: relative;
  z-index: 1;
}

.latest-empty {
  text-align: center;
  color: #5e6b7a;
  padding: 20px 0;
  font-size: 0.9rem;
}

.latest-posts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.latest-post-item {
  display: block;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: #f0f4ff;
    border-color: rgba(47, 118, 210, 0.2);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(17, 24, 39, 0.08);
  }
}

.latest-post__title {
  color: #1b2430;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.latest-post__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #5e6b7a;
}

.latest-post__category {
  padding: 2px 8px;
  background: rgba(47, 118, 210, 0.1);
  color: #2f76d2;
  border-radius: 999px;
  font-weight: 500;
}
</style>
