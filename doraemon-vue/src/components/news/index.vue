<template>
  <el-row :gutter="10" class="news-container">
    <!-- 上左轮播新闻 -->
    <el-col :xs="24" :sm="10">
      <div class="news-carousel" style="height: 40vh">
        <el-carousel arrow="always" height="40vh" v-if="news">
          <el-carousel-item
            v-for="(form, index) in news.slice(0, 5)"
            :key="index"
            @click="doGoToNewsPage(form.id)"
          >
            <img :src="form.coverUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>

    <!-- 上右热点新闻 -->
    <el-col :xs="24" :sm="14">
      <div
        class="news-hot"
        style="
          text-align: left;
          background-color: rgba(242, 242, 242, 0.3);
          height: 40vh;
        "
      >
        <h3>热点新闻</h3>
        <ul style="padding: 10px 0; list-style: none" v-if="news">
          <li
            v-for="(form, index) in news.slice(0, 5)"
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
              <span @click="doGoToNewsPage(form.id)">
                {{ form.title }}
              </span>
            </h6>
          </li>
        </ul>
      </div>
    </el-col>

    <!-- 下方新闻列表 -->
    <el-col :span="24">
      <el-row class="news-list">
        <!-- 分类、搜索 -->
        <!-- <el-col
          :span="24"
          style="
            height: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="margin-left: 30px">分类</div>
          <div style="margin-right: 30px">搜索</div>
        </el-col> -->

        <el-col
          :xs="24"
          :sm="8"
          v-for="(form, index) in news"
          :key="index"
          style="max-width: 100vw"
        >
          <el-card
            style="margin: 5px 5px"
            shadow="hover"
            @click="doGoToNewsPage(form.id)"
          >
            <template #header>
              <div style="height: 45px; text-align: center">
                {{ form.title }}
              </div>
            </template>
            <img
              :src="form.coverUrl"
              style="
                height: 225px;
                max-width: 100%;
                object-fit: contain;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
              "
              alt=""
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
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { InterfaceUrl } from "@/api";
import { useRouter } from "vue-router";
import dateFunction from "@/utils/Date";
import LZString from "lz-string";

const news = ref();

const categories = ref();

const router = useRouter();

const getNews = (
  categoryId: number | null = null,
  keyword: string | null = null
) => {
  axios
    .post(InterfaceUrl + "/news", null, {
      params: {
        page: 1,
        pageSize: null,
        categoryId,
        keyword,
        length: 99,
      },
    })
    .then((res) => {
      news.value = res.data.data.map((item: any) => {
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
  getNews();
  axios
    .get(InterfaceUrl + "/news/categories")
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

const doGoToNewsPage = (id: string) => {
  router.push({ name: "newsPage", params: { id } });
};
</script>

<style lang="scss" scoped>
.news-container {
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

  .news-carousel,
  .news-hot,
  .news-list {
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

    .news-carousel,
    .news-hot,
    .news-list {
      margin: 10px;
    }
  }
}
</style>
