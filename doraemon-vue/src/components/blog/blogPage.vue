<template>
  <div class="news-intro">
    <h2 style="width: 90%; margin: 0 auto; text-align: center">
      {{ blog.title }}
    </h2>

    <div
      style="
        position: absolute;
        display: flex;
        font-size: 0.9em;
        transform: translateY(12px);
        right: 20px;
      "
    >
      <div>&nbsp;|&nbsp;</div>
      <div>{{ blog.create_time }}</div>
    </div>

    <div style="margin-top: 40px">
      <div class="divider"></div>
      <div v-html="blog.content"></div>
    </div>

    <div class="news-footer">
      <router-link to="/blog" style="text-decoration: none; color: black">
        <el-icon>
          <Tickets />
        </el-icon>
        返回帖子首页
      </router-link>

      <div ref="shareRef" @click="doShare">
        <el-icon>
          <Share />
        </el-icon>
        分享
      </div>
      <el-popover
        :virtual-ref="shareRef"
        trigger="click"
        title="已复制链接"
        virtual-triggering
        width="300"
      >
        <span> {{ text }} </span>
      </el-popover>

      <div @click="">
        <el-icon>
          <Star />
        </el-icon>
        收藏
      </div>
    </div>

    <div class="comment">
      <h4>评论</h4>

      <el-input
        v-model="textarea"
        :rows="2"
        type="textarea"
        placeholder="请输入评论内容"
        :autosize="{ minRows: 8 }"
        style="width: 100%; margin-bottom: 10px"
      />

      <div class="comment-list" v-for="comment in comments" :key="comment.id">
        <div>
          <div style="margin-bottom: 10px">
            <strong>{{ comment.name }}</strong> 说：
          </div>
          <div style="margin-bottom: 10px; transform: translateX(10px)">
            {{ comment.content }}
          </div>
          <div>{{ comment.create_time }}</div>
        </div>
        <div
          style="
            position: absolute;
            right: 10px;
            bottom: 10px;
            display: flex;
            cursor: pointer;
          "
        >
          <div style="display: flex">
            <img src="../../assets/comment/dian zan.png" alt="" />
            <div
              style="
                transform: translateY(-2px);
                width: 35px;
                text-align: center;
              "
            >
              {{ comment.like_count }}
            </div>
          </div>
          <div style="display: flex">
            <img src="../../assets/comment/hui fu.png" alt="" />
            <div style="transform: translateY(-2px)">回复</div>
          </div>
          <div style="display: flex">
            <img src="../../assets/comment/ju bao.png" alt="" />
            <div style="transform: translateY(-2px)">举报</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from "vue";
import axios from "axios";
import { InterfaceUrl } from "@/api";
import { ElMessage } from "element-plus";
import { Share, Star, Tickets, Warning } from "@element-plus/icons-vue";
import LZString from "lz-string";
import dateFunction from "@/utils/Date";

const comments = [
  {
    id: 1,
    name: "张三",
    content: "这个产品真的很好！",
    create_time: "2024-01-01",
    like_count: 10,
  },
  {
    id: 2,
    name: "李四",
    content: "我非常喜欢这个服务。",
    create_time: "2024-01-01",
    like_count: 15,
  },
  {
    id: 3,
    name: "张三",
    content: "这个产品真的很好！",
    create_time: "2024-01-01",
    like_count: 111,
  },
  {
    id: 4,
    name: "李四",
    content: "我非常喜欢这个服务。",
    create_time: "2024-01-01",
    like_count: 99,
  },
];

const textarea = ref("");

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

interface Blog {
  id: string;
  title: string;
  content: string;
  create_time: string;
  category_id: string;
  coverUrl: string;
}

const blog = ref<Blog>({
  id: "",
  title: "",
  content: "",
  create_time: "",
  category_id: "",
  coverUrl: "",
});

onMounted(() => {
  axios
    .post(InterfaceUrl + "/blog/blogPage?id=" + props.id)
    .then((res) => {
      blog.value = res.data.data;
      blog.value.content = blog.value.content;
      blog.value.create_time = dateFunction(blog.value.create_time);
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
});

const shareRef = ref();

let text: any = ref<string>("");

const doShare = () => {
  const title: string = blog.title;
  const url: string = window.location.href;
  text = `${title}: ${url}`;
  copyToClipboard(text);
};

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => console.log("文本已复制到剪贴板"))
    .catch((error) => console.error("复制失败", error));
};
</script>

<style lang="scss" scoped>
.comment {
  width: 70vw;
  margin: 0 auto;

  .comment-list {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    position: relative;

    img {
      height: 20px;
      width: 20px;
      border-radius: 0;
      margin-right: 35px;
    }
  }
}

.news-intro {
  margin: 20px 100px;
  padding: 20px;
  background-color: rgba(245, 245, 245, 0.6);
  border-radius: 10px;
  transform: translateX(-0.5vw);

  .divider {
    width: 100%;
    height: 1px;
    background-color: #ccc;
    margin: 10px 0;
  }

  img {
    width: 90%;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .news-footer {
    height: 50px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: right;

    a,
    div {
      padding: 5px;
    }

    div {
      margin-left: 10px;
    }

    a:hover,
    div:hover {
      background: white;
      border-radius: 10px;
      cursor: pointer;
      transform: scale(1.1);
      transition: linear 0.2s;
    }

    svg {
      transform: translateY(2px);
    }
  }
}

@media (max-width: 1000px) {
  .news-intro {
    margin: 10px;
    width: 94%;
  }
}
</style>

<style lang="scss">
@media (max-width: 1000px) {
  .news-intro {
    img {
      width: 85vw !important;
    }
  }
}
</style>
