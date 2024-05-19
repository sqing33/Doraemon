<template>
  <h1
    style="
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: center;
      font: 5vh sans-serif;
    "
  >
    发布新闻
  </h1>
  <div style="width: 75%; margin: 20px auto">
    <ElementForm v-model="form" v-bind="formConfig">
      <template #footer>
        <div style="display: flex; justify-content: center">
          <el-button size="large" type="primary" @click="onSubmit"
            >发布
          </el-button>
          <el-button size="large" style="margin-left: 5vw">取消</el-button>
        </div>
      </template>
    </ElementForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { InterfaceUrl } from "@/api";
import { ElMessage } from "element-plus";
import axios from "axios";
import LZString from "lz-string";
import ElementForm from "@/utils/ElementForm.vue";
import { useStore } from "vuex";

const store = useStore();

// 表单内容配置
const formItems = reactive([
  {
    label: "标题",
    type: "input",
    placeholder: "请输入新闻标题",
    prop: "title",
    style: ["width: 45vw"],
  },
  {
    label: "内容",
    type: "textarea",
    placeholder: "请输入新闻内容",
    prop: "content",
    style: ["height: 25vh"],
  },
  {
    label: "封面",
    type: "upload",
    prop: "coverUrl",
    style: [],
    uploadUrl: InterfaceUrl + "/admin/upload",
  },
  {
    label: "类型",
    type: "select",
    placeholder: "请选择类型",
    prop: "category",
    style: ["width: 15vw"],
    options: [
      { label: "新闻", value: "新闻" },
      { label: "活动", value: "活动" },
      { label: "公告", value: "公告" },
    ],
  },
  {
    label: "发布状态",
    type: "switch",
    prop: "state",
    style: [],
  },
]);

// 表单配置
const formConfig = {
  formItems,
  labelWidth: "75px",
};

const formValues: any = {};
formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const form = reactive(formValues);

const onSubmit = () => {
  form.coverUrl = store.getters.getElementImageUrl;
  form.content = store.getters.getRichTextEditor;

  if (form.state === "") {
    form.state = true;
  }

  axios
    .post(InterfaceUrl + "/admin/news/insert", form)
    .then((res) => {
      if (res.data.state === 0) {
        ElMessage({
          type: "success",
          message: "发布成功!",
        });
      } else {
        ElMessage.error("请求失败，请联系管理员。");
      }
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
};
</script>
