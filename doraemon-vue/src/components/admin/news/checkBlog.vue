<template>
  <ElementForm v-bind="formConfig" v-model="form">
    <template #footer>
      <div style="display: flex; justify-content: center">
        <el-button type="primary" @click="doUpdete">编辑</el-button>
        <el-button type="danger" @click="doDelete">删除</el-button>
      </div>
    </template>
  </ElementForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { InterfaceUrl } from "@/api";
import ElementForm from "@/utils/ElementForm.vue";
import { useStore } from "vuex";
import LZString from "lz-string";

const store = useStore();

const categories = ref(store.getters.getCheck.categories);

const getForm = store.getters.getCheck.form;

const form = reactive(getForm);

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
    style: ["height: 500px"],
  },
  {
    label: "现有封面",
    type: "image",
    prop: "coverUrl",
    style: ["width: 150px"],
  },
  {
    label: "更换封面",
    type: "upload",
    prop: form.coverUrl,
    style: [],
    uploadUrl: InterfaceUrl + "/admin/upload",
  },
  {
    label: "类型",
    type: "select",
    placeholder: "请选择类型",
    prop: "category_id",
    style: ["width: 15vw"],
    options: categories,
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

const doUpdete = () => {
  axios
    .post(InterfaceUrl + "/admin/news/update", form)
    .then((res) => {
      ElMessage({
        type: "success",
        message: "编辑成功!",
      });
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
};

const doDelete = () => {};
</script>

<style lang="scss" scoped></style>
