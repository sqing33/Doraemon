<template>
  <div class="conta">
    <el-container>
      <el-header
        v-if="!(Admin || HomePage) || AuthorPage"
        :class="{ 'author-page': AuthorPage, 'character-page': CharacterPage }"
        height="40px"
        style="
          width: 100%;
          --el-menu-bg-color: transparent;
          --el-header-padding: 0;
          border-bottom: 1px solid #eee;
        "
      >
        <div style="display: flex; justify-content: space-between">
          <div class="nav" style="flex: 1; height: 40px">
            <el-menu
              :ellipsis="ellipsis"
              class="head"
              mode="horizontal"
              style="height: 40px"
            >
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
                      font-size: 18px;
                      font-family: Haiyanzhishi, serif;
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
                  作者介绍
                </router-link>
              </el-menu-item>
              <el-menu-item>
                <router-link to="/character">
                  <el-icon>
                    <User />
                  </el-icon>
                  动漫人物
                </router-link>
              </el-menu-item>

              <!--      <el-menu-item>
                <router-link to="/character">
                  <el-icon>
                    <Film />
                  </el-icon>
                  剧场史
                </router-link>
              </el-menu-item> -->

              <el-menu-item>
                <router-link to="/blog">
                  <el-icon>
                    <Connection />
                  </el-icon>
                  用户互动
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

              <!--   <el-menu-item>
                <router-link to="/test">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                  test
                </router-link>
              </el-menu-item>-->
            </el-menu>
          </div>
          <div class="user">
            <el-menu :ellipsis="false" mode="horizontal" style="height: 40px">
              <el-menu-item>
                <el-dropdown>
                  <div class="el-dropdown-link" style="outline: none">
                    <div>
                      <div>
                        <img
                          v-if="userInfo.avatarUrl"
                          :src="userInfo.avatarUrl"
                          alt=""
                        />
                        <img v-else alt="" src="../assets/avatar.png" />
                      </div>
                      <div>
                        <span
                          v-if="userInfo.nickname"
                          :class="{ 'author-page': AuthorPage }"
                        >
                          {{ userInfo.nickname }}
                        </span>
                        <span v-else style="color: #000"> 登录/注册 </span>
                      </div>
                    </div>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <router-link
                        v-if="userInfo.isLogining === false"
                        to="/login"
                      >
                        <el-dropdown-item>登录/注册</el-dropdown-item>
                      </router-link>
                      <el-dropdown-item @click="goToUserInfo">
                        用户信息
                      </el-dropdown-item>
                      <router-link to="/myBlogs">
                        <el-dropdown-item divided>我的发帖</el-dropdown-item>
                      </router-link>
                      <router-link to="/feedback">
                        <el-dropdown-item divided>反馈</el-dropdown-item>
                      </router-link>
                      <router-link to="/adminLogin">
                        <el-dropdown-item divided>后台管理</el-dropdown-item>
                      </router-link>
                      <router-link
                        v-if="userInfo.isLogining === true"
                        to=""
                        @click="logout"
                      >
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
        style=""
      >
        <el-scrollbar @scroll="scroll">
          <router-view></router-view>
          <CopyrightIcp v-if="!(Admin || AuthorPage || HomePage)" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import CopyrightIcp from "@/components/copyright-icp.vue";

import {
  Connection,
  EditPen,
  QuestionFilled,
  Tickets,
  User,Link
} from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { InterfaceUrl } from "@/api";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const store = useStore();

const userInfo = reactive({
  nickname: "",
  avatarUrl: "",
  isLogining: false,
});

watchEffect(() => {
  const newUserInfo = store.getters.getUserInfo;
  Object.assign(userInfo, newUserInfo); // 将新用户信息的所有属性复制到 userInfo 中
  if (userInfo.nickname) {
    userInfo.isLogining = true;
  }
});

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
// 作者介绍页面导航栏颜色
const AuthorPage = ref(false);

const CharacterPage = ref(false);

const ellipsis = ref(true);

watch(route, (to) => {
  Admin.value = to.path.startsWith("/admin");
  if (window.innerWidth >= 1024) {
    HomePage.value = to.path === "/" || to.path === "/author";
    ellipsis.value = false;
  }
  OtherPage.value =
    to.path !== "/" || to.path !== "/admin_login" || to.path !== "/admin";
  AdminPage.value = to.path.startsWith("/admin") || to.path === "/admin_login";
  AuthorPage.value = to.path === "/author";
  CharacterPage.value = to.path === "/character";
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("vuex");
  router.go(0);
};

const goToUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios
      .post(InterfaceUrl + "/user/info", null, {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.data.state === 0) {
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

const scroll = ({ scrollTop }) => {
  store.commit("setScroll", scrollTop);
};
</script>

<style lang="scss" scoped>
.conta {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  z-index: 99999;
}

li {
  padding: 0 10px;
}

.el-dropdown-link {
  div {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

@media screen and (max-width: 768px) {
  .head {
    width: 60vw;
  }
}

:deep(.other-page) {
  height: 0;
}

:deep(.home-page) {
  height: 100vh;
}

:deep(.admin-page) {
  height: 100vh;
  background-image: none !important;
}

.author-page {
  --el-menu-bg-color: black !important;
  color: white !important;

  .logo {
    color: white !important;
  }

  .el-menu-item {
    color: white !important;
  }
}

.character-page {
  --el-menu-bg-color: rgb(243, 241, 236) !important;
}
</style>
