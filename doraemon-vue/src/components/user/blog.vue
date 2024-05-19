<template>
  <div style="text-align: center; font-size: 40px; height: 100px">我的发帖</div>
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
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";
import { InterfaceUrl } from "@/api";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import dateFunction from "@/utils/Date";

const store = useStore();

const userInfo = store.getters.getUserInfo;

const blog = ref();

onMounted(() => {
  axios
    .post(InterfaceUrl + "/user/getUserBlogList", {
      id: userInfo.id,
    })
    .then((res) => {
      console.log(res.data);
      blog.value = res.data.data.map((item: any) => {
        item.create_time = dateFunction(item.create_time);
        return item;
      });
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("请求失败，请联系管理员。");
    });
});
</script>

<style lang="scss" scoped>
.blog-list {
  width: 80vw;
  min-height: calc(100vh - 200px);
  margin: 0 auto;
}
</style>
