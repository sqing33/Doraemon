<template>
  <h1 style="margin-top: 3vh; text-align: center; font: 5vh sans-serif">
    文章管理
  </h1>

  <div>
    <el-button
      type="primary"
      @click="doAddBlog"
      style="position: relative; left: 50%; transform: translateX(-50%)"
    >
      添加文章
    </el-button>
  </div>

  <el-table
    :data="blog"
    border
    style="margin: 0 auto; font: 0.85em sans-serif"
    :row-class-name="tableRowClassName"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    :row-style="{ height: '125px' }"
  >
    <el-table-column type="index" label="序号" width="75" />
    <el-table-column prop="id" label="ID" width="200" />
    <el-table-column prop="title" label="标题" />
    <el-table-column prop="region" label="类型" width="100">
      <template #default="scope">
        <el-tag v-if="scope.row.region === '550829782863941'">分享</el-tag>
        <el-tag v-if="scope.row.region === '550829850009669'">杂谈</el-tag>
        <el-tag v-if="scope.row.region === '550829869162565'">娱乐</el-tag>
        <el-tag v-if="scope.row.region === '550829949513797'">提示</el-tag>
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" width="300">
      <template #default="scope">
        <div>
          <el-button type="primary" @click="doEdit(scope.row.id)">
            查看
          </el-button>
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

  <el-dialog v-model="dialogVisible" title="新增文章分类" width="500">
    <div style="display: flex">
      <span style="width: 80px; transform: translateY(4px)">分类名称：</span>
      <el-input
        style="width: 300px"
        v-model="form.title"
        placeholder="请输入文章标题"
      />
    </div>

    <div style="margin-top: 10px">
      <span
        style="width: 80px; transform: translateY(3px); display: inline-block"
      >
        文章内容：
      </span>
      <el-input
        style="width: 300px"
        v-model="form.content"
        placeholder="请输入文章内容"
      />
    </div>

    <div style="margin-top: 10px">
      <span
        style="width: 80px; transform: translateY(3px); display: inline-block"
      >
        文章分类：
      </span>
      <el-select v-model="form.region" placeholder="分类" style="width: 240px">
        <el-option label="分享" :value="550829782863941" />
        <el-option label="杂谈" :value="550829850009669" />
        <el-option label="娱乐" :value="550829869162565" />
        <el-option label="提示" :value="550829949513797" />
      </el-select>
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
import axios from "axios";
import { ref, reactive } from "vue";
import { InterfaceUrl } from "@/api";

const blog = ref([
  {
    id: "1",
    title: "分享：如何用Python写一个爬虫？",
    region: "550829782863941",
  },
  {
    id: "2",
    title: "娱乐：如何用Python写一个贪吃蛇？",
    region: "550829869162565",
  },
  {
    id: "3",
    title: "提示：如何用Python写一个机器学习算法？",
    region: "550829949513797",
  },
  {
    id: "4",
    title: "杂谈：如何用Python写一个股票分析程序？",
    region: "550829850009669",
  },
]);

interface Blog {
  title: string;
  content: string;
  region: string;
}

const form: Blog = reactive({
  title: "",
  content: "",
  region: "",
});

const dialogVisible = ref(false);

const doAddBlog = () => {
  dialogVisible.value = true;
};

const submitForm = () => {
  dialogVisible.value = false;
  console.log(form);
  axios.post(InterfaceUrl + "/blogInsert", form).then((res) => {
    console.log(res);
  });
};
</script>
