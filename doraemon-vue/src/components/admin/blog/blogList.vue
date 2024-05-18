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
      <ElementForm v-model="searchValues" v-bind="formConfig">
        <template #footer>
          <el-button
            plain
            style="margin-left: 10px; margin-top: 8px"
            type="primary"
            @click="search"
          >
            <span style="margin: 0">筛选</span>
          </el-button>
        </template>
      </ElementForm>
    </div>
  </div>

  <el-table
    :cell-style="{ textAlign: 'center' }"
    :data="blog"
    :header-cell-style="{ textAlign: 'center' }"
    :row-style="{ height: '115px' }"
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
    <el-table-column label="ID" prop="id" width="150" />
    <el-table-column label="标题" prop="title" width="auto" />
    <el-table-column label="封面" prop="coverUrl" width="200">
      <template #default="scope">
        <img
          :src="scope.row.coverUrl"
          alt=""
          style="width: auto; max-height: 90px"
        />
      </template>
    </el-table-column>
    <el-table-column label="类型" prop="category_id" width="100">
      <template #default="scope">
        <el-tag>{{ scope.row.category }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="发布者ID" prop="publisher_id" width="100">
    </el-table-column>
    <el-table-column label="发布日期" prop="create_time">
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
            @click="doDelete(scope.row.id, scope.row.title)"
            >删除
          </el-button>
        </div>
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

  <el-dialog
    v-model="dialogVisible"
    center
    destroy-on-close
    title="查看帖子"
    top="20px"
    width="60vw"
  >
    <checkBlog></checkBlog>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button
        type="danger"
        @click="
          doDelete(
            store.getters.getCheck.form.id,
            store.getters.getCheck.form.title
          )
        "
      >
        删除
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { InterfaceUrl } from "@/api";
import dateFunction from "@/utils/Date";
import ElementForm from "@/utils/ElementForm.vue";
import checkBlog from "./checkBlog.vue";
import { useStore } from "vuex";

const store = useStore();

const categories = ref();

const searchCategories = ref();

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
    options: [
      {
        label: "分享",
        value: "分享",
      },
      {
        label: "娱乐",
        value: "娱乐",
      },
      {
        label: "杂谈",
        value: "杂谈",
      },
    ],
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
  getBlogs();
});

const currentChange = (currentPage: number) => {
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
  searchValues;
};

const getBlogs = (
  keyword?: string,
  category?: number,
  create_time?: string
) => {
  axios
    .post(InterfaceUrl + "/blog", null, {
      params: {
        page: pagination.value.page,
        pageSize: pagination.value.size,
        keyword,
        category,
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

const dialogVisible = ref(false);

const doCheck = (id: number) => {
  const checkForm = blog.value.find((item: any) => item.id === id);
  store.dispatch("setCheck", { form: checkForm, categories });
  dialogVisible.value = true;
};

const doDelete = (id: number, title: string) => {
  ElMessageBox.confirm("是否确定要删除帖子[" + title + "]?", "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    axios
      .post(InterfaceUrl + "/admin/blog/delete", { id })
      .then((res) => {
        ElMessage.success("删除成功！");
        getBlogs();
        dialogVisible.value = false;
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
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
