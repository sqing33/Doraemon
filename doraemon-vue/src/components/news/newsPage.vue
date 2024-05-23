<template>
  <div class="news-intro">
    <h2 style="width: 90%; margin: 0 auto; text-align: center">
      {{ form.data.title }}
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
      <div>{{ form.data.date }}</div>
    </div>

    <div style="margin-top: 40px">
      <div class="divider"></div>
      <div v-html="form.data.content"></div>
    </div>

    <div class="news-footer">
      <router-link style="text-decoration: none; color: black" to="/news">
        <el-icon>
          <Tickets />
        </el-icon>
        返回新闻首页
      </router-link>

      <div ref="shareRef" @click="doShare">
        <el-icon>
          <Share />
        </el-icon>
        分享
      </div>
      <el-popover
        :virtual-ref="shareRef"
        title="已复制链接"
        trigger="click"
        virtual-triggering
        width="300"
      >
        <span> {{ text }} </span>
      </el-popover>
    </div>

    <div class="comment">
      <div
        style="
          border-top: #808080 1px solid;
          width: 116%;
          transform: translateX(-8%);
          margin: 20px 0;
        "
      ></div>
      <div style="display: flex; padding: 20px 0">
        <span style="font-size: 32px">评论</span>
        <div style="padding: 3px 5px; color: #696969; font-size: 20px">
          <div v-if="commentsLength === 0">（还没有评论，快来发表吧~）</div>
          <div v-else>（{{ commentsLength }}）</div>
        </div>
      </div>

      <div style="margin-bottom: 10px; position: relative">
        <RichTextEditor ref="richTextEditor" style="height: 30vh" />

        <el-button
          plain
          style="width: 80px; position: absolute; top: 4.5px; right: 10px"
          type="primary"
          @click="submitComment"
          >发布
        </el-button>
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-list">
        <div class="first-comment">
          <div style="margin-bottom: 10px">
            <img alt="" class="avatar" src="../../assets/avatar.png" />
            <strong>{{ comment.nickname }}</strong> 说：
          </div>
          <div style="margin-bottom: 10px; transform: translate(45px, -5px)">
            <div v-html="comment.content"></div>
          </div>
          <div class="date" style="transform: translateX(45px)">
            {{ dateFunction(comment.create_time) }}
            <div class="comment-operate" style="display: flex; cursor: pointer">
              <div style="display: flex" @click="doLike(comment.id)">
                <img alt="" src="../../assets/comment/dianzan.png" />
                <div
                  style="
                    transform: translateY(-5px);
                    width: 35px;
                    text-align: center;
                  "
                >
                  {{ comment.like }}
                </div>
              </div>
              <div style="display: flex">
                <img alt="" src="../../assets/comment/huifu.png" />
                <div
                  style="transform: translateY(-2px); font-size: 14px"
                  @click="
                    pid = comment.id;
                    pname = comment.nickname;
                    replyCommentDialogVisible = true;
                  "
                >
                  回复
                </div>
              </div>
            </div>
          </div>

          <div
            v-for="childrenComment in comment.children"
            :key="childrenComment.id"
            class="second-comment"
            style="margin-top: 10px; position: relative; left: 50px"
          >
            <div style="margin-bottom: 10px; display: flex">
              <img alt="" class="avatar" src="../../assets/avatar.png" />
              <div class="date" style="padding-top: 10px">
                <strong>{{ childrenComment.nickname }}</strong>
                &nbsp回复&nbsp
                <strong>{{ childrenComment.pname }}</strong>
                &nbsp说：
                <div v-html="childrenComment.content"></div>
              </div>
            </div>
            <div class="date" style="transform: translate(45px, -5px)">
              {{ dateFunction(childrenComment.create_time) }}
              <div
                class="comment-operate"
                style="display: flex; cursor: pointer"
              >
                <div style="display: flex" @click="doLike(childrenComment.id)">
                  <img alt="" src="../../assets/comment/dianzan.png" />
                  <div
                    style="
                      transform: translateY(-2px);
                      width: 35px;
                      text-align: center;
                    "
                  >
                    {{ childrenComment.like }}
                  </div>
                </div>
                <div style="display: flex">
                  <img alt="" src="../../assets/comment/hui fu.png" />
                  <div
                    style="transform: translateY(-2px); font-size: 14px"
                    @click="reply(childrenComment.nickname, comment.id)"
                  >
                    回复
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="replyCommentDialogVisible" title="回复" width="700">
    <RichTextEditor ref="richTextEditor" style="height: 30vh" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="replyCommentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReplyComment"> 回复</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, reactive, ref } from "vue";
import _axios from "@/api";
import { ElMessage } from "element-plus";
import { Share, Tickets } from "@element-plus/icons-vue";
import dateFunction from "@/utils/Date";
import { useStore } from "vuex";
import router from "@/router";
import RichTextEditor from "@/utils/RichTextEditor.vue";

const store = useStore();

const comment = ref();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

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

const comments = ref();

const commentsLength = ref(0);

const getComments = () => {
  _axios.post("/news/getComments?id=" + props.id).then((res) => {
    comments.value = res.data.comments.sort((a: any, b: any) => {
      return new Date(b.create_time) - new Date(a.create_time);
    });
    commentsLength.value = res.data.data.total;
  });
};

onMounted(() => {
  _axios.post("/news/newsPage?id=" + props.id).then((response) => {
    form.data = response.data;
    form.data.date = dateFunction(form.data.date);
  });
  getComments();
});

const shareRef = ref();

let text: any = ref<string>("");

const doShare = () => {
  const title: string = form.data.title;
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

const userInfo = store.getters.getUserInfo;

const richTextEditor = ref();

const submitComment = () => {
  comment.value = store.getters.getRichTextEditor;
  _axios
    .post("/news/postComment", {
      content: comment.value,
      publisher_id: userInfo ? userInfo.id : 0,
      nickname: userInfo.nickname,
      bn_id: props.id,
      category: "news",
    })
    .then((res) => {
      richTextEditor.value.clearEditorContent();
      getComments();
      ElMessage.success("评论成功");
    });
};

const doLike = (comment_id: number) => {
  _axios
    .post("/news/like", {
      comment_id: comment_id,
    })
    .then((res) => {
      getComments();
    });
};

const pid = ref();

const pname = ref();

const reply = (a: string, b: number) => {
  replyCommentDialogVisible.value = true;
  pname.value = a;
  pid.value = b;
};

const replyCommentDialogVisible = ref(false);

const replyComment = ref();

const submitReplyComment = () => {
  replyComment.value = store.getters.getRichTextEditor;
  _axios
    .post(InterfaceUrl + "/news/postComment", {
      content: replyComment.value,
      publisher_id: userInfo ? userInfo.id : 0,
      nickname: userInfo.nickname,
      bn_id: props.id,
      pid: pid.value,
      pname: pname.value,
      category: "news",
    })
    .then((res) => {
      richTextEditor.value.clearEditorContent();
      getComments();
      replyCommentDialogVisible.value = false;
      ElMessage.success("回复成功");
    });
};
</script>

<style lang="scss" scoped>
.comment {
  width: 70vw;
  margin: 0 auto;

  @media screen and (max-width: 1000px) {
    width: 90vw;
  }

  @media screen and (min-width: 700px) {
    .date {
      display: flex;
    }
  }

  .avatar {
    width: 45px !important;
    height: 45px;
    border-radius: 50%;
    margin: 0;
    left: 20px;
  }

  .comment-list {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    position: relative;

    @media screen and (max-width: 1000px) {
      margin-bottom: 40px;
    }

    .comment-operate {
      img {
        height: 15px;
        width: 15px !important;
        border-radius: 0;
        margin-right: 35px;
      }

      @media screen and (max-width: 1000px) {
        margin-top: 10px;
      }
    }
  }
}

.news-intro {
  margin: 20px 100px;
  padding: 20px;
  background-color: rgba(245, 245, 245, 0.6);
  border-radius: 10px;
  transform: translateX(-0.5vw);

  @media screen and (max-width: 1000px) {
    padding: 0;
  }

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

.news-content {
  img {
    max-width: 80% !important;
    max-height: 800px !important;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: block;
    margin: 10px 0;
  }
}

.comment-list {
  img {
    max-height: 300px;
  }
}
</style>
