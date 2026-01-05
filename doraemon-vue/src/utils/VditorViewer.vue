<template>
  <div ref="mountEl" class="vditor-viewer"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const props = defineProps<{
  content: string;
}>();

const emit = defineEmits<{
  (e: "rendered"): void;
}>();

const mountEl = ref<HTMLElement | null>(null);

const renderContent = () => {
  if (!mountEl.value) return;

  Vditor.preview(mountEl.value, props.content || "", {
    mode: "light",
    cdn: "https://unpkg.com/vditor@3.9.9",
    after: () => {
      // 渲染完成后触发事件
      emit("rendered");
    },
  });
};

onMounted(() => {
  renderContent();
});

watch(
  () => props.content,
  () => {
    renderContent();
  }
);
</script>

<style lang="scss" scoped>
.vditor-viewer {
  width: 100%;
}

.vditor-viewer :deep(.vditor-reset) {
  font-family: var(--font-family);
  font-size: inherit;
  line-height: inherit;
}
</style>