<template>
  <div id="news">
    <div class="news-head">
      <div class="logo">
        <img alt="logo" src="../../../public/icon.png" />
        <span>哆啦新闻</span>
      </div>

      <div class="search">
        <el-input v-model="keyword" placeholder="搜索">
          <template #suffix>
            <el-icon class="el-input__icon" @click="search">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <div class="news-categories">
      <div class="title">
        <span> 分类： </span>
      </div>

      <div class="categories">
        <span @click="category(null)">全部</span>
        <span v-for="(item, index) in categories" :key="index">
          <span @click="category(item.value)">{{ item.label }}</span>
        </span>
      </div>
    </div>

    <div class="news-container">
      <div v-for="item in news" :key="item.id" class="card">
        <div style="display: flex" @click="doGoToNewsPage(item.id)">
          <img
            :src="item.coverUrl"
            alt=""
            style="height: 100px; margin-right: 20px"
          />
          <div style="position: relative; width: 100%">
            <div>{{ item.title }}</div>
            <div
              style="
                display: flex;
                position: absolute;
                bottom: 0;
                right: 0;
                font-size: 14px;
              "
            >
              <div style="margin-right: 20px">
                {{ item.categor }}
              </div>
              <div>{{ item.create_time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import _axios from "@/api";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import dateFunction from "@/utils/Date";

const router = useRouter();

const news = ref();

const categories = ref([
  {
    label: "新闻",
    value: "新闻",
  },
  {
    label: "娱乐",
    value: "娱乐",
  },
  {
    label: "公告",
    value: "公告",
  },
]);

const keyword = ref();

const search = () => {
  getNews(null, keyword.value);
};

const category = (value: string | null) => {
  getNews(value, null);
};

const getNews = (
  category: string | null = null,
  keyword: string | null = null
) => {
  _axios
    .post("/news", {
      params: {
        page: 1,
        pageSize: null,
        category,
        keyword,
        length: 99,
      },
    })
    .then((res) => {
      news.value = res.data.map((item: any) => {
        item.content = item.content;
        item.create_time = dateFunction(item.create_time);
        return item;
      });
    });
};

onMounted(() => {
  getNews();
});

const doGoToNewsPage = (id: string) => {
  router.push({ name: "newsPage", params: { id } });
};
</script>

<style lang="scss" scoped>
#news {
  width: 60vw;
  margin: 0 auto;

  @media screen and (max-width: 768px) {
    width: 100vw;
  }

  .news-head {
    height: 50px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      font-size: 30px;
      display: flex;

      img {
        height: 80px;
      }

      span {
        display: inline-block;
        margin: auto 10px;
      }
    }

    .search {
      .el-input {
        width: 250px;

        @media screen and (max-width: 768px) {
          width: 50vw;
        }
      }
    }
  }

  .news-categories {
    display: flex;
    font-size: 24px;
    background: rgba(255, 255, 255, 0.5);
    padding: 10px 20px;
    border-radius: 10px;

    @media screen and (max-width: 768px) {
      font-size: 18px;
      width: 90vw;
    }

    .title {
      span {
        width: 100px;
        display: inline-block;
        transform: translateY(-3px);

        @media screen and (max-width: 768px) {
          width: 55px;
        }
      }
    }

    .categories {
      font-size: 16px;
      justify-content: space-around;

      @media screen and (min-width: 768px) {
        display: flex;
      }

      span {
        cursor: pointer;
        padding: 5px 15px;
        margin-left: 20px;
        text-align: center;

        &:hover {
          background: #f5f5f5be;
          border-radius: 5px;
          color: rgb(98, 175, 249);
          transition: all 0.3s ease-in-out;
        }
      }
    }
  }

  .news-container {
    margin-top: 30px;

    .card {
      padding: 20px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 10px;

      &:hover {
        transform: scale(1.02);
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
</style>
