<template>
  <div
    style="
      width: 80vw;
      min-height: 95%;
      padding: 10px 20px;
      margin: 5px auto;
      background: rgb(255, 255, 255, 0.5);
      border-radius: 20px;
    "
  >
    <h1 style="margin: 10px 0 15px 0; text-align: center">发表帖子</h1>

    <ElementForm v-bind="formConfig" v-model="form">
      <template #footer>
        <div style="display: flex; justify-content: center">
          <el-button size="large" type="primary" @click="onSubmit"
            >发布</el-button
          >
          <router-link to="/blog">
            <el-button size="large" style="margin-left: 5vw" @click="onCancel">
              取消
            </el-button>
          </router-link>
        </div>
      </template>
    </ElementForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { InterfaceUrl } from "@/api";
import { ElMessage } from "element-plus";
import axios from "axios";
import LZString from "lz-string";
import ElementForm from "@/utils/ElementForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();

const router = useRouter();

const categories = ref();

const formItems = reactive([
  {
    label: "标题",
    type: "input",
    placeholder: "请输入标题",
    prop: "title",
    style: ["width: 45vw"],
  },
  {
    label: "类型",
    type: "select",
    placeholder: "请选择类型",
    prop: "category",
    style: ["width: 15vw"],
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
    type: "textarea",
    placeholder: "请输入新闻内容",
    prop: "content",
    style: ["height: 30vh", "width: 90%"],
  },
  {
    label: "封面",
    type: "upload",
    prop: "coverUrl",
    style: [],
    uploadUrl: InterfaceUrl + "/admin/upload",
  },
]);

const labelPosition = () => {
  if (window.innerWidth < 768) {
    return "top";
  }
};

// 表单配置
const formConfig = {
  formItems,
  labelWidth: "75px",
  labelPosition: labelPosition(),
};

const formValues: any = {};
formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const form = reactive(formValues);

const onSubmit = () => {
  form.coverUrl = store.getters.getElementImageUrl;
  form.content = store.getters.getRichTextEditor;
  form.user_id = store.getters.getUserInfo.id;

  console.log(form);

  axios
    .post(InterfaceUrl + "/blog/postBlog", form)
    .then((response) => {
      ElMessage({
        type: "success",
        message: "发布成功!",
      });
      form.value = "";
      store.commit("setElementImageUrl", "");
      store.commit("setRichTextEditor", "");
      router.push("/blog");
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
};

const onCancel = () => {
  form.value = "";
  store.commit("setElementImageUrl", "");
  store.commit("setRichTextEditor", "");
  router.push("/blog");
};
</script>

<style lang="scss" scoped></style>
