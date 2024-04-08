<template>
  <div
    style="
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    "
  >
    <h3 style="margin-left: 20px; margin-top: 8px">帖子管理</h3>
    <div style="margin-right: 20px">
      <ElementForm v-bind="formConfig" v-model="searchValues">
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
    :data="blog"
    border
    height="70.4vh"
    style="margin: 0 auto; font: 0.85em sans-serif"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    :row-style="{ height: '110px' }"
  >
    <el-table-column type="index" label="序号" width="75" />
    <el-table-column prop="id" label="ID" width="150" />
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
    <el-table-column prop="category_id" label="类型" width="100">
      <template #default="scope">
        <el-tag>{{ getCategoryLabel(scope.row.category_id) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="publisher_id" label="发布者ID" width="100">
    </el-table-column>
    <el-table-column prop="create_time" label="发布日期">
      <template #default="scope">
        <span>{{ dateFunction(scope.row.create_time) }}</span>
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

<script lang="ts" setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { InterfaceUrl } from "@/api";
import dateFunction from "@/utils/Date";
import ElementForm from "@/utils/ElementForm.vue";

const categories = ref();
console.log(categories);

const formItems = reactive([
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
    prop: "category",
    style: ["width: 13vw", "margin-right: 20px"],
    options: categories,
  },
  {
    label: "发布时间",
    type: "date",
    placeholder: "请选择发布时间",
    prop: "date",
    style: ["width: 13vw", "margin-right: 20px"],
  },
]);

const formConfig = {
  formItems,
  labelStyle: ["display: flex", "padding-top: 8px"],
};

const formValues: any = {};
formConfig.formItems.map((item) => {
  formValues[item.prop] = "";
});

const searchValues = reactive(formValues);

const blog = ref();

const pagination = ref({
  page: 1,
  size: 5,
});

onMounted(() => {
  axios
    .get(InterfaceUrl + "/blog/categories")
    .then((res) => {
      // 在分类列表中添加一个全部选项
      const allOption = {
        label: "所有",
        value: null,
      };
      categories.value = [
        allOption,
        ...res.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ];
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
  getBlogs();
});

const getCategoryLabel = (categoryId: any) => {
  const category = categories.value.find(
    (item: any) => item.value === categoryId
  );
  return category ? category.label : "";
};

const currentChange = (currentPage) => {
  pagination.value.page = currentPage;
  getBlogs();
};

const total = ref();

const search = () => {
  if (searchValues.date) {
    const date = new Date(searchValues.date);
    searchValues.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
  }
  getBlogs(searchValues.keyword, searchValues.category, searchValues.date);
  console.log(searchValues);
};

const getBlogs = (
  keyword?: string,
  categoryId?: number,
  create_time?: string
) => {
  axios
    .post(InterfaceUrl + "/blog", null, {
      params: {
        page: pagination.value.page,
        pageSize: pagination.value.size,
        keyword,
        categoryId,
        create_time,
      },
    })
    .then((res) => {
      blog.value = res.data.data.blogArr;
      total.value = res.data.data.total;
    })
    .catch((error) => {
      console.log(error);
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
