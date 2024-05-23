<template>
  <div class="blog">
    <el-row :gutter="10" class="blog-container">
      <!-- 上左轮播新闻 -->
      <el-col :sm="10" :xs="24">
        <div class="blog-carousel" style="height: 40vh">
          <el-carousel v-if="blog" arrow="always" height="40vh">
            <el-carousel-item
              v-for="(form, index) in hotBlog"
              :key="index"
              style="cursor: pointer"
              @click="doGoToBlogPage(form.id)"
            >
              <img :src="form.coverUrl" alt="" />
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
            background-color: rgba(242, 242, 242, 0.8);
            border-radius: 10px;
            height: 40vh;
            padding: 10px;
            display: flex;
            flex-direction: column;
          "
        >
          <h3 style="margin: 0; font-size: 1.8em">热帖</h3>
          <ul
            v-if="blog"
            style="
              list-style: none;
              flex: 1;
              padding: 0;
              margin: 10px 0 20px 0;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
            <li
              v-for="(form, index) in hotBlog"
              :key="index"
              style="cursor: pointer; font-size: 18px"
              class="blog-hot-item"
            >
              <span>
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
                <span @click="doGoToBlogPage(form.id)">
                  {{ form.title }}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </el-col>

      <!-- 下方筛选搜索 -->
      <el-col :span="24">
        <el-row class="search-write">
          <el-col
            :sm="12"
            :xs="24"
            style="display: flex; justify-content: center"
          >
            <el-input
              v-model="keyword"
              clearable
              placeholder="请输入搜索内容..."
              size="large"
              style="width: 25vw; margin-right: 10px"
            />
            <el-button plain size="large" type="primary" @click="search">
              <span style="margin: 0; font-size: 1.3em">搜索</span>
            </el-button>
          </el-col>

          <el-col
            :sm="12"
            :xs="24"
            style="display: flex; justify-content: space-around"
          >
            <el-select
              v-model="categoriesChecked"
              placeholder="分类"
              size="large"
              style="width: 100px"
              @change="getBlog(categoriesChecked)"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="(item, index) in categories"
                :key="index"
                :label="item.label"
                :value="item.value"
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
          </el-col>
        </el-row>
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
                  <span style="margin-left: 10px; font-size: 0.8em">
                    {{ form.create_time }}
                  </span>
                </div>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import _axios from "@/api";
import { ElMessage } from "element-plus";
import { InterfaceUrl } from "@/api";
import { useRouter } from "vue-router";
import dateFunction from "@/utils/Date";

const blog = ref();

const hotBlog = ref();

const categories = ref([
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
]);

const categoriesChecked = ref();

const router = useRouter();

const keyword = ref();

const getBlog = (
  category: number | null = null,
  keyword: string | null = null
) => {
  _axios
    .post("/blog", {
      params: {
        page: 1,
        pageSize: null,
        category,
        keyword,
        length: 99,
      },
    })
    .then((res) => {
      blog.value = res.data.map((item: any) => {
        item.create_time = dateFunction(item.create_time);
        return item;
      });

      if (category === null && keyword === null) {
        hotBlog.value = res.data.slice(0, 5);
      }
    });
};

onMounted(() => {
  getBlog();
});

const search = () => {
  getBlog(null, keyword.value);
};

const doGoToBlogPage = (id: number) => {
  router.push({ name: "blogPage", params: { id } });
};

const writeBlog = () => {
  router.push("/blog/postBlog");
};
</script>

<style lang="scss" scoped>
.blog {
  width: 100vw;
}

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
    margin: 0 auto !important;
    width: 80%;
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
          width: 60vw !important;
          margin-right: 0 !important;
          margin-bottom: 10px !important;
        }
      }

      .el-button {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
