<template>
  <slot name="header"></slot>
  <el-form
    :label-width="props.labelWidth"
    :model="modelValue"
    :rules="props.formRules"
    :label-position="props.labelPosition"
  >
    <template v-for="item in props.formItems">
      <el-form-item :label="item.label">
        <!-- 输入框 -->
        <template v-if="item.type === 'input' || item.type === 'password'">
          <el-input
            :show-password="item.type === 'password'"
            :placeholder="item.placeholder"
            v-model="modelValue[item.prop]"
            :prop="item.prop"
            :style="item.style"
          ></el-input>
        </template>

        <!-- 富文本编辑器 -->
        <template v-else-if="item.type === 'textarea'">
          <RichTextEditor :style="item.style" />
        </template>

        <!-- 开关 -->
        <template v-else-if="item.type === 'switch'">
          <el-switch
            class="ml-2"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            v-model="modelValue[item.prop]"
            :prop="item.prop"
            :style="item.style"
            :size="item.size"
          >
          </el-switch>
        </template>

        <!-- 选择按钮 -->
        <template v-else-if="item.type === 'select'">
          <el-select
            :placeholder="item.placeholder"
            v-model="modelValue[item.prop]"
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
            type="date"
            :placeholder="item.placeholder"
            v-model="modelValue[item.prop]"
            :prop="item.prop"
            :style="item.style"
          ></el-date-picker>
        </template>

        <!-- 时间选择 -->
        <template v-else-if="item.type === 'time'">
          <el-time-select
            :placeholder="item.placeholder"
            v-model="modelValue[item.prop]"
            :prop="item.prop"
            :style="item.style"
          ></el-time-select>
        </template>

        <!-- 上传图片 -->
        <template v-else-if="item.type === 'upload'">
          <el-upload
            :action="item.uploadUrl"
            multiple
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            :on-success="uploadSuccess"
            :style="item.style"
          >
            <span>
              <i class="el-icon-plus" style="font-size: 14px"></i>
              添加图片</span
            >
          </el-upload>
          <!-- 大图预览 -->
          <el-image-viewer
            v-if="showImgViewer"
            :on-close="closeImgViewer"
            :url-list="imagePreviewUrls"
            :z-index="3000"
            :initial-index="initialImgPreviewIndex"
          />
        </template>
      </el-form-item>
    </template>
  </el-form>

  <slot name="footer"></slot>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import RichTextEditor from "./RichTextEditor.vue";
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
