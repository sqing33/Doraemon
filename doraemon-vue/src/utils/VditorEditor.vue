<template>
  <div class="vditor-editor" :style="style">
    <div ref="mountEl" class="vditor-editor__mount"></div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    height?: number | string;
    style?: any;
  }>(),
  {
    modelValue: "",
    placeholder: "请输入 Markdown…",
    height: "auto",
    style: undefined,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const mountEl = ref<HTMLElement | null>(null);
const vditor = ref<Vditor | null>(null);
let settingFromOutside = false;

onMounted(() => {
  if (!mountEl.value) return;

  vditor.value = new Vditor(mountEl.value, {
    mode: "ir",
    height: props.height,
    placeholder: props.placeholder,
    value: props.modelValue || "",
    cache: { enable: false },
    toolbarConfig: { pin: true },
    toolbar: [
      "headings",
      "bold",
      "italic",
      "strike",
      "|",
      "quote",
      "list",
      "ordered-list",
      "check",
      "|",
      "link",
      "table",
      "inline-code",
      "code",
      "|",
      "undo",
      "redo",
      "|",
      "fullscreen",
    ],
    input: (value) => {
      if (settingFromOutside) return;
      emit("update:modelValue", value);
    },
  });
});

watch(
  () => props.modelValue,
  (next) => {
    const editor = vditor.value;
    if (!editor) return;
    const current = editor.getValue() || "";
    const desired = next || "";
    if (current === desired) return;

    settingFromOutside = true;
    editor.setValue(desired, true);
    settingFromOutside = false;
  }
);

onBeforeUnmount(() => {
  vditor.value?.destroy();
  vditor.value = null;
});
</script>

<style lang="scss" scoped>
.vditor-editor {
  width: 100%;
}

/* Make Vditor match the blog UI a bit */
.vditor-editor :deep(.vditor) {
  border-radius: 18px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  overflow: hidden;
}

.vditor-editor :deep(.vditor-toolbar) {
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);
}

.vditor-editor :deep(.vditor-ir) {
  background: #fff;
}

.vditor-editor :deep(.vditor-reset) {
  font-family: var(--font-family);
}
</style>

