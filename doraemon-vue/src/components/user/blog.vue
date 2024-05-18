<template>
  <div>
    <h1>Blog</h1>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";
import { InterfaceUrl } from "@/api";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const store = useStore();

const userInfo = store.getters.getUserInfo;

onMounted(() => {
  axios
    .post(InterfaceUrl + "/user/getUserBlogList", {
      id: userInfo.id,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
});
</script>

<style lang="scss" scoped></style>
