<template>
  <h1 style="margin-top: 3vh; text-align: center; font: 5vh sans-serif">
    新闻列表
  </h1>

  <el-table
    :data="form"
    border
    height="71.4vh"
    style="margin: 0 auto; font: 0.85em sans-serif"
    :row-class-name="tableRowClassName"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    :row-style="{ height: '125px' }"
  >
    <el-table-column type="index" label="序号" width="75" />
    <el-table-column prop="title" label="标题" width="330" />
    <el-table-column prop="coverUrl" label="封面" width="200">
      <template #default="scope">
        <img
          :src="scope.row.coverUrl"
          style="width: 150px; height: auto; max-height: 100px"
          alt=""
        />
      </template>
    </el-table-column>
    <el-table-column prop="region" label="类型" width="100">
      <template #default="scope">
        <el-tag v-if="scope.row.region === '1'">新闻</el-tag>
        <el-tag v-if="scope.row.region === '2'">活动</el-tag>
        <el-tag v-if="scope.row.region === '3'">公告</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="发布日期">
      <template #default="scope">
        <span>{{ timeConvert(scope.row.date) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="publisher" label="发布者" width="100">
      <template #default="scope">
        <el-tag v-if="scope.row.publisher === '1'">张三</el-tag>
        <el-tag v-if="scope.row.publisher === '2'">李四</el-tag>
        <el-tag v-if="scope.row.publisher === '3'">王五</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="发布状态" width="100">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 'false'" type="warning">
          未发布
        </el-tag>
        <el-tag v-if="scope.row.status === 'true'">已发布</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="150">
      <template #default="scope">
        <div style="display: flex; flex-direction: column; padding: 0 30px">
          <el-button type="primary" @click="doCheck(scope.row.id)"
            >查看
          </el-button>
          <el-button
            style="margin: 5px 0 0 0"
            type="primary"
            @click="doEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            style="margin: 5px 0 0 0"
            type="danger"
            @click="doDelete(scope.row.id)"
            >删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    background
    layout="prev, pager, next, jumper,"
    :total="total"
    :pager-count="11"
    :page-size="pagination.size"
    @current-change="currentChange"
    style="
      transform: translateY(20px);
      margin: auto;
      width: 80vw;
      height: 15vh;
      text-align: center;
    "
  ></el-pagination>

  <el-dialog
    v-model="centerDialogVisible"
    title="查看新闻内容"
    width="60vw"
    destroy-on-close
    center
  >
    <div class="checkDialog">
      <span><span>标题：</span> {{ checkForm.data.title }}</span>
      <span
        ><span>内容：</span
        ><span style="width: 40vw">{{ checkForm.data.content }}</span>
      </span>
      <span
        ><span>封面：</span>
        <img
          style="height: 100px"
          :src="InterfaceUrl + checkForm.data.coverUrl"
          alt=""
      /></span>
      <span><span>类型：</span> {{ checkForm.data.region }}</span>
      <span><span>发布者：</span> {{ checkForm.data.publisher }}</span>
      <span><span>发布日期：</span> {{ checkForm.data.date }}</span>
      <span><span>发布状态：</span> {{ checkForm.data.status }}</span>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="doEdit(id.value)"> 编辑</el-button>
        <el-button type="danger" @click="doDelete(id.value)"> 删除</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { InterfaceUrl } from "@/api";
import LZString from "lz-string";

const router = useRouter();

const form = ref();

const pagination = ref({
  page: 1,
  size: 5,
});

const currentChange = (currentPage) => {
  pagination.value.page = currentPage;
  fetchPets();
};

const total = ref();

onMounted(() => {
  fetchPets();
});

const fetchPets = () => {
  axios
    .post(InterfaceUrl + "/admin/news", null, {
      params: {
        page: pagination.value.page,
        size: pagination.value.size,
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.state === 0) {
        form.value = data.data.newsArr.newsArr;
        total.value = data.data.newsArr.total;
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => {
      ElMessage.error("请求失败，请联系管理员。");
    });
};

const tableRowClassName = ({ row }) => {
  if (row.status === true) {
    return "success-row";
  } else if (row.status === false) {
    return "warning-row";
  }
};

const centerDialogVisible = ref(false);
const checkForm = reactive({ data: [] });

const doCheck = (newsId) => {
  checkForm.data = form.value.find((item) => item.id === newsId);
  centerDialogVisible.value = true;
};

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
