<template>
  <div
    style="
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    "
  >
    <h3 style="margin-left: 20px; margin-top: 8px">新闻列表</h3>
    <div style="margin-right: 20px">
      <ElementForm v-bind="formConfig">
        <template #footer>
          <el-button
            type="primary"
            plain
            @click="search"
            style="margin-left: 10px; margin-top: 8px"
          >
            <span style="margin: 0">筛选</span>
          </el-button>
        </template>
      </ElementForm>
    </div>
  </div>

  <el-table
    :data="form"
    border
    height="70.4vh"
    style="margin: 0 auto; font: 0.85em sans-serif"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    :row-style="{ height: '110px' }"
  >
    <el-table-column type="index" label="序号" width="75" />
    <el-table-column prop="title" label="标题" width="auto" />
    <el-table-column prop="coverUrl" label="封面" width="200">
      <template #default="scope">
        <img
          :src="scope.row.coverUrl"
          style="width: auto; max-height: 90px"
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
        <span>{{ dateFunction(scope.row.date) }}</span>
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
    style="margin: auto; width: 80vw; height: 8vh"
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
import dateFunction from "@/utils/Date";
import ElementForm from "@/utils/ElementForm.vue";

const router = useRouter();

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];

// 表单配置
const formConfig = {
  formItems: [
    {
      label: "关键字",
      type: "input",
      placeholder: "请输入关键字",
      prop: "keyword",
      style: ["width: 14vw", "margin-right: 20px"],
    },
    {
      label: "类型",
      type: "select",
      placeholder: "请选择类型",
      prop: "categories",
      style: ["width: 13vw", "margin-right: 20px"],
      options: options,
    },
    {
      label: "发布时间",
      type: "date",
      placeholder: "请选择发布时间",
      prop: "date",
      style: ["width: 13vw", "margin-right: 20px"],
    },
  ],
  labelStyle: ["display: flex", "padding-top: 8px"],
};

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

const keyword = ref();
const categories = ref();
const date = ref();

const search = () => {
  console.log(keyword.value);
  console.log(categories.value);
  console.log(date.value);
};

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

const centerDialogVisible = ref(false);
const checkForm = reactive({ data: [] });

const doCheck = (newsId) => {
  checkForm.data = form.value.find((item) => item.id === newsId);
  centerDialogVisible.value = true;
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
