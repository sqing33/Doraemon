<template>
  <h1 style="margin-top: 3vh; text-align: center; font: 5vh sans-serif">
    用户列表
  </h1>

  <el-table
    :data="form"
    border
    height="82vh"
    style="margin: 0 auto; font: 0.85em sans-serif"
    :row-class-name="tableRowClassName"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    :row-style="{ height: '125px' }"
  >
    <el-table-column type="index" label="序号" width="50" />
    <el-table-column prop="nickname" label="昵称" width="150" />
    <el-table-column prop="username" label="用户名" width="150" />
    <el-table-column prop="avatar" label="头像" width="125">
      <template #default="scope">
        <img
          :src="scope.row.avatar"
          style="height: auto; max-width: 100px"
          alt=""
        />
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="注册时间">
      <template #default="scope">
        <span>{{ timeConvert(scope.row.create_time) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="手机号" width="175" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column align="center" label="操作" width="150">
      <template #default="scope">
        <div style="display: flex; flex-direction: column; padding: 0 30px">
          <el-button type="primary" @click="doEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button
            style="margin: 5px 0 0 0"
            type="danger"
            @click="doDelete(scope.row.id)"
          >
            删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { InterfaceUrl } from "@/api";

const router = useRouter();

interface Form {
  nickname: string;
  username: string;
  avatar: string;
  createTime: string;
  phone: string;
  email: string;
}

const form: Form = ref();

const pagination = ref({
  page: 1,
  size: 5,
});

const currentChange = (currentPage) => {
  pagination.value.page = currentPage;
};

const total = ref();

onMounted(() => {
  axios
    .get(InterfaceUrl + "/admin/users")
    .then((response) => {
      const data = response.data;
      if (data.state === 0) {
        form.value = data.data;
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => {
      ElMessage.error("请求失败，请联系管理员。");
    });
});

/*const doEdit = (id) => {
    router.push({name: 'NewsEdit', params: {id: id}});
  }

  const doDelete = (id) => {
    axios.delete('http://localhost:8081/api/admin/news/' + id)
        .then(response => {
          ElMessage.success('删除成功！')
          form.value = form.value.filter(item => item.id !== id);
        })
        .catch(error => {
          ElMessage.error('删除失败，请联系管理员。')
        });
  }*/

// 转换时间格式
const timeConvert = (time) => {
  const date = new Date(time);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const cstDateTime = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  return cstDateTime;
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
