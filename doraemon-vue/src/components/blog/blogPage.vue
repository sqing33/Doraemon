<template>
  <div class="blog-page">
    <section class="blog-hero">
      <div class="blog-hero__inner">
        <p class="blog-hero__label">Doraemon Blog</p>
        <h1 class="blog-title">{{ blog.title }}</h1>
        <div class="blog-meta">
          <span class="blog-meta__item">{{ blog.nickname || "匿名" }}</span>
          <span class="blog-meta__dot">•</span>
          <span class="blog-meta__item">{{ blog.create_time }}</span>
          <template v-if="blog.category">
            <span class="blog-meta__dot">•</span>
            <span class="blog-meta__item">{{ blog.category }}</span>
          </template>
          <span class="blog-meta__dot">•</span>
          <span class="blog-meta__item">约 {{ readingMinutes }} 分钟阅读</span>
        </div>
        <img v-if="blog.coverUrl" :src="blog.coverUrl" alt="" class="blog-cover" />
      </div>
    </section>

    <section class="blog-body">
      <article class="blog-article">
        <div class="blog-divider"></div>
        <el-skeleton v-if="blogLoading" :rows="12" animated />
        <div
          v-else
          ref="contentRef"
          class="blog-content"
          v-html="blog.content"
        ></div>
      </article>

      <aside class="blog-side">
        <section class="side-card">
          <h4 class="side-card__title">账号</h4>
          <div class="user-card">
            <div class="user-card__avatar">
              <img :src="userAvatar" alt="" />
            </div>
            <div class="user-card__info">
              <div class="user-card__name">{{ userNickname }}</div>
              <div class="user-card__desc">
                {{
                  isLogined
                    ? "已登录：可收藏、评论、回复"
                    : "登录后可收藏、评论、回复"
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

                  <el-dropdown-item
                    v-if="isLogined"
                    divided
                    @click="logout"
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
        </section>

        <nav class="blog-actions">
          <router-link class="blog-action" to="/blog">
            <el-icon>
              <Tickets />
            </el-icon>
            返回帖子首页
          </router-link>

          <button
            ref="shareRef"
            class="blog-action"
            type="button"
            @click="doShare"
          >
            <el-icon>
              <Share />
            </el-icon>
            分享
          </button>
          <el-popover
            :virtual-ref="shareRef"
            title="已复制链接"
            trigger="click"
            virtual-triggering
            width="300"
          >
            <span>{{ shareText }}</span>
          </el-popover>

          <button class="blog-action" type="button" @click="collect">
            <el-icon>
              <Star />
            </el-icon>
            收藏
          </button>

          <button class="blog-action" type="button" @click="scrollToComments">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            评论
          </button>
        </nav>

        <section class="side-card">
          <h4 class="side-card__title">站点导航</h4>
          <div class="nav-list">
            <router-link class="nav-item" to="/">
              <el-icon><House /></el-icon>
              首页
            </router-link>
            <router-link class="nav-item" to="/author">
              <el-icon><EditPen /></el-icon>
              作者介绍
            </router-link>
            <router-link class="nav-item" to="/character">
              <el-icon><User /></el-icon>
              动漫人物
            </router-link>
            <router-link class="nav-item" to="/blog">
              <el-icon><Connection /></el-icon>
              用户互动
            </router-link>
            <router-link class="nav-item" to="/news">
              <el-icon><Tickets /></el-icon>
              新闻活动
            </router-link>
            <router-link class="nav-item" to="/website">
              <el-icon><Link /></el-icon>
              相关网站
            </router-link>
          </div>
        </section>

        <section class="side-card">
          <h4 class="side-card__title">文章信息</h4>
          <div class="side-info">
            <div class="side-row">
              <span class="side-row__label">作者</span>
              <span class="side-row__value">{{ blog.nickname || "匿名" }}</span>
            </div>
            <div class="side-row">
              <span class="side-row__label">分类</span>
              <span class="side-row__value">{{ blog.category || "未分类" }}</span>
            </div>
            <div class="side-row">
              <span class="side-row__label">发布时间</span>
              <span class="side-row__value">{{ blog.create_time }}</span>
            </div>
            <div class="side-row">
              <span class="side-row__label">阅读时长</span>
              <span class="side-row__value"
                >约 {{ readingMinutes }} 分钟</span
              >
            </div>
          </div>
        </section>

        <section v-if="toc.length" class="side-card">
          <h4 class="side-card__title">目录</h4>
          <ul class="toc">
            <li
              v-for="item in toc"
              :key="item.id"
              :class="['toc-item', `toc-item--l${item.level}`]"
              @click="scrollToHeading(item.id)"
            >
              {{ item.text }}
            </li>
          </ul>
        </section>
      </aside>
    </section>

    <section ref="commentsRef" class="blog-comments">
      <div class="comment-header">
        <h3>评论</h3>
        <div class="comment-count">
          <div v-if="commentsLength === 0">（还没有评论，快来发表吧~）</div>
          <div v-else>（{{ commentsLength }}）</div>
        </div>
      </div>

      <div class="comment-editor">
        <RichTextEditor
          ref="commentEditorRef"
          class="comment-editor__input"
          :style="{ width: '100%', height: '30vh' }"
        />

        <el-button
          plain
          class="comment-submit"
          type="primary"
          @click="submitComment"
          >发布
        </el-button>
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-card">
        <div class="comment-top">
          <img alt="" class="avatar" src="../../assets/avatar.png" />
          <div class="comment-author">
            <strong>{{ comment.nickname }}</strong>
            <span>说：</span>
          </div>
        </div>

        <div class="comment-body" v-html="comment.content"></div>

        <div class="comment-footer">
          <span class="comment-date">
            {{ dateFunction(comment.create_time) }}
          </span>
          <div class="comment-actions">
            <button
              class="comment-action"
              type="button"
              @click="doLike(comment.id)"
            >
              <img alt="" src="../../assets/comment/dianzan.png" />
              <span>{{ comment.like }}</span>
            </button>
            <button
              class="comment-action"
              type="button"
              @click="
                pid = comment.id;
                pname = comment.nickname;
                replyCommentDialogVisible = true;
              "
            >
              <img alt="" src="../../assets/comment/huifu.png" />
              <span>回复</span>
            </button>
          </div>
        </div>

        <div
          v-for="childrenComment in comment.children"
          :key="childrenComment.id"
          class="comment-reply"
        >
          <div class="comment-top comment-top--compact">
            <img
              alt=""
              class="avatar avatar--small"
              src="../../assets/avatar.png"
            />
            <div class="comment-author">
              <strong>{{ childrenComment.nickname }}</strong>
              <span>&nbsp回复&nbsp</span>
              <strong>{{ childrenComment.pname }}</strong>
              <span>&nbsp说：</span>
            </div>
          </div>

          <div class="comment-body" v-html="childrenComment.content"></div>

          <div class="comment-footer">
            <span class="comment-date">
              {{ dateFunction(childrenComment.create_time) }}
            </span>
            <div class="comment-actions">
              <button
                class="comment-action"
                type="button"
                @click="doLike(childrenComment.id)"
              >
                <img alt="" src="../../assets/comment/dianzan.png" />
                <span>{{ childrenComment.like }}</span>
              </button>
              <button
                class="comment-action"
                type="button"
                @click="
                  reply(
                    childrenComment.nickname,
                    comment.id ? comment.id : 0
                  )
                "
              >
                <img alt="" src="../../assets/comment/huifu.png" />
                <span>回复</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <el-dialog v-model="replyCommentDialogVisible" title="回复" width="700">
    <RichTextEditor
      ref="replyEditorRef"
      class="comment-editor__input"
      :style="{ width: '100%', height: '30vh' }"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="replyCommentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReplyComment"> 回复</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, computed, nextTick, watch } from "vue";
import _axios from "@/api";
import { InterfaceUrl } from "@/api";
import { ElMessage } from "element-plus";
import axios from "axios";
import {
  ChatDotRound,
  Connection,
  EditPen,
  House,
  Link,
  Share,
  Star,
  Tickets,
  User,
} from "@element-plus/icons-vue";
import dateFunction from "@/utils/Date";
import { useStore } from "vuex";
import RichTextEditor from "@/utils/RichTextEditor.vue";
import { useRouter } from "vue-router";
import avatarFallback from "@/assets/avatar.png";

const store = useStore();
const router = useRouter();

const comment = ref();

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

const readingMinutes = computed(() => {
  const text = stripHtml(blog.value.content || "");
  const minutes = Math.round(text.length / 300);
  return Math.max(1, minutes || 1);
});

const contentRef = ref<HTMLElement | null>(null);
const toc = ref<Array<{ id: string; text: string; level: number }>>([]);

const buildToc = () => {
  toc.value = [];
  const container = contentRef.value;
  if (!container) return;

  const headings = Array.from(container.querySelectorAll("h1, h2, h3"));
  headings.forEach((el, index) => {
    const text = (el.textContent || "").trim();
    if (!text) return;
    const level = Number(el.tagName.slice(1)) || 1;
    const id = el.id || `heading-${index + 1}`;
    el.id = id;
    toc.value.push({ id, text, level });
  });
};

watch(
  () => blog.value.content,
  async () => {
    await nextTick();
    buildToc();
  }
);

const commentsRef = ref<HTMLElement | null>(null);
const scrollToComments = () => {
  commentsRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
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

const comments = ref<any[]>([]);

const commentsLength = ref(0);

const getComments = () => {
  _axios.post("/blog/getComments", null, { params: { id: props.id } }).then((res) => {
    comments.value = (res.data?.comments || []).sort((a: any, b: any) => {
      return new Date(b.create_time).getTime() - new Date(a.create_time).getTime();
    });
    commentsLength.value = res.data?.total || 0;
  });
};

onMounted(() => {
  blogLoading.value = true;
  _axios
    .post("/blog/blogPage", null, { params: { id: props.id } })
    .then(async (res) => {
      blog.value = res.data;
      blog.value.create_time = dateFunction(blog.value.create_time);
      await nextTick();
      buildToc();
    })
    .finally(() => {
      blogLoading.value = false;
    });
  getComments();
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

const goLogin = () => {
  router.push("/login");
};

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

const commentEditorRef = ref();
const replyEditorRef = ref();

const submitComment = () => {
  if (!ensureLogin()) return;
  comment.value = store.getters.getRichTextEditor;
  _axios
    .post("/blog/postComment", {
      content: comment.value,
      publisher_id: userInfo.value.id || 0,
      nickname: userInfo.value.nickname,
      bn_id: props.id,
      category: "blog",
    })
    .then((res) => {
      commentEditorRef.value?.clearEditorContent?.();
      getComments();
      ElMessage.success("评论成功");
    });
};

const doLike = (comment_id: number) => {
  _axios
    .post("/blog/like", {
      comment_id: comment_id,
    })
    .then((res) => {
      getComments();
    });
};

const pid = ref();

const pname = ref();

const reply = (a: string, b: number) => {
  replyCommentDialogVisible.value = true;
  pname.value = a;
  pid.value = b;
};

const replyCommentDialogVisible = ref(false);

const replyComment = ref();

const submitReplyComment = () => {
  if (!ensureLogin()) return;
  replyComment.value = store.getters.getRichTextEditor;
  _axios
    .post("/blog/postComment", {
      content: replyComment.value,
      publisher_id: userInfo.value.id,
      nickname: userInfo.value.nickname,
      bn_id: props.id,
      pid: pid.value,
      pname: pname.value,
      category: "blog",
    })
    .then((res) => {
      replyEditorRef.value?.clearEditorContent?.();
      getComments();
      replyCommentDialogVisible.value = false;
      ElMessage.success("回复成功");
    });
};
</script>

<style lang="scss" scoped>
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
  padding: 32px 0 80px;
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
    background: radial-gradient(
        circle at 15% 20%,
        rgba(47, 118, 210, 0.25),
        transparent 45%
      ),
      radial-gradient(
        circle at 85% 10%,
        rgba(243, 193, 75, 0.25),
        transparent 40%
      ),
      radial-gradient(
        circle at 85% 80%,
        rgba(232, 75, 60, 0.18),
        transparent 45%
      );
  }

  &::after {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0)
    );
  }
}

.blog-hero,
.blog-body,
.blog-comments {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.blog-hero {
  animation: fadeUp 0.8s ease both;
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
    background: linear-gradient(
      135deg,
      rgba(47, 118, 210, 0.08),
      rgba(243, 193, 75, 0.05)
    );
    pointer-events: none;
  }
}

.blog-hero__label {
  position: relative;
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent-2);
  font-weight: 600;
}

.blog-title {
  position: relative;
  margin: 10px 0 12px;
  font-size: clamp(2rem, 3vw + 1rem, 3.6rem);
  line-height: 1.1;
}

.blog-meta {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.95rem;
}

.blog-meta__dot {
  color: var(--accent-3);
  font-size: 1.4rem;
  line-height: 0;
}

.blog-cover {
  position: relative;
  margin-top: 22px;
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: 0 12px 40px rgba(18, 38, 63, 0.2);
}

.blog-body {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr minmax(240px, 280px);
  gap: 24px;
  align-items: start;
  animation: fadeUp 0.8s ease 0.12s both;
}

.blog-side {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-self: start;
}

.blog-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-action {
  appearance: none;
  border: 1px solid rgba(47, 118, 210, 0.18);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  color: var(--ink);
  font-family: var(--font-family);
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(18, 38, 63, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 35px rgba(18, 38, 63, 0.18);
    background: var(--paper-strong);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transform: translateY(1px);
  }
}

.side-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  border: 1px solid rgba(47, 118, 210, 0.12);
  padding: 14px 14px 16px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.12);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(47, 118, 210, 0.06),
      rgba(243, 193, 75, 0.04)
    );
    pointer-events: none;
  }
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
  gap: 8px;
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
}

.toc-item--l3 {
  padding-left: 20px;
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
  background: linear-gradient(
    90deg,
    transparent,
    rgba(47, 118, 210, 0.5),
    rgba(243, 193, 75, 0.6),
    transparent
  );
  margin-bottom: 24px;
}

.blog-content {
  position: relative;
  font-size: 1.05rem;
  line-height: 1.9;
  color: #2a303c;
}

.blog-comments {
  margin-top: 32px;
  padding: 28px 32px 36px;
  background: var(--paper);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  animation: fadeUp 0.8s ease 0.22s both;
}

.comment-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 1.35rem;
  }
}

.comment-count {
  color: var(--muted);
  font-size: 0.95rem;
}

.comment-editor {
  position: relative;
  margin-bottom: 18px;
}

.comment-editor__input {
  height: 30vh;
  min-height: 220px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(47, 118, 210, 0.12);
}

.comment-submit {
  width: 80px;
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 999px;
  padding: 6px 14px;
}

.comment-card {
  position: relative;
  background: rgba(248, 251, 255, 0.9);
  border-radius: var(--radius-md);
  border: 1px solid rgba(47, 118, 210, 0.12);
  padding: 18px 20px;
  margin-top: 18px;
  box-shadow: 0 12px 28px rgba(18, 38, 63, 0.08);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 16px;
    bottom: 16px;
    width: 3px;
    border-radius: 999px;
    background: linear-gradient(
      180deg,
      rgba(47, 118, 210, 0.7),
      rgba(243, 193, 75, 0.7)
    );
  }
}

.comment-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-top--compact {
  gap: 10px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink);
}

.avatar {
  width: 45px !important;
  height: 45px;
  border-radius: 50%;
}

.avatar--small {
  width: 38px !important;
  height: 38px;
}

.comment-body {
  margin: 8px 0 0 58px;
  color: #2a303c;
}

.comment-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-left: 58px;
  color: var(--muted);
  font-size: 0.9rem;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.comment-action {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 999px;
  transition: color 0.2s ease, background 0.2s ease;
  font-family: var(--font-family);

  &:hover {
    color: var(--accent);
    background: rgba(47, 118, 210, 0.08);
  }

  img {
    height: 16px;
    width: 16px;
    border-radius: 0;
  }
}

.comment-reply {
  margin-top: 16px;
  margin-left: 52px;
  padding: 14px 16px;
  background: rgba(47, 118, 210, 0.05);
  border-radius: var(--radius-md);
  border: 1px dashed rgba(47, 118, 210, 0.2);
}

.comment-reply .comment-body {
  margin-left: 48px;
}

.comment-reply .comment-footer {
  padding-left: 48px;
}

@media (max-width: 1000px) {
  .blog-hero,
  .blog-body,
  .blog-comments {
    padding: 0 16px;
  }

  .blog-hero__inner {
    padding: 24px;
  }

  .blog-body {
    grid-template-columns: 1fr;
  }

  .blog-side {
    position: static;
  }

  .blog-actions {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .blog-action {
    flex: 1 1 auto;
    justify-content: center;
  }

  .blog-article {
    padding: 24px;
  }

  .blog-comments {
    padding: 24px;
  }

  .comment-body {
    margin-left: 0;
  }

  .comment-footer {
    padding-left: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .comment-reply {
    margin-left: 0;
  }

  .comment-reply .comment-body,
  .comment-reply .comment-footer {
    margin-left: 0;
    padding-left: 0;
  }
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

.blog-content :deep(img) {
  max-width: 100%;
  max-height: 720px;
  border-radius: var(--radius-md);
  display: block;
  margin: 16px auto;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.16);
}

.blog-content :deep(p) {
  margin: 0 0 1.1em;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3) {
  margin: 1.6em 0 0.6em;
  color: var(--ink);
  scroll-margin-top: 90px;
}

.blog-content :deep(blockquote) {
  margin: 1.6em 0;
  padding: 12px 18px;
  border-left: 4px solid var(--accent);
  background: rgba(47, 118, 210, 0.08);
  border-radius: 12px;
}

.comment-body :deep(img) {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  display: block;
  margin: 12px 0;
}
</style>
