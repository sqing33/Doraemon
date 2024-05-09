<template>
  <el-row :gutter="10" class="blog-container">
    <!-- 上左轮播新闻 -->
    <el-col :sm="10" :xs="24">
      <div class="blog-carousel" style="height: 40vh">
        <el-carousel v-if="blog" arrow="always" height="40vh">
          <el-carousel-item
              v-for="(form, index) in blog.slice(0, 5)"
              :key="index"
              @click="doGoToblogPage(form.id)"
          >
            <img :src="form.coverUrl" alt=""/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>

    <!-- 上右热点新闻 -->
    <el-col :sm="14" :xs="24">
      <div
          class="blog-hot"
          style="
          text-align: left;
          background-color: rgba(242, 242, 242, 0.3);
          height: 40vh;
        "
      >
        <h3>热帖</h3>
        <ul v-if="blog" style="padding: 10px 0; list-style: none">
          <li
              v-for="(form, index) in blog.slice(0, 5)"
              :key="index"
              style="height: 42px"
          >
            <h6>
              <span
                  style="
                  display: inline-block;
                  width: 30px;
                  text-align: center;
                  transform: translateY(1px);
                  cursor: pointer;
                "
              >
                {{ index + 1 + ". " }}
              </span>
              <span @click="doGoToblogPage(form.id)">
                {{ form.title }}
              </span>
            </h6>
          </li>
        </ul>
      </div>
    </el-col>

    <!-- 下方筛选搜索 -->
    <el-col :span="24">
      <div class="search-write">
        <div style="margin-left: 45px">
          <el-input
              v-model="keyword"
              clearable
              placeholder="请输入搜索内容..."
              size="large"
              style="width: 350px; margin-right: 10px"
          />
          <el-button plain size="large" type="primary" @click="search">
            <span style="margin: 0; font-size: 1.3em">搜索</span>
          </el-button>
        </div>

        <el-select
            v-model="categoriesChecked"
            placeholder="分类"
            size="large"
            style="width: 240px"
            @change="getBlog(categoriesChecked)"
        >
          <el-option label="全部" value=""/>
          <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>

        <el-button
            round
            size="large"
            style="margin-right: 45px"
            type="primary"
            @click="writeBlog"
        >
          <span style="margin: 0; font-size: 1.3em">发表帖子</span>
        </el-button>
      </div>
    </el-col>

    <!-- 下方新闻列表 -->
    <el-col :span="24">
      <el-row class="blog-list">
        <el-col
            v-for="(form, index) in blog"
            :key="index"
            :sm="8"
            :xs="24"
            style="max-width: 100vw"
        >
          <el-card
              shadow="hover"
              style="margin: 5px 5px"
              @click="doGoToBlogPage(form.id)"
          >
            <template #header>
              <div style="height: 45px; text-align: center">
                {{ form.title }}
              </div>
            </template>
            <img
                :src="form.coverUrl"
                alt=""
                style="
                height: 225px;
                max-width: 100%;
                object-fit: contain;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
              "
            />
            <template #footer>
              <div style="display: flex; justify-content: space-between">
                <!-- <strong>
                  [{{
                    form.region === "1"
                      ? "新闻"
                      : form.region === "2"
                      ? "活动"
                      : form.region === "3"
                      ? "公告"
                      : "未知"
                  }}]
                </strong> -->
                <div>
                  <!-- <span style="font-size: 0.8em">
                    {{
                      form.publisher === "1"
                        ? "张三"
                        : form.publisher === "2"
                        ? "李四"
                        : form.publisher === "3"
                        ? "王五"
                        : "未知"
                    }}
                  </span> -->
                  <span style="margin-left: 10px; font-size: 0.8em">
                    {{ form.create_time }}
                  </span>
                </div>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {InterfaceUrl} from "@/api";
import {useRouter} from "vue-router";
import dateFunction from "@/utils/Date";

const blog = ref();

const categories = ref();

const categoriesChecked = ref();

const router = useRouter();

const keyword = ref();

const getBlog = (
    categoryId: number | null = null,
    keyword: string | null = null
) => {
  axios
      .post(InterfaceUrl + "/blog", null, {
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
          item.content = item.content;
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
  getBlog();
  axios
      .get(InterfaceUrl + "/blog/categories")
      .then((res) => {
        categories.value = res.data.data
            .filter((item: any) => item.state === "true")
            .map((item: any) => {
              return item;
            });
        console.log(categories.value);
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error("请求失败，请联系管理员。");
      });
});

const search = () => {
  getBlog(null, keyword.value);
};

const doGoToBlogPage = (id: number) => {
  router.push({name: "blogPage", params: {id}});
};

const writeBlog = () => {
  router.push("/blog/postBlog");
};
</script>

<style lang="scss" scoped>
.blog-container {
  .el-carousel {
    img {
      width: auto;
      height: 100%;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    @media (max-width: 1000px) {
      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .blog-carousel,
  .blog-hot,
  .blog-list {
    margin-bottom: 10px;
  }

  :deep(.el-card__header),
  :deep(.el-card__body),
  :deep(.el-card__footer) {
    padding: 10px;
  }

  @media screen and (min-width: 768px) {
    width: 1200px;
    margin: 0 auto !important;

    .blog-carousel,
    .blog-hot,
    .blog-list {
      margin: 10px;
    }
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
