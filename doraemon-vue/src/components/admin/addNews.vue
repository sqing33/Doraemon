<template>
  <h1 style="margin-top: 1.5vh; text-align: center; font: 5vh sans-serif">
    发布新闻
  </h1>
  <el-form
    :model="form"
    :rules="formrules"
    label-width="auto"
    style="
      width: 65vw;
      position: absolute;
      top: 10vh;
      left: 55%;
      transform: translate(-50%, 0%);
    "
  >
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="输入新闻标题" />
    </el-form-item>

    <el-form-item label="内容" prop="content">
      <editor :message="form.content" @update:message="updateContent" />
    </el-form-item>

    <el-form-item label="封面" prop="cover">
      <el-upload
        :action="uploadUrl"
        multiple
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-preview="handlePictureCardPreview"
        :on-success="uploadSuccess"
      >
        <span>
          <i class="el-icon-plus" style="font-size: 14px"></i> 添加图片</span
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
    </el-form-item>

    <el-form-item label="类型" prop="region" style="width: 30%">
      <el-select v-model="form.region" placeholder="请选择类型">
        <el-option label="新闻" :value="1" />
        <el-option label="活动" :value="2" />
        <el-option label="公告" :value="3" />
      </el-select>
    </el-form-item>

    <el-form-item label="发布者" prop="publisher" style="width: 30%">
      <el-select v-model="form.publisher" placeholder="请选择发布者"
        ><!-- @change="$forceUpdate()"-->
        <el-option label="张三" :value="1" />
        <el-option label="李四" :value="2" />
        <el-option label="王五" :value="3" />
      </el-select>
    </el-form-item>

    <el-form-item label="发布时间" prop="radio">
      <el-radio-group v-model="form.radio">
        <el-radio :value="1" size="large">立即发布</el-radio>
        <el-radio :value="2" size="large">指定时间</el-radio>
      </el-radio-group>
      <el-col :span="10" style="margin-left: 10px" v-if="form.radio === 2">
        <el-date-picker
          v-model="specifyTheTime"
          type="datetime"
          placeholder="请选择发布时间"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 15vw"
        />
      </el-col>
    </el-form-item>

    <el-form-item label="发布状态" prop="status">
      <el-switch v-model="form.status" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">发布</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import editor from "@/components/editor.vue";
import { InterfaceUrl } from "@/api";
import { ElMessage } from "element-plus";
import axios from "axios";
import LZString from "lz-string";

interface Form {
  title: string;
  content: string;
  coverUrl: string;
  region: number;
  date: string;
  publisher: number;
  radio: number;
  status: boolean;
}

const form: Form = reactive({
  title: "",
  content: "",
  coverUrl: "",
  region: 1,
  date: "",
  publisher: 1,
  radio: 1,
  status: true,
});

const specifyTheTime = ref<string | null>(null);

const updateContent = (newContent: string) => {
  form.content = newContent;
};

const handleRadioChange = () => {
  if (form.radio === 1) {
    const date = new Date();
    // 将Date对象转换为MySQL的DATETIME格式
    form.date = date.toISOString().slice(0, 19).replace("T", " ");
  } else {
    if (specifyTheTime.value) {
      form.date = specifyTheTime.value;
    }
  }
};

const formrules = {
  title: [{ required: true, message: "请输入新闻标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入新闻内容", trigger: "blur" }],
  region: [{ required: true, message: "请选择新闻类别", trigger: "change" }],
  publisher: [{ required: true, message: "请选择发布者", trigger: "change" }],
  radio: [{ required: true, message: "请选择发布时间", trigger: "change" }],
  date: [{ required: true, message: "请选择发布时间", trigger: "change" }],
  status: [{ required: true, message: "请选择是否发布", trigger: "change" }],
};

const resetForm = () => {
  form.title = "";
  form.content = "";
  form.coverUrl = "";
  form.region = 1;
  form.date = "";
  form.publisher = 1;
  form.radio = 1;
  form.status = true;
};

const onSubmit = () => {
  handleRadioChange();

  form.content = LZString.compressToBase64(form.content);

  axios
    .post(InterfaceUrl + "/admin/newsInsert", null, {
      params: form,
    })
    .then((response) => {
      ElMessage({
        type: "success",
        message: "发布成功!",
      });
      resetForm(); // 发布成功后重置表单
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
};

const uploadUrl = InterfaceUrl + "/admin/upload"; // 设置上传地址

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
  imagePreviewUrls.value.push(file.url);
  form.coverUrl = file.url;
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
