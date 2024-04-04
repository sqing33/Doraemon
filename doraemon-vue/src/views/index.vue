<template>
  <div class="conta">
    <el-container>
      <el-header
        v-if="!Admin"
        style="
          --el-menu-bg-color: transparent;
          --el-header-padding: 0;
          border-bottom: 1px solid #eee;
        "
        height="40px"
      >
        <div style="display: flex; justify-content: space-between">
          <div class="nav" style="flex: 1; height: 40px">
            <el-menu mode="horizontal" style="height: 40px" :ellipsis="false">
              <el-menu-item>
                <router-link style="display: flex" to="/">
                  <img
                    alt="logo"
                    src="../../public/icon.png"
                    style="height: 30px; transform: translateY(13px)"
                  />
                  <div
                    class="logo"
                    style="
                      font-size: 20px;
                      font-family: Biscuit-body, serif;
                      padding-left: 5px;
                    "
                  >
                    哆啦A梦世界
                  </div>
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/author">
                  <el-icon>
                    <EditPen />
                  </el-icon>
                  作者团队
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/character">
                  <el-icon>
                    <User />
                  </el-icon>
                  动漫人物介绍
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/character">
                  <el-icon>
                    <Film />
                  </el-icon>
                  剧场史
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/interaction">
                  <el-icon>
                    <Connection />
                  </el-icon>
                  用户互动
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/media">
                  <el-icon>
                    <VideoPlay />
                  </el-icon>
                  音乐视频
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/news">
                  <el-icon>
                    <Tickets />
                  </el-icon>
                  新闻活动
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/website">
                  <el-icon>
                    <Link />
                  </el-icon>
                  相关网站
                </router-link>
              </el-menu-item>
            </el-menu>
          </div>
          <div class="user">
            <el-menu :ellipsis="false" mode="horizontal" style="height: 40px">
              <el-menu-item>
                <el-dropdown>
                  <span class="el-dropdown-link" style="outline: none">
                    <el-icon><Avatar /></el-icon>
                    {{ username }}
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <router-link to="/login">
                        <el-dropdown-item>登录/注册</el-dropdown-item>
                      </router-link>
                      <el-dropdown-item @click="userInfo">
                        用户信息
                      </el-dropdown-item>
                      <router-link to="/adminLogin">
                        <el-dropdown-item divided>管理员登录</el-dropdown-item>
                      </router-link>
                      <router-link to="">
                        <el-dropdown-item divided>退出登录</el-dropdown-item>
                      </router-link>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-header>

      <el-main
        :class="{
          'home-page': HomePage,
          'other-page': OtherPage,
          'admin-page': AdminPage,
        }"
      >
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  ArrowDown,
  Avatar,
  Connection,
  EditPen,
  Film,
  Link,
  Tickets,
  User,
  VideoPlay,
} from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { InterfaceUrl } from "@/api";
import { useStore } from "vuex";

const store = useStore();

const username = "用户中心";

const route = useRoute();
const router = useRouter();

// 管理员页面导航栏
const Admin = ref(false);
// 首页height属性
const HomePage = ref(false);
// 其他页面height属性
const OtherPage = ref(false);
// 管理员页面height属性
const AdminPage = ref(false);

watch(route, (to) => {
  Admin.value = to.path.startsWith("/admin");
  HomePage.value = to.path === "/" || to.path === "/author";
  OtherPage.value =
    to.path !== "/" || to.path !== "/admin_login" || to.path !== "/admin";
  AdminPage.value = to.path.startsWith("/admin") || to.path === "/admin_login";
});

const userInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios
      .post(InterfaceUrl + "/user/info", null, {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.data.state === 0) {
          store.dispatch("setUserInfoFromAxios", res.data.data);
          router.push("/userInfo");
        } else if (res.data.state === 2) {
          ElMessage.error("登录超时，请重新登录");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
.conta {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  z-index: 99999;
}

li {
  padding: 0 10px;
}

@font-face {
  font-family: "Biscuit-body";
  src: url("@/assets/ttf/Biscuit body.ttf");
}

:deep(.other-page) {
  height: 0;
}

:deep(.home-page) {
  height: 100%;
}

:deep(.admin-page) {
  height: 100vh;
}
</style>
