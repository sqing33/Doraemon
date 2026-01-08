<template>
  <div class="blog post-blog" style="--progress: 0; --header-progress: 1; --header-offset: 140px">
    <BlogHeaderNav eyebrow="Doraemon Blog" title="发表帖子" subtitle="把灵感放进时光胶囊，分享给更多人。" :showCarousel="false"
      :collapsed="true" :syncLayoutProgress="false" />

    <div class="blog-shell">
      <el-row :gutter="18" class="blog-layout">
        <el-col :lg="16" :md="16" :sm="24" :xs="24" class="main-col">
          <section class="post-blog__panel">
            <ElementForm v-bind="formConfig" v-model="form">
              <template #footer>
                <div class="post-blog__footer">
                  <div class="post-blog__actions">
                    <el-button size="large" type="primary" class="post-blog__btn post-blog__btn--primary"
                      @click="onSubmit">
                      发布
                    </el-button>
                    <router-link to="/blog" class="post-blog__link">
                      <el-button size="large" class="post-blog__btn post-blog__btn--ghost" @click="onCancel">
                        取消
                      </el-button>
                    </router-link>
                  </div>
                </div>
              </template>
            </ElementForm>
          </section>
        </el-col>

        <el-col :lg="8" :md="8" :sm="24" :xs="24" class="aside-col">
          <BlogSidebar :showFilter="false">
            <section class="side-card">
              <h4 class="side-card__title">发帖小贴士</h4>
              <ul class="tips">
                <li>标题尽量简短明确（建议 10-30 字）</li>
                <li>内容可插入图片/代码块，排版更清晰</li>
                <li>上传封面会让列表卡片更好看</li>
              </ul>
            </section>
          </BlogSidebar>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import _axios from "@/api";
import { InterfaceUrl } from "@/api";
import ElementForm from "@/utils/ElementForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BlogHeaderNav from "./BlogHeaderNav.vue";
import BlogSidebar from "./BlogSidebar.vue";

const store = useStore();

const router = useRouter();

const formItems = reactive([
  {
    label: "标题",
    type: "input",
    placeholder: "请输入标题",
    prop: "title",
    style: ["width: 100%"],
  },
  {
    label: "类型",
    type: "select",
    placeholder: "请选择类型",
    prop: "category",
    style: ["width: 100%"],
    options: [
      {
        label: "分享",
        value: "分享",
      },
      {
        label: "娱乐",
        value: "娱乐",
      },
      {
        label: "杂谈",
        value: "杂谈",
      },
    ],
  },
  {
    label: "内容",
    type: "markdown",
    placeholder: "请输入内容",
    prop: "content",
    style: ["height: 34vh", "width: 100%"],
  },
  {
    label: "封面",
    type: "upload",
    prop: "coverUrl",
    style: [],
    uploadUrl: InterfaceUrl + "/admin/upload",
  },
]);

// 表单配置
const formConfig = {
  formItems,
  labelWidth: "80px",
  labelPosition: "top",
};

const formValues: any = {};
formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const form = reactive(formValues);

const userInfo = reactive(store.getters.getUserInfo);

const onSubmit = () => {
  form.coverUrl = store.getters.getElementImageUrl;
  form.user_id = userInfo ? userInfo.id : 0;

  _axios.post("/blog/postBlog", form).then((response) => {
    ElMessage({
      type: "success",
      message: "发布成功!",
    });
    form.value = "";
    store.commit("setElementImageUrl", "");
    router.push("/blog");
  });
};

const onCancel = () => {
  form.value = "";
  store.commit("setElementImageUrl", "");
  router.push("/blog");
};
</script>

<style lang="scss" scoped>
.post-blog {
  width: 100%;
  padding: 0;
  position: relative;
  color: #1b2430;
  font-family: var(--font-family);

  --panel: rgba(255, 255, 255, 0.92);
  --ink: #1b2430;
  --muted: #5e6b7a;
  --accent: #2f76d2;
  --shadow: 0 14px 36px rgba(17, 24, 39, 0.12);
  --radius-lg: 26px;
  --radius-md: 18px;
  --radius-sm: 12px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(1000px 520px at 20% 0%,
        rgba(47, 118, 210, 0.14),
        rgba(47, 118, 210, 0)),
      radial-gradient(820px 460px at 95% 20%,
        rgba(245, 185, 66, 0.14),
        rgba(245, 185, 66, 0));
    pointer-events: none;
  }
}

.blog-shell {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: var(--header-offset, 450px);
  position: relative;
  z-index: 1;
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

.post-blog__panel {
  background: var(--panel);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  border: 1px solid rgba(17, 24, 39, 0.06);
  overflow: visible;
  padding: 18px 18px 10px;
  backdrop-filter: blur(10px);
}

.side-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  border: 1px solid rgba(47, 118, 210, 0.12);
  padding: 14px 14px 16px;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.12);
  position: relative;
  overflow: hidden;
}

.side-card__title {
  margin: 0 0 10px;
  font-size: 1rem;
  color: var(--ink);
}

.tips {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.7;
}

.post-blog__footer {
  position: sticky;
  bottom: 10px;
  padding: 16px 6px 12px;
  margin-top: 12px;
  border-top: 1px solid rgba(17, 24, 39, 0.06);
  background: linear-gradient(180deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.96));
  backdrop-filter: blur(10px);
}

.post-blog__actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.post-blog__link {
  text-decoration: none;
}

.post-blog__btn {
  min-width: 160px;
  font-weight: 800;
  border-radius: 999px;
  box-shadow: 0 12px 26px rgba(18, 38, 63, 0.12);
}

.post-blog__btn--primary {
  border: none;
  background: linear-gradient(135deg, #2f76d2 0%, #f5b942 100%);
}

.post-blog__btn--primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #f0b12d 100%);
}

.post-blog__btn--ghost {
  border: 1px solid rgba(47, 118, 210, 0.18);
}

.post-blog :deep(.el-form) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 14px 16px;
  align-items: start;
}

.post-blog :deep(.el-form-item) {
  margin: 0;
}

.post-blog :deep(.el-form-item:nth-child(3)),
.post-blog :deep(.el-form-item:nth-child(4)) {
  grid-column: 1 / -1;
}

.post-blog :deep(.el-form-item__label) {
  padding: 0 0 8px;
  font-weight: 800;
  color: var(--ink);
}

.post-blog :deep(.el-input__wrapper),
.post-blog :deep(.el-select__wrapper) {
  border-radius: var(--radius-sm);
  box-shadow: none;
  border: 1px solid rgba(17, 24, 39, 0.12);
  background: rgba(255, 255, 255, 0.96);
}

.post-blog :deep(.el-input__wrapper:hover),
.post-blog :deep(.el-select__wrapper:hover) {
  border-color: rgba(47, 118, 210, 0.35);
}

.post-blog :deep(.el-input__wrapper.is-focus),
.post-blog :deep(.el-select__wrapper.is-focused) {
  border-color: rgba(47, 118, 210, 0.6);
  box-shadow: 0 0 0 4px rgba(47, 118, 210, 0.14);
}

.post-blog :deep(.el-input__inner) {
  font-weight: 600;
}

/* MarkdownEditor root wrapper (the third form item) */
/* Let the editor component style itself (Vditor) */

/* Upload item (fourth) */
.post-blog :deep(.el-form-item:nth-child(4) .el-form-item__content) {
  display: flex;
  align-items: flex-start;
}

.post-blog :deep(.el-upload--picture-card) {
  border-radius: var(--radius-md);
  border: 1px dashed rgba(47, 118, 210, 0.28);
  background: rgba(47, 118, 210, 0.04);
}

.post-blog :deep(.el-upload-list--picture-card .el-upload-list__item) {
  border-radius: var(--radius-md);
}

@media screen and (max-width: 768px) {
  .post-blog {
    padding: 0;
  }

  .post-blog__panel {
    padding: 16px 14px 8px;
    border-radius: 18px;
  }

  .post-blog :deep(.el-form) {
    grid-template-columns: 1fr;
  }

  .post-blog__btn {
    width: 100%;
    min-width: 0;
  }
}
</style>
