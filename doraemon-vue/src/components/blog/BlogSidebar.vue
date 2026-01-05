<template>
  <div class="blog-sidebar">
    <section class="panel panel--aside">
      <div class="panel__header">
        <h3 class="panel__title">账号</h3>
        <span class="panel__hint">{{ isLogined ? "已登录" : "游客模式" }}</span>
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
          <el-button round size="small" class="user-card__more">操作</el-button>
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

      <div v-if="showCta" class="cta-section">
        <p class="cta__desc">{{ ctaText }}</p>
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

    <section v-if="showFilter" class="panel panel--aside aside-filter">
      <div class="panel__header">
        <h3 class="panel__title">筛选</h3>
        <span class="panel__hint">搜索 + 分类</span>
      </div>

      <div class="filter-row">
        <div class="filter-search">
          <el-input
            v-model="keywordProxy"
            clearable
            placeholder="搜索标题或内容…"
            size="large"
            class="filter__input"
            @keyup.enter="emitSearch"
          >
            <template #append>
              <el-button @click="emitSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="filter-categories">
          <button
            type="button"
            :class="['chip', { 'chip--active': categoryValueProxy === 0 }]"
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
              { 'chip--active': categoryValueProxy === item.value },
            ]"
            @click="selectCategory(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </section>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import _axios from "@/api";
import { InterfaceUrl } from "@/api";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import avatarFallback from "@/assets/avatar.png";

type CategoryOption = { label: string; value: string };

const props = withDefaults(
  defineProps<{
    showFilter?: boolean;
    showCta?: boolean;
    ctaText?: string;
    categories?: CategoryOption[];
    keyword?: string;
    categoryValue?: string | number;
  }>(),
  {
    showFilter: true,
    showCta: true,
    ctaText: "把灵感放进时光胶囊，分享给更多人。",
    categories: () => [],
    keyword: "",
    categoryValue: 0,
  }
);

const emit = defineEmits<{
  (e: "update:keyword", v: string): void;
  (e: "update:categoryValue", v: string | number): void;
  (e: "search"): void;
  (e: "selectCategory", v: string | number): void;
}>();

const keywordProxy = computed({
  get: () => props.keyword,
  set: (v: string) => emit("update:keyword", v),
});

const categoryValueProxy = computed({
  get: () => props.categoryValue,
  set: (v: string | number) => emit("update:categoryValue", v),
});

const emitSearch = () => emit("search");

const selectCategory = (value: string | number) => {
  categoryValueProxy.value = value;
  emit("selectCategory", value);
};

const store = useStore();
const router = useRouter();

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

const writeBlog = () => router.push("/blog/postBlog");
</script>

<style lang="scss" scoped>
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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
  color: #1b2430;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card__desc {
  color: #5e6b7a;
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

.user-card__quick {
  position: relative;
  z-index: 1;
  margin-top: 14px;
}

.user-card__primary {
  width: 100%;
  font-weight: 700;
}

.cta-section {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  padding: 18px 16px;
  background: #f9fafb;
  border-radius: 18px;
  border: 1px solid rgba(47, 118, 210, 0.1);
  text-align: center;
}

.cta-section .cta__desc {
  margin: 0 0 12px;
  color: #5e6b7a;
  font-size: 0.9rem;
  line-height: 1.6;
}

.cta-section .cta__button {
  width: 100%;
  font-weight: 700;
  box-shadow: 0 14px 28px rgba(47, 118, 210, 0.22);
}

.aside-filter {
  position: relative;
  z-index: 1;
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

.chip {
  appearance: none;
  border: 1px solid rgba(47, 118, 210, 0.16);
  background: #ffffff;
  color: #1b2430;
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
  color: #2f76d2;
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 14px;
  }

  .filter-search {
    min-width: 0;
  }
}
</style>
