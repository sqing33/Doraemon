<template>
  <el-table
    :data="blog"
    border
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    style="width: 100%"
  >
    <el-table-column type="index" label="序号" width="75" />
    <el-table-column prop="id" label="ID" width="200" />
    <el-table-column prop="title" label="标题" width="300" />
    <el-table-column prop="content" label="内容" />
    <el-table-column prop="category_id" label="分类" width="200" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { InterfaceUrl } from "@/api";

const blog = ref();

onMounted(() => {
  axios
    .post(InterfaceUrl + "/blogs", null, {
      params: {
        page: 1,
        pageSize: null,
      },
    })
    .then((res) => {
      console.log(res.data);
      blog.value = res.data.data;
      console.log(blog.value);
    });
});
</script>
