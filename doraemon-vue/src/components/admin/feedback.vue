<template>
  <div
    style="height: 50px; align-items: center; justify-content: space-between"
  >
    <h3 style="margin-left: 20px; margin-top: 8px">用户反馈</h3>

    <el-table
      :cell-style="{ textAlign: 'center' }"
      :data="feedback"
      :header-cell-style="{ textAlign: 'center' }"
      :row-style="{ height: '51.2px' }"
      border
      style="
        margin: 0 auto;
        font: 0.85em sans-serif;
        height: calc(100vh - 200px);
        max-height: 615px;
      "
    >
      <el-table-column label="序号" width="75">
        <template #default="{ $index }">
          {{ (pagination.page - 1) * pagination.size + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="反馈人ID" prop="id" width="150" />
      <el-table-column label="用户名" prop="username" width="150" />
      <el-table-column label="用户昵称" prop="nickname" width="150" />
      <el-table-column label="反馈内容" prop="content" width="auto">
        <template #default="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" prop="create_time" width="230">
        <template #default="scope">
          <span>{{ dateFunction(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="pagination.size"
      :pager-count="11"
      :total="total"
      background
      layout="prev, pager, next, jumper,"
      style="margin: auto; width: 80vw; height: 8vh"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script lang="ts" setup>
import _axios from "@/api";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import dateFunction from "@/utils/Date";

const feedback = ref();

const pagination = ref({
  page: 1,
  size: 10,
});

onMounted(() => {
  getBlogs();
});

const currentChange = (currentPage: number) => {
  pagination.value.page = currentPage;
  getBlogs();
};

const total = ref();

const getBlogs = () => {
  _axios
    .post("/admin/feedback", {
      page: pagination.value.page,
      pageSize: pagination.value.size,
    })
    .then((res) => {
      const data = res.data;
      feedback.value = data.feedbackArr;
      total.value = data.total;
    });
};
</script>

<style lang="scss" scoped>
:deep(.el-input-group__prepend) {
  padding: 0 8px;
}

.el-tag,
.el-button {
  font-size: 1em;
}
</style>
