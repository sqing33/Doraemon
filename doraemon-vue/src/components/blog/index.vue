<template>
  <el-row :gutter="10" style="margin: 0" id="blog">
    <el-col :sm="4" :xs="24" class="hidden-xs-only">
      <el-affix :offset="145" style="width: 100%; height: 40vh">
        <div
          style="
            min-height: 50vh;
            margin: 0 20px;
            padding: 20px 0;
            background-color: rgb(240, 244, 255, 0.5);
            border-radius: 20px;
          "
        >
          <h3 style="text-align: center; margin-bottom: 20px">分类</h3>
          <div style="width: 100px; margin: 0 auto">
            <el-check-tag
              :checked="tagChecked == null"
              type="primary"
              @click="tagCheck()"
            >
              <span style="font: 1.2em sans-serif; margin: auto">全部</span>
            </el-check-tag>

            <el-check-tag
              :checked="tagChecked === item.id"
              type="primary"
              v-for="(item, index) in categories"
              :key="index"
              @click="tagCheck(item.id)"
            >
              <span style="font: 1.2em sans-serif; margin: auto">{{
                item.name
              }}</span>
            </el-check-tag>
          </div>
        </div>
      </el-affix>
    </el-col>
    <el-col :sm="15" :xs="24" class="affix-container">
      <el-affix
        target=".affix-container"
        :offset="50"
        style="height: 100px; width: 110%; position: relative; left: -5%"
      >
        <div class="search-write">
          <div style="margin-left: 45px">
            <el-input
              v-model="keyword"
              style="width: 350px; margin-right: 10px"
              placeholder="请输入搜索内容..."
              clearable
              size="large"
            />
            <el-button type="primary" size="large" plain @click="search">
              <span style="margin: 0; font-size: 1.3em">搜索</span>
            </el-button>
          </div>

          <el-button
            type="primary"
            size="large"
            @click="writeBlog"
            round
            style="margin-right: 45px"
          >
            <span style="margin: 0; font-size: 1.3em">发表帖子</span>
          </el-button>
        </div>
      </el-affix>

      <el-card
        style="width: 100%; margin-bottom: 10px"
        shadow="hover"
        v-for="(item, index) in blog"
        :key="index"
        @click="doGoToBlogPage(item.id)"
      >
        <template #header>{{ item.title }}</template>
        <div style="display: flex; align-items: center">
          <img :src="item.coverUrl" style="width: 15vw; max-width: 100px" />
          <div v-html="item.content" style="margin-left: 10px"></div>
        </div>
        <template #footer>{{ item.create_time }}</template>
      </el-card>
    </el-col>
    <el-col :sm="5" class="hidden-xs-only">
      <el-affix :offset="145"> 推荐 </el-affix>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { InterfaceUrl } from "@/api";
import { useRouter } from "vue-router";
import LZString from "lz-string";
import dateFunction from "@/utils/Date"; 

const router = useRouter();

const blog = ref();

const categories = ref();

const tagChecked = ref();

const tagCheck = (id?: number) => {
  tagChecked.value = id;
  getBlogs(id);
};

const keyword = ref();

const search = () => {
  getBlogs(null, keyword.value);
};

const getBlogs = (
  categoryId: number | null = null,
  keyword: string | null = null
) => {
  axios
    .post(InterfaceUrl + "/blogs", null, {
      params: {
        page: 1,
        pageSize: null,
        categoryId,
        keyword,
        length: 99,
      },
    })
    .then((res) => {
      blog.value = res.data.data.map((item: any) => {
        item.content = LZString.decompressFromBase64(item.content);
        item.create_time = dateFunction(item.create_time);
        return item;
      });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
};

onMounted(() => {
  getBlogs();
  axios
    .get(InterfaceUrl + "/blog/categories")
    .then((res) => {
      categories.value = res.data.data
        .filter((item: any) => item.state === "true")
        .map((item: any) => {
          return item;
        });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
});

const doGoToBlogPage = (id: string) => {
  router.push({ name: "blogPage", params: { id } });
};

const writeBlog = () => {
  router.push("/blog/postBlog");
};
</script>

<style lang="scss" scoped>
#blog {
  .el-affix {
    @media screen and (max-width: 768px) {
      width: 100% !important;
      left: 0 !important;
    }
  }

  .el-check-tag {
    display: flex;
    width: 100px;
    height: 50px;
    margin-bottom: 10px;
    padding: 0;
  }

  .search-write {
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    border-radius: 10px;
    padding: 18px;
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 768px) {
      padding: 18px 1.5vw !important;

      div {
        margin-left: 0 !important;

        .el-input {
          width: 40vw !important;
          margin-right: 0 !important;
        }
      }

      .el-button {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
