<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc; z-index: 1000 !important"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 20vh; overflow-y: hidden; z-index: 999 !important"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { InterfaceUrl } from "@/api";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 定义props和emits
const props = defineProps({
  message: String,
});

const emits = defineEmits(["update:message"]);

// 内容 HTML
const valueHtml = ref("");

// 监听props属性的变化，更新内部状态
watch(
  () => props.message,
  (newValue) => {
    valueHtml.value = newValue;
    console.log(valueHtml.value);
  }
);

// 监听内部状态的变化，通过emits向父组件发送数据
watch(valueHtml, (newValue) => {
  emits("update:message", newValue);
});

const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
};

editorConfig.MENU_CONF["uploadImage"] = {
  // 上传图片的配置
  server: InterfaceUrl + "/admin/upload",
  fieldName: "file",
  // 单个文件的最大体积限制，默认为 10M
  maxFileSize: 20 * 1024 * 1024, // 20M
  // 最多可上传几个文件，默认为 5
  maxNumberOfFiles: 5,
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>
