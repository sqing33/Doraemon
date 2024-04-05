<template>
  <h1 style="margin-top: 3vh; text-align: center; font: 5vh sans-serif">
    文章分类
  </h1>

  <div>
    <el-button
      type="primary"
      @click="doAddCategory"
      style="position: relative; left: 50%; transform: translateX(-50%)"
    >
      添加分类
    </el-button>
  </div>

  <div
    style="
      width: 70vw;
      position: relative;
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
    "
  >
    <el-table
      :data="categories"
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="id" label="ID" width="175" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="state" label="使用状态" width="125">
        <template #default="scope">
          <el-tag v-if="scope.row.state === 'false'" type="warning">
            未使用
          </el-tag>
          <el-tag v-if="scope.row.state === 'true'">已使用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template #default="scope">
          <div>
            <el-button type="primary" @click="doEdit(scope.row.id)">
              编辑
            </el-button>
            <el-button type="danger" @click="doDelete(scope.row.id)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogVisible" title="新增文章分类" width="500">
    <div style="display: flex">
      <span style="width: 80px; transform: translateY(4px)">分类名称：</span>
      <el-input
        style="width: 300px"
        v-model="form.name"
        placeholder="请输入分类名称"
      />
    </div>
    <div style="margin-top: 10px">
      <span
        style="width: 80px; transform: translateY(3px); display: inline-block"
      >
        分类状态：
      </span>
      <el-switch
        v-model="form.state"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { InterfaceUrl } from "@/api";

const categories = ref([]);

onMounted(() => {
  axios.get(InterfaceUrl + "/admin/blog/categories").then((res) => {
    categories.value = res.data.data;
  });
});

const dialogVisible = ref(false);

interface Category {
  name: string;
  state: boolean;
}

const form: Category = reactive({
  name: "",
  state: true,
});

const doAddCategory = () => {
  dialogVisible.value = true;
};

const submitForm = () => {
  dialogVisible.value = false;
  console.log(form);
  axios
    .post(InterfaceUrl + "/admin/blog/categoryInsert", null, {
      params: {
        name: form.name,
        state: form.state,
      },
    })
    .then((res) => {
      console.log(res);
    });
};
</script>

<style scoped></style>
