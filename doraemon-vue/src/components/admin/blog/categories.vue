<template>
  <h1 style="margin-top: 10px; margin-bottom: 20px;text-align: center; font: 5vh sans-serif">
    文章分类
  </h1>

  <div>
    <el-button
        style="position: relative; left: 50%; transform: translateX(-50%)"
        type="primary"
        @click="doAddCategory"
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
        :cell-style="{ textAlign: 'center' }"
        :data="categories"
        :header-cell-style="{ textAlign: 'center' }"
        border
        style="height: calc(100vh - 315px);max-height:615px"
    >
      <el-table-column label="序号" type="index" width="60"/>
      <el-table-column label="ID" prop="id" width="175"/>
      <el-table-column label="分类名称" prop="name"/>
      <el-table-column label="使用状态" prop="state" width="125">
        <template #default="scope">
          <el-tag v-if="scope.row.state === 'false' || scope.row.state === false" type="warning">
            未使用
          </el-tag>
          <el-tag v-if="scope.row.state === 'true' || scope.row.state === true">已使用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template #default="scope">
          <div>
            <el-button type="primary" @click="doEdit(scope.row.id)">
              编辑
            </el-button>
            <el-button type="danger" @click="doDelete(scope.row.id, scope.row.name)">
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
          v-model="form.name"
          placeholder="请输入分类名称"
          style="width: 300px"
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

  <el-dialog v-model="editDialogVisible" title="文章分类修改" width="500">
    <div style="display: flex">
      <span style="width: 80px; transform: translateY(4px)">分类名称：</span>
      <el-input
          v-model="editFrom.name"
          placeholder="请输入分类名称"
          style="width: 300px"
      />
    </div>
    <div style="margin-top: 10px">
      <span
          style="width: 80px; transform: translateY(3px); display: inline-block"
      >
        分类状态：
      </span>
      <el-switch
          v-model="editFrom.state"
          active-color="#13ce66"
          inactive-color="#ff4949"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doUpdate">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from "vue";
import axios from "axios";
import {InterfaceUrl} from "@/api";
import {ElMessage, ElMessageBox} from "element-plus";

const categories = ref([]);

const getCategories = () => {
  axios.get(InterfaceUrl + "/admin/blog/categories").then((res) => {
    categories.value = res.data.data;
  });
}

onMounted(() => {
  getCategories();
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
  axios
      .post(InterfaceUrl + "/admin/blog/categoryInsert", null, {
        params: {
          name: form.name,
          state: form.state,
        },
      })
      .then((res) => {
        ElMessage({
          type: "success",
          message: "发布成功!",
        });
        getCategories();
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
};

const editFrom = ref();

const editDialogVisible = ref(false);

const doEdit = (id: number) => {
  editFrom.value = categories.value.find((item) => item.id === id);
  console.log(editFrom.value);
  editFrom.value.state = editFrom.value.state === "true";
  editDialogVisible.value = true;
};

const doUpdate = () => {
  editDialogVisible.value = false;
  axios
      .post(InterfaceUrl + "/admin/blog/categoryUpdate", null, {
        params: {
          id: editFrom.value.id,
          name: editFrom.value.name,
          state: editFrom.value.state,
        },
      })
      .then((res) => {
        ElMessage({
          type: "success",
          message: "修改成功!",
        });
        getCategories();
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
};

const doDelete = (id: number, name: string) => {
  ElMessageBox.confirm("是否确定要删除帖子分类[" + name + "]?", "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    axios
        .post(InterfaceUrl + "/admin/blog/categoryDelete", {id: id})
        .then((res) => {
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
          getCategories();
        })
        .catch((error) => {
          console.error(error);
          ElMessage.error("请求失败，请联系管理员。");
        });
  })
};
</script>

<style scoped></style>
