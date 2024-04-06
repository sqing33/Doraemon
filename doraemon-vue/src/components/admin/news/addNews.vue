<template>
  <h1
    style="
      margin-top: 2vh;
      margin-bottom: 4vh;
      text-align: center;
      font: 5vh sans-serif;
    "
  >
    发布新闻
  </h1>
  <div style="width: 75%; margin: 20px auto">
    <ElementForm
      v-bind="formConfig"
      v-model="form"
      @upload-url="handleUploadUrl"
      @richTextEditor="handleRichTextEditor"
    >
      <template #footer>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" @click="onSubmit">发布</el-button>
          <el-button style="margin-left: 5vw">取消</el-button>
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
import ElementForm from "@/utils/ElementForm.vue";

// 表单内容配置
const formItems = reactive([
  {
    label: "标题",
    type: "input",
    placeholder: "请输入新闻标题",
    prop: "title",
    style: ["width: 45vw", "margin-left: 2vh"],
  },
  {
    label: "内容",
    type: "textarea",
    placeholder: "请输入新闻内容",
    prop: "content",
    style: ["height: 40vh", "margin-left: 2vh"],
  },
  {
    label: "封面",
    type: "upload",
    prop: "coverUrl",
    style: ["margin-left: 2vh"],
    uploadUrl: InterfaceUrl + "/admin/upload",
  },
  {
    label: "类型",
    type: "select",
    placeholder: "请选择类型",
    prop: "region",
    style: ["width: 15vw", "margin-left: 2vh"],
    options: [
      { label: "新闻", value: "1" },
      { label: "活动", value: "2" },
      { label: "公告", value: "3" },
    ],
  },
  {
    label: "发布者",
    type: "select",
    placeholder: "请选择发布者",
    prop: "publisher",
    style: ["width: 15vw", "margin-left: 2vh"],
    options: [
      { label: "松允", value: "1" },
      { label: "雨迎", value: "2" },
      { label: "暄妍", value: "3" },
    ],
  },
  {
    label: "发布状态",
    type: "switch",
    prop: "status",
    style: ["margin-left: 2vh"],
  },
]);

// 表单校验规则
const formRules = reactive({
  title: [{ required: true, message: "请输入新闻标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入新闻内容", trigger: "blur" }],
  region: [{ required: true, message: "请选择新闻类别", trigger: "change" }],
  publisher: [{ required: true, message: "请选择发布者", trigger: "change" }],
  radio: [{ required: true, message: "请选择发布时间", trigger: "change" }],
  status: [{ required: true, message: "请选择是否发布", trigger: "change" }],
});

// 表单配置
const formConfig = {
  formItems,
  formRules,
  labelWidth: "75px",
};

// 获取上传图片url
const handleUploadUrl = (uploadUrl: string) => {
  form.coverUrl = uploadUrl;
};

// 获取富文本编辑器内容
const handleRichTextEditor = (content: string) => {
  form.content = content;
};

const formValues: any = {};
formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const form = reactive(formValues);

const resetForm = () => {
  form.title = "";
  form.content = "";
  form.coverUrl = "";
  form.region = "1";
  form.publisher = "";
  form.status = true;
};

const onSubmit = () => {
  if (form.status === "") {
    form.status = true;
  }

  axios
    .post(InterfaceUrl + "/admin/newsInsert", form)
    .then((response) => {
      ElMessage({
        type: "success",
        message: "发布成功!",
      });
      resetForm(); // 发布成功后重置表单
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
};
</script>
