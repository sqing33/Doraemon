<template>
  <div class="container text-center">
    <div class="row">
      <!--  上左侧轮播图  -->
      <div class="col-sm-6">
        <el-carousel
          arrow="always"
          height="400px"
          style="position: relative; top: 50%; transform: translateY(-50%)"
        >
          <el-carousel-item
            v-for="(form, index) in form.data.slice(0, 5)"
            :key="index"
            @click="doGoToNewsPage(form.id)"
          >
            <img :src="form.coverUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <!--  上右侧热点新闻  -->
      <div
        class="col-sm-6"
        style="text-align: left; background-color: rgba(242, 242, 242, 0.3)"
      >
        <h3>热点新闻</h3>
        <ul style="padding: 10px 0; list-style: none">
          <li
            v-for="(form, index) in form.data.slice(0, 10)"
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
    </div>

    <!--  下侧新闻列表  -->
    <div class="row">
      <div
        class="col-sm"
        v-for="(form, index) in form.data"
        :key="index"
        style="margin: 20px -5px; text-align: left; width: 95%"
      >
        <div
          style="
            height: 375px;
            max-width: 300px;
            border: 1px solid #111;
            padding: 10px;
          "
          @click="doGoToNewsPage(form.id)"
        >
          <img
            :src="form.coverUrl"
            style="
              height: 18vw;
              min-height: 250px;
              max-width: 250px;
              object-fit: cover;
              position: relative;
              left: 50%;
              transform: translateX(-50%);
            "
            alt=""
          />

          <div style="position: relative; height: 100px; margin-top: 5px">
            <span style="font-size: 1em">
              <strong>[{{ form.region }}]</strong>
              {{ form.title }}
            </span>
            <span style="bottom: 0; left: 30%; font-size: 0.8em">
              {{
                form.publisher === "1"
                  ? "张三"
                  : form.publisher === "2"
                  ? "李四"
                  : form.publisher === "3"
                  ? "王五"
                  : "未知"
              }}
            </span>
            <span style="bottom: 0; right: 0; font-size: 0.8em">
              {{ form.date }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { InterfaceUrl } from "@/api";
import { useRouter } from "vue-router";
import dateFunction from "@/utils/Date";

interface NewsItem {
  title: string;
  content: string;
  coverUrl: string;
  region: string;
  date: string;
  publisher: string;
  radio: number;
  status: boolean;
}

interface FormData {
  data: NewsItem[];
}

const form: FormData = reactive({ data: [] });

onMounted(() => {
  axios
    .get(InterfaceUrl + "/news")
    .then((response) => {
      const data = response.data;
      if (data.state === 0) {
        form.data = data.data.map((item: any) => {
          item.date = dateFunction(item.date);
          return item;
        });
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => {
      ElMessage.error("请求失败，请联系管理员。");
    });
});

const router = useRouter();

const doGoToNewsPage = (id: string) => {
  router.push({ name: "newsPage", params: { id } });
};
</script>

<style lang="scss" scoped>
img {
  height: 50vh;
}

.container {
  .row {
    .col-sm-6 {
      img {
        width: auto;
        height: 100%;
      }

      @media (max-width: 1000px) {
        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .col-sm {
      span {
        position: absolute;
        padding-left: 8px;
        display: block;
      }
    }
  }
}
</style>
