<template>
  <div style="height: calc(100vh - 90px)">
    <h1 style="margin: 20px 0; text-align: center; font: 36px sans-serif">
      用户列表
    </h1>

    <div style="display: flex; justify-content: center">
      <el-input
        v-model="keyword"
        style="width: 240px; margin-right: 10px; margin-bottom: 20px"
        placeholder="请输入关键字进行查找"
      ></el-input>
      <el-button type="primary" @click="doSearch">搜索</el-button>
    </div>

    <el-table
      :cell-style="{ textAlign: 'center' }"
      :data="form"
      :header-cell-style="{ textAlign: 'center' }"
      :row-style="{ height: '125px' }"
      border
      style="
        margin: 0 auto;
        font: 0.85em sans-serif;
        height: calc(100vh - 200px);
      "
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="昵称" prop="nickname" width="125" />
      <el-table-column label="用户名" prop="username" width="125" />
      <el-table-column label="UID" prop="id" width="150" />
      <el-table-column label="头像" prop="avatarUrl" width="125">
        <template #default="scope">
          <img
            :src="scope.row.avatarUrl"
            alt=""
            style="height: auto; max-width: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="create_time">
        <template #default="scope">
          <span>{{ dateFunction(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" width="150" />
      <el-table-column label="邮箱" prop="email" width="200" />
      <el-table-column align="center" label="操作" width="150">
        <template #default="scope">
          <div style="display: flex; flex-direction: column; padding: 0 30px">
            <el-button
              style="margin: 5px 0 0 0"
              type="danger"
              @click="doDelete(scope.row.id, scope.row.nickname)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import _axios from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import dateFunction from "@/utils/Date";

const form = ref();

const keyword = ref("");

const getUsers = (keyword?: string) => {
  _axios
    .get("/admin/users", {
      params: { keyword: keyword },
    })
    .then((response) => {
      form.value = response.data;
    });
};

const doSearch = () => {
  getUsers(keyword.value);
};

onMounted(() => {
  getUsers();
});

const doDelete = (id: number, name: string) => {
  ElMessageBox.confirm("是否确定要删除用户[" + name + "]?", "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    _axios.post("/admin/users/delete", { id: id }).then((res) => {
      ElMessage.success("删除成功！");
      getUsers();
    });
  });
};
</script>

<style lang="scss" scoped>
.warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9) !important;
}

.success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}

.el-tag,
.el-button {
  font-size: 1em;
}

.checkDialog {
  display: flex;
  flex-direction: column;
  font-size: 1.8vh;
  height: 50vh;
  transform: translateX(5vw);

  span {
    padding-bottom: 0.5vh;

    &:nth-child(2),
    &:nth-child(3) {
      min-height: 100px;
    }

    span {
      display: inline-block;
      width: 95px;
      transform: translateY(1vh);
    }
  }
}
</style>
