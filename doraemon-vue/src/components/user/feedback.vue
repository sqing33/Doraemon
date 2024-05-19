<template>
  <div class="feedback">
    <div
      style="
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 5vw 5vw 5vw;
        background: rgba(192, 192, 192, 0.75);
        border-radius: 20px;
      "
    >
      <h1 style="text-align: center; font-size: 36px">反馈</h1>
      <RichTextEditor ref="richTextEditor" :style="{ width: '60vw' }" />
      <el-button
        @click="submitFeedback"
        style="
          margin-top: 20px;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        "
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import RichTextEditor from "@/utils/RichTextEditor.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { InterfaceUrl } from "@/api";

const router = useRouter();

const store = useStore();

const userInfo = store.getters.getUserInfo;

const feedback = ref();

const richTextEditor = ref();

const submitFeedback = () => {
  feedback.value = store.getters.getRichTextEditor;
  if (feedback.value === "<p><br></p>") {
    ElMessage.error("反馈内容不能为空。");
  } else {
    axios
      .post(InterfaceUrl + "/user/feedback", {
        content: feedback.value,
        user_id: userInfo.id,
      })
      .then((res) => {
        if (res.data.state === 0) {
          richTextEditor.value.clearEditorContent();
          ElMessageBox.alert(
            "感谢您的反馈，我们会尽快处理，给您带来困扰，很抱歉。",
            "确认",
            {
              confirmButtonText: "确定",
              type: "success",
            }
          ).then(() => {
            router.go(-1);
          });
        } else {
          ElMessage.error("请求失败，请联系管理员。");
        }
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
  }
};
</script>

<style lang="scss" scoped>
.feedback {
  width: 70vw;
  height: calc(100vh - 100px);
  margin: 0 auto;
}
</style>
