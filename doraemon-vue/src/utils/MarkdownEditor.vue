<template>
  <div class="md-editor" :style="style">
    <div class="md-editor__toolbar">
      <button
        type="button"
        class="md-editor__tab"
        :class="{ 'md-editor__tab--active': mode === 'split' }"
        @click="mode = 'split'"
      >
        分屏
      </button>
      <button
        type="button"
        class="md-editor__tab"
        :class="{ 'md-editor__tab--active': mode === 'edit' }"
        @click="mode = 'edit'"
      >
        编辑
      </button>
      <button
        type="button"
        class="md-editor__tab"
        :class="{ 'md-editor__tab--active': mode === 'preview' }"
        @click="mode = 'preview'"
      >
        预览
      </button>

      <div class="md-editor__toolbar-right">
        <span class="md-editor__hint">Markdown</span>
      </div>
    </div>

    <div
      class="md-editor__body"
      :class="{
        'md-editor__body--edit': mode === 'edit',
        'md-editor__body--preview': mode === 'preview',
        'md-editor__body--split': mode === 'split',
      }"
    >
      <div class="md-editor__pane md-editor__pane--edit">
        <textarea
          class="md-editor__textarea"
          :placeholder="placeholder"
          :value="modelValue"
          @input="onInput"
        ></textarea>
      </div>

      <div class="md-editor__divider" aria-hidden="true"></div>

      <div class="md-editor__pane md-editor__pane--preview">
        <div class="md-editor__preview md-content" v-html="previewHtml"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    style?: any;
  }>(),
  {
    modelValue: "",
    placeholder: "请输入 Markdown…",
    style: undefined,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const mode = ref<"split" | "edit" | "preview">("split");

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement | null;
  emit("update:modelValue", target?.value ?? "");
};

const previewHtml = computed(() => {
  const raw = props.modelValue || "";
  return marked.parse(raw) as string;
});
</script>

<style lang="scss" scoped>
.md-editor {
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
}

.md-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);
}

.md-editor__tab {
  appearance: none;
  border: 1px solid rgba(47, 118, 210, 0.18);
  background: #ffffff;
  color: #1b2430;
  font-family: var(--font-family);
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;
}

.md-editor__tab:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(18, 38, 63, 0.12);
}

.md-editor__tab--active {
  border-color: rgba(47, 118, 210, 0.35);
  background: rgba(47, 118, 210, 0.14);
  color: #2f76d2;
}

.md-editor__toolbar-right {
  margin-left: auto;
}

.md-editor__hint {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(27, 36, 48, 0.6);
}

.md-editor__body {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  min-height: 300px;
}

.md-editor__body--edit {
  grid-template-columns: 1fr;

  .md-editor__divider,
  .md-editor__pane--preview {
    display: none;
  }
}

.md-editor__body--preview {
  grid-template-columns: 1fr;

  .md-editor__divider,
  .md-editor__pane--edit {
    display: none;
  }
}

.md-editor__divider {
  background: rgba(17, 24, 39, 0.08);
}

.md-editor__pane {
  min-width: 0;
  min-height: 0;
}

.md-editor__textarea {
  width: 100%;
  height: 100%;
  min-height: 300px;
  resize: vertical;
  border: 0;
  outline: none;
  padding: 14px 14px 18px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
  background: #fff;
}

.md-editor__preview {
  height: 100%;
  min-height: 300px;
  overflow: auto;
  padding: 14px 14px 18px;
  background: rgba(249, 250, 251, 0.55);
}

/* Minimal markdown typography */
.md-content :deep(h1),
.md-content :deep(h2),
.md-content :deep(h3) {
  margin: 1.2em 0 0.6em;
  color: #1b2430;
}

.md-content :deep(p) {
  margin: 0 0 1em;
  line-height: 1.85;
  color: #2a303c;
}

.md-content :deep(a) {
  color: #2f76d2;
}

.md-content :deep(pre) {
  background: #0b1020;
  color: #e5e7eb;
  padding: 12px 14px;
  border-radius: 14px;
  overflow: auto;
}

.md-content :deep(code) {
  background: rgba(15, 23, 42, 0.06);
  padding: 0.2em 0.35em;
  border-radius: 8px;
}

.md-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

.md-content :deep(blockquote) {
  margin: 1.2em 0;
  padding: 10px 14px;
  border-left: 4px solid rgba(47, 118, 210, 0.7);
  background: rgba(47, 118, 210, 0.08);
  border-radius: 12px;
}

.md-content :deep(img) {
  max-width: 100%;
  border-radius: 14px;
  display: block;
  margin: 14px auto;
  box-shadow: 0 12px 30px rgba(18, 38, 63, 0.16);
}

@media screen and (max-width: 768px) {
  .md-editor__body {
    grid-template-columns: 1fr;
  }

  .md-editor__divider {
    display: none;
  }
}
</style>

