<template>
  <section ref="commentsRef" class="blog-comments">
    <div class="comment-header">
      <h3>评论</h3>
      <div class="comment-count">
        <div v-if="commentsLength === 0">
          （还没有评论，快来发表吧~）
        </div>
        <div v-else>（{{ commentsLength }}）</div>
      </div>
      <el-button plain class="comment-submit" type="primary" @click="submitComment">发布
      </el-button>
    </div>

    <div class="comment-editor">
      <VditorEditor v-model="commentMarkdown" class="comment-editor__input" :height="300" />
    </div>

    <div v-for="comment in comments" :key="comment.id" class="comment-card">
      <div class="comment-top">
        <img alt="" class="avatar" src="../../assets/avatar.png" />
        <div class="comment-author">
          <strong>{{ comment.nickname }}</strong>
          <span>说：</span>
        </div>
      </div>

      <div class="comment-body">
        <VditorViewer :content="comment.content" />
      </div>

      <div class="comment-footer">
        <span class="comment-date">
          {{ dateFunction(comment.create_time) }}
        </span>
        <div class="comment-actions">
          <button class="comment-action" type="button" @click="doLike(comment.id)">
            <img alt="" src="../../assets/comment/dianzan.png" />
            <span>{{ comment.like }}</span>
          </button>
          <button class="comment-action" type="button" @click="
            pid = comment.id;
          pname = comment.nickname;
          replyCommentDialogVisible = true;
          ">
            <img alt="" src="../../assets/comment/huifu.png" />
            <span>回复</span>
          </button>
          <button v-if="comment.children && comment.children.length > 0" class="comment-action" type="button"
            @click="toggleCollapse(comment.id)">
            <img alt="" src="../../assets/comment/huifu.png" />
            <span>{{ collapsedComments[comment.id] ? '展开' : '收起' }}{{ comment.children.length }}条评论</span>
          </button>
        </div>
      </div>

      <div v-if="!collapsedComments[comment.id] && comment.children && comment.children.length > 0"
        class="comment-replies-container">
        <div v-for="(childrenComment, index) in getPaginatedChildren(comment)" :key="childrenComment.id"
          class="comment-reply">
          <div class="comment-top comment-top--compact">
            <img alt="" class="avatar avatar--small" src="../../assets/avatar.png" />
            <div class="comment-author">
              <strong>{{ childrenComment.nickname }}</strong>
              <span>&nbsp回复&nbsp</span>
              <strong>{{ childrenComment.pname }}</strong>
              <span>&nbsp说：</span>
            </div>
            <div class="comment-footer comment-footer--inline">
              <span class="comment-date">
                {{ dateFunction(childrenComment.create_time) }}
              </span>
              <div class="comment-actions">
                <button class="comment-action" type="button" @click="doLike(childrenComment.id)">
                  <img alt="" src="../../assets/comment/dianzan.png" />
                  <span>{{ childrenComment.like }}</span>
                </button>
                <button class="comment-action" type="button" @click="
                  reply(
                    childrenComment.nickname,
                    comment.id ? comment.id : 0
                  )
                  ">
                  <img alt="" src="../../assets/comment/huifu.png" />
                  <span>回复</span>
                </button>
              </div>
            </div>
          </div>

          <div class="comment-body">
            <VditorViewer :content="childrenComment.content" />
          </div>
        </div>

        <div v-if="comment.children && comment.children.length > pageSize" class="comment-pagination">
          <button v-for="page in getTotalPages(comment)" :key="page" class="pagination-btn"
            :class="{ 'pagination-btn--active': currentPage[comment.id] === page }" type="button"
            @click="changePage(comment.id, page)">
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <el-dialog v-model="replyCommentDialogVisible" title="回复" width="700">
      <VditorEditor v-model="replyMarkdown" class="comment-editor__input" :height="300" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="replyCommentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReplyComment">
            回复</el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import _axios from "@/api";
import { ElMessage } from "element-plus";
import VditorEditor from "@/utils/VditorEditor.vue";
import VditorViewer from "@/utils/VditorViewer.vue";
import dateFunction from "@/utils/Date";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const props = defineProps({
  blogId: {
    type: String,
    required: true,
  },
});

const commentsRef = ref<HTMLElement | null>(null);
const comments = ref<any[]>([]);
const commentsLength = ref(0);
const collapsedComments = ref<Record<string, boolean>>({});
const currentPage = ref<Record<string, number>>({});
const pageSize = 5;

const commentMarkdown = ref("");
const replyMarkdown = ref("");
const pid = ref();
const pname = ref();
const replyCommentDialogVisible = ref(false);

const userInfo = computed(() => store.getters.getUserInfo || {});

const ensureLogin = () => {
  const token = localStorage.getItem("token");
  if (!token || !userInfo.value?.id) {
    ElMessage.warning("请先登录");
    router.push("/login");
    return false;
  }
  return true;
};

const toggleCollapse = (commentId: string) => {
  collapsedComments.value[commentId] = !collapsedComments.value[commentId];
  if (collapsedComments.value[commentId]) {
    currentPage.value[commentId] = 1;
  }
};

const changePage = (commentId: string, page: number) => {
  currentPage.value[commentId] = page;
};

const getPaginatedChildren = (comment: any) => {
  const page = currentPage.value[comment.id] || 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return comment.children.slice(start, end);
};

const getTotalPages = (comment: any) => {
  return Math.ceil(comment.children.length / pageSize);
};

const getComments = () => {
  _axios
    .post("/blog/getComments", null, { params: { id: props.blogId } })
    .then((res) => {
      comments.value = (res.data?.comments || []).sort((a: any, b: any) => {
        return (
          new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
        );
      });
      commentsLength.value = res.data?.total || 0;

      collapsedComments.value = {};
      currentPage.value = {};
      comments.value.forEach((comment: any) => {
        if (comment.children && comment.children.length > 0) {
          collapsedComments.value[comment.id] = true;
          currentPage.value[comment.id] = 1;
        }
      });
    });
};

const submitComment = () => {
  if (!ensureLogin()) return;
  _axios
    .post("/blog/postComment", {
      content: commentMarkdown.value,
      publisher_id: userInfo.value.id || 0,
      nickname: userInfo.value.nickname,
      bn_id: props.blogId,
      category: "blog",
    })
    .then((res) => {
      commentMarkdown.value = "";
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

const reply = (a: string, b: number) => {
  replyCommentDialogVisible.value = true;
  pname.value = a;
  pid.value = b;
  replyMarkdown.value = "";
};

const submitReplyComment = () => {
  if (!ensureLogin()) return;
  _axios
    .post("/blog/postComment", {
      content: replyMarkdown.value,
      publisher_id: userInfo.value.id,
      nickname: userInfo.value.nickname,
      bn_id: props.blogId,
      pid: pid.value,
      pname: pname.value,
      category: "blog",
    })
    .then((res) => {
      replyMarkdown.value = "";
      getComments();
      replyCommentDialogVisible.value = false;
      ElMessage.success("回复成功");
    });
};

onMounted(() => {
  getComments();
});

defineExpose({
  getComments,
  scrollToComments: () => {
    commentsRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  },
});
</script>

<style lang="scss" scoped>
.blog-comments {
  margin-top: 32px;
  padding: 20px;
  background: var(--paper);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  animation: fadeUp 0.8s ease 0.22s both;
  width: 100%;
  box-sizing: border-box;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .comment-count {
    color: var(--muted);
    font-size: 0.85rem;
    flex: 1;
  }
}

.comment-editor {
  position: relative;
  margin-bottom: 18px;
  width: 100%;
}

.comment-editor__input {
  min-height: 220px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(47, 118, 210, 0.12);
  width: 100%;
}

.comment-submit {
  width: auto;
  min-width: 80px;
  border-radius: 999px;
  padding: 8px 20px;
  flex-shrink: 0;
}

.comment-card {
  position: relative;
  background: rgba(248, 251, 255, 0.9);
  border-radius: var(--radius-md);
  border: 1px solid rgba(47, 118, 210, 0.12);
  padding: 18px 20px;
  margin-top: 18px;
  box-shadow: 0 12px 28px rgba(18, 38, 63, 0.08);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 16px;
    bottom: 16px;
    width: 3px;
    border-radius: 999px;
    background: linear-gradient(180deg,
        rgba(47, 118, 210, 0.7),
        rgba(243, 193, 75, 0.7));
  }
}

.comment-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-top--compact {
  gap: 10px;
  flex-wrap: wrap;
}

.comment-top--compact .comment-author {
  flex: 1;
  min-width: 0;
}

.comment-footer--inline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  font-size: 0.75rem;
  padding-left: 0;
  margin-top: 0;
}

.comment-footer--inline .comment-date {
  color: var(--muted);
}

.comment-footer--inline .comment-actions {
  gap: 10px;
}

.comment-footer--inline .comment-action {
  font-size: 0.75rem;
  padding: 2px 6px;

  span {
    font-size: 0.75rem;
  }
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink);
  font-size: 0.85rem;

  strong {
    font-size: 0.9rem;
    font-weight: 600;
  }

  span {
    font-size: 0.85rem;
  }
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
  overflow-x: hidden;
  word-wrap: break-word;
  word-break: break-word;
  font-size: 0.85rem;
  line-height: 1.6;

  :deep(.vditor-reset) {
    font-size: 0.85rem;
    line-height: 1.6;
  }

  :deep(p) {
    margin: 8px 0;
    font-size: 0.85rem;
  }

  :deep(h1) {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 12px 0 8px 0;
  }

  :deep(h2) {
    font-size: 1rem;
    font-weight: 600;
    margin: 10px 0 6px 0;
  }

  :deep(h3) {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 8px 0 6px 0;
  }

  :deep(h4) {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 8px 0 6px 0;
  }

  :deep(h5) {
    font-size: 0.85rem;
    font-weight: 600;
    margin: 6px 0 4px 0;
  }

  :deep(h6) {
    font-size: 0.85rem;
    font-weight: 600;
    margin: 6px 0 4px 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 8px 0;
    padding-left: 20px;
    font-size: 0.85rem;
  }

  :deep(li) {
    margin: 4px 0;
    font-size: 0.85rem;
  }

  :deep(code) {
    font-size: 0.8rem;
  }

  :deep(pre) {
    font-size: 0.8rem;
  }

  :deep(blockquote) {
    font-size: 0.85rem;
  }
}

.comment-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 0.8rem;

  &:hover {
    color: var(--accent);
    background: rgba(47, 118, 210, 0.08);
  }

  img {
    height: 16px;
    width: 16px;
    border-radius: 0;
  }

  span {
    font-size: 0.8rem;
  }
}

.comment-reply {
  margin-top: 16px;
  margin-left: 52px;
  padding: 14px 16px;
  background: rgba(47, 118, 210, 0.05);
  border-radius: var(--radius-md);
  border: 1px dashed rgba(47, 118, 210, 0.2);
  width: calc(100% - 52px);
  box-sizing: border-box;
  overflow: hidden;
  max-height: 1000px;
  opacity: 1;
  transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease, padding 0.3s ease;
}

.comment-reply--hidden {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding: 0 16px;
  overflow: hidden;
}

.comment-collapse-toggle {
  margin-top: 12px;
  margin-left: 52px;
  text-align: left;
}

.comment-collapse-toggle--inline {
  margin-top: 12px;
  margin-left: 0;
  text-align: right;
}

.collapse-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  font-family: var(--font-family);

  &:hover {
    background: rgba(47, 118, 210, 0.08);
  }
}

.comment-pagination {
  margin-top: 16px;
  margin-left: 52px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination-btn {
  appearance: none;
  border: 1px solid rgba(47, 118, 210, 0.3);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-family: var(--font-family);

  &:hover {
    background: rgba(47, 118, 210, 0.1);
    border-color: var(--accent);
  }

  &--active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);

    &:hover {
      background: var(--accent);
      opacity: 0.9;
    }
  }
}

.comment-author {
  font-size: 0.8rem;

  strong {
    font-size: 0.85rem;
  }

  span {
    font-size: 0.8rem;
  }
}

.comment-reply .comment-body {
  margin-left: 48px;
  font-size: 0.8rem;

  :deep(.vditor-reset) {
    font-size: 0.8rem;
  }

  :deep(p) {
    font-size: 0.8rem;
  }

  :deep(h1) {
    font-size: 1rem;
    font-weight: 600;
    margin: 10px 0 6px 0;
  }

  :deep(h2) {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 8px 0 6px 0;
  }

  :deep(h3) {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 8px 0 6px 0;
  }

  :deep(h4) {
    font-size: 0.85rem;
    font-weight: 600;
    margin: 6px 0 4px 0;
  }

  :deep(h5) {
    font-size: 0.8rem;
    font-weight: 600;
    margin: 6px 0 4px 0;
  }

  :deep(h6) {
    font-size: 0.8rem;
    font-weight: 600;
    margin: 6px 0 4px 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 6px 0;
    padding-left: 18px;
    font-size: 0.8rem;
  }

  :deep(li) {
    margin: 3px 0;
    font-size: 0.8rem;
  }

  :deep(code) {
    font-size: 0.75rem;
  }

  :deep(pre) {
    font-size: 0.75rem;
  }

  :deep(blockquote) {
    font-size: 0.8rem;
  }
}

@media (max-width: 1000px) {
  .blog-comments {
    padding: 24px;
  }

  .comment-header {
    h3 {
      font-size: 1rem;
    }

    .comment-count {
      font-size: 0.8rem;
    }
  }

  .comment-body {
    margin-left: 0;
    font-size: 0.8rem;

    :deep(.vditor-reset) {
      font-size: 0.8rem;
    }

    :deep(p) {
      font-size: 0.8rem;
    }

    :deep(h1) {
      font-size: 1rem;
      margin: 10px 0 6px 0;
    }

    :deep(h2) {
      font-size: 0.95rem;
      margin: 8px 0 6px 0;
    }

    :deep(h3) {
      font-size: 0.9rem;
      margin: 8px 0 6px 0;
    }

    :deep(h4) {
      font-size: 0.85rem;
      margin: 6px 0 4px 0;
    }

    :deep(h5) {
      font-size: 0.8rem;
      margin: 6px 0 4px 0;
    }

    :deep(h6) {
      font-size: 0.8rem;
      margin: 6px 0 4px 0;
    }

    :deep(ul),
    :deep(ol) {
      font-size: 0.8rem;
    }

    :deep(li) {
      font-size: 0.8rem;
    }

    :deep(code) {
      font-size: 0.75rem;
    }

    :deep(pre) {
      font-size: 0.75rem;
    }

    :deep(blockquote) {
      font-size: 0.8rem;
    }
  }

  .comment-footer {
    padding-left: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.8rem;
  }

  .comment-reply {
    margin-left: 0;

    .comment-top--compact {
      flex-direction: column;
      align-items: flex-start;
    }

    .comment-top--compact .comment-author {
      flex: none;
      min-width: auto;
    }

    .comment-footer--inline {
      margin-left: 0;
      margin-top: 8px;
      width: 100%;
    }

    .comment-author {
      font-size: 0.75rem;

      strong {
        font-size: 0.8rem;
      }
    }

    .comment-body {
      font-size: 0.75rem;

      :deep(.vditor-reset) {
        font-size: 0.75rem;
      }

      :deep(p) {
        font-size: 0.75rem;
      }

      :deep(h1) {
        font-size: 0.95rem;
        margin: 8px 0 6px 0;
      }

      :deep(h2) {
        font-size: 0.9rem;
        margin: 8px 0 6px 0;
      }

      :deep(h3) {
        font-size: 0.85rem;
        margin: 6px 0 4px 0;
      }

      :deep(h4) {
        font-size: 0.8rem;
        margin: 6px 0 4px 0;
      }

      :deep(h5) {
        font-size: 0.75rem;
        margin: 6px 0 4px 0;
      }

      :deep(h6) {
        font-size: 0.75rem;
        margin: 6px 0 4px 0;
      }

      :deep(ul),
      :deep(ol) {
        font-size: 0.75rem;
      }

      :deep(li) {
        font-size: 0.75rem;
      }

      :deep(code) {
        font-size: 0.7rem;
      }

      :deep(pre) {
        font-size: 0.7rem;
      }

      :deep(blockquote) {
        font-size: 0.75rem;
      }
    }
  }

  .comment-collapse-toggle {
    margin-left: 0;
  }

  .collapse-btn {
    font-size: 0.75rem;
  }

  .collapse-count {
    font-size: 0.7rem;
  }

  .comment-body {
    font-size: 0.75rem;

    :deep(.vditor-reset) {
      font-size: 0.75rem;
    }
  }
}
</style>
