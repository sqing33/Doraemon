<template>
  <div :style="props.labelStyle">
    <slot name="header"></slot>
    <el-form
      :label-position="props.labelPosition"
      :label-width="props.labelWidth"
      :model="modelValue"
      :rules="props.formRules"
      :style="props.labelStyle"
    >
      <template v-for="item in props.formItems">
        <el-form-item :label="item.label">
          <!-- 输入框 -->
          <template v-if="item.type === 'input' || item.type === 'password'">
            <el-input
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              :prop="item.prop"
              :show-password="item.type === 'password'"
              :style="item.style"
              clearable
            ></el-input>
          </template>

          <!-- 富文本编辑器 -->
          <template v-else-if="item.type === 'textarea'">
            <RichTextEditor :style="item.style" />
          </template>

          <!-- Markdown 编辑器 -->
          <template v-else-if="item.type === 'markdown'">
            <VditorEditor
              v-model="modelValue[item.prop]"
              :style="item.style"
              :height="getEditorHeight(item.style)"
              :placeholder="item.placeholder || '请输入 Markdown...'"
            />
          </template>

          <!-- 开关 -->
          <template v-else-if="item.type === 'switch'">
            <el-switch
              v-model="modelValue[item.prop]"
              :prop="item.prop"
              :size="item.size"
              :style="item.style"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            >
            </el-switch>
          </template>

          <!-- 选择按钮 -->
          <template v-else-if="item.type === 'select'">
            <el-select
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              :prop="item.prop"
              :style="item.style"
            >
              <el-option
                v-for="(option, index) in item.options"
                :key="index"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </template>

          <!-- 日期选择 -->
          <template v-else-if="item.type === 'date'">
            <el-date-picker
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              :prop="item.prop"
              :style="item.style"
              type="date"
            ></el-date-picker>
          </template>

          <!-- 时间选择 -->
          <template v-else-if="item.type === 'time'">
            <el-time-select
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              :prop="item.prop"
              :style="item.style"
            ></el-time-select>
          </template>

          <!-- 图片 -->
          <template v-else-if="item.type === 'image'">
            <img
              :src="modelValue[item.prop]"
              :style="item.style"
              alt=""
              style="border: 1px solid #ccc; padding: 10px; border-radius: 5px"
            />
          </template>

          <!-- 上传图片 -->
          <template v-else-if="item.type === 'upload'">
            <el-upload
              :action="item.uploadUrl"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :style="item.style"
              list-type="picture-card"
              multiple
            >
              <span>
                <i class="el-icon-plus" style="font-size: 14px"></i>
                添加图片</span
              >
            </el-upload>
            <!-- 大图预览 -->
            <el-image-viewer
              v-if="showImgViewer"
              :initial-index="initialImgPreviewIndex"
              :on-close="closeImgViewer"
              :url-list="imagePreviewUrls"
              :z-index="3000"
            />
          </template>
        </el-form-item>
      </template>
    </el-form>

    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";
import RichTextEditor from "./RichTextEditor.vue";
import VditorEditor from "./VditorEditor.vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  formRules: {
    type: Object,
    default: () => ({}),
  },
  formItems: {
    type: Array as () => any[],
    default: () => [],
  },
  labelWidth: {
    type: String,
    default: "100px",
  },
  labelStyle: {
    type: Object,
    default: () => ({}),
  },
  labelPosition: {
    type: String,
    default: "right",
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

// 数据
const imagePreviewUrls = ref<string[]>([]); // 预览图片的数组
const initialImgPreviewIndex = ref<number | null>(null);
const showImgViewer = ref<boolean>(false);

// 方法
const handlePictureCardPreview = (file: any) => {
  const index = imagePreviewUrls.value.indexOf(file.url);
  if (index >= 0) {
    initialImgPreviewIndex.value = index;
  }
  showImgViewer.value = true;
};

const closeImgViewer = () => {
  showImgViewer.value = false;
};

const getEditorHeight = (style: any): string | number => {
  if (!style) return "auto";

  if (typeof style === "string") {
    const match = style.match(/height\s*:\s*([^;]+)/i);
    return match?.[1]?.trim() || "auto";
  }

  if (Array.isArray(style)) {
    const joined = style.join(";");
    const match = joined.match(/height\s*:\s*([^;]+)/i);
    return match?.[1]?.trim() || "auto";
  }

  if (typeof style === "object") {
    const height = (style as any).height;
    return height ?? "auto";
  }

  return "auto";
};

// 上传成功回调
const uploadSuccess = (file: any) => {
  imagePreviewUrls.value.push(file.data.url);
  // 将图片地址存入vuex
  store.dispatch("setElementImageUrl", file.data.url);
};

// 删除选中的文件
const handleRemove = (file: any) => {
  // 删除预览数组对应的图片
  const index = imagePreviewUrls.value.indexOf(file.url);
  if (index > -1) {
    imagePreviewUrls.value.splice(index, 1);
  }
  // 执行删除
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  width: auto !important;
}
</style>
