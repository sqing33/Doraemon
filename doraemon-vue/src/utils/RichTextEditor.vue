<template>
  <div style="border: 1px solid #ccc" :style="style().width">
    <Toolbar
      style="border-bottom: 1px solid #ccc; z-index: 1000 !important"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="overflow-y: hidden; z-index: 999 !important"
      :style="style().height"
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
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  style: Object,
});

let style = () => {
  return {
    width: props.style.width
      ? "width: " + props.style.width + ";"
      : "width:100%;",
    height: props.style.height
      ? "height: " + props.style.height + ";"
      : "height:40vh;",
  };
};

console.log(style().height);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("");

// 监听内容 HTML 的变化，更新 store
watch(valueHtml, (newValue) => {
  store.dispatch("setRichTextEditor", newValue);
});

const toolbarConfig = {};
const editorConfig = {
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
