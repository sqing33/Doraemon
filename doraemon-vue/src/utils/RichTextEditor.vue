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
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
  onMounted,
  defineExpose,
} from "vue";
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

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("");

const intValueHtml = ref(store.state.richTextEditor);

if (intValueHtml.value) {
  valueHtml.value = intValueHtml.value;
}

// 监听内容 HTML 的变化，更新 store
watch(valueHtml, (newValue) => {
  store.dispatch("setRichTextEditor", newValue);
});

const toolbarConfig = {};

onMounted(() => {
  toolbarConfig.toolbarKeys = [
    "blockquote",
    "header1",
    "header2",
    "header3",
    "|",
    "bold",
    "underline",
    "italic",
    "color",
    "bgColor",
    "clearStyle",
    "|",
    "bulletedList",
    "numberedList",
    "todo",
    "justifyLeft",
    "justifyRight",
    "justifyCenter",
    "|",
    "insertLink",
    {
      //上传图片
      key: "group-image",
      title: "图片",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
      menuKeys: ["insertImage", "uploadImage"],
    },
    // "insertVideo",    //视频
    "codeBlock",
    "|",
    "undo",
    "redo",
    "|",
    // "fullScreen"  //全屏
  ];
});

const editorConfig = {
  MENU_CONF: {},
  placeholder: "请输入内容...",
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

const clearEditorContent = () => {
  console.log("123");
  editorRef.value.clear();
};

defineExpose({
  clearEditorContent,
});
</script>
