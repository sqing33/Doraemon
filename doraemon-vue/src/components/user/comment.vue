<template>
  <div style="width: 50%; margin: 0 auto">
    <ElementForm
      v-bind="formConfig"
      v-model="form"
      @upload-url="handleUploadUrl"
    >
      <template #footer>
        <el-button type="primary" @click="submit">提交</el-button>
      </template>
    </ElementForm>
  </div>
</template>

<script lang="ts" setup>
import ElementForm from "@/utils/ElementForm.vue";
import { reactive } from "vue";
import { InterfaceUrl } from "@/api";

const formConfig = {
  formItems: [
    {
      label: "标题",
      type: "input",
      placeholder: "请输入新闻标题",
      prop: "title",
    },
    {
      label: "内容",
      type: "input",
      placeholder: "请输入新闻内容",
      prop: "content",
    },
    {
      label: "封面",
      type: "upload",
      prop: "coverUrl",
      uploadUrl: InterfaceUrl + "/admin/upload",
    },
    {
      label: "类型",
      type: "select",
      placeholder: "请选择类型",
      prop: "region",
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
    },
  ],
  labelWidth: "75px",
};

const formValues: any = {};
formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const form = reactive(formValues);

const handleUploadUrl = (uploadUrl: string) => {
  form.coverUrl = uploadUrl;
};

const submit = () => {
  console.log(form);
};
</script>
