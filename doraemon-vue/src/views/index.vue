<template>
  <div class="conta">
    <el-container>
      <el-main
        :class="{
          'home-page': HomePage,
          'other-page': OtherPage,
          'admin-page': AdminPage,
        }"
        style=""
      >
        <el-scrollbar
          @scroll="scroll"
          :class="['main-scroll', { 'login-page': LoginPage }]"
        >
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();

const route = useRoute();

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

const LoginPage = ref(false);

watch(route, (to) => {
  Admin.value = to.path.startsWith("/admin");
  if (window.innerWidth >= 1024) {
    HomePage.value = to.path === "/" || to.path === "/author";
  }
  OtherPage.value =
    to.path !== "/" && to.path !== "/admin_login" && to.path !== "/admin";
  AdminPage.value = to.path.startsWith("/admin") || to.path === "/admin_login";
  AuthorPage.value = to.path === "/author";
  CharacterPage.value = to.path === "/character";
  LoginPage.value = to.path === "/login";
});

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

.main-scroll {
  height: 100vh;
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

.head {
  background: transparent !important;
  border-bottom: none !important;
}

:deep(.el-menu--horizontal) {
  border-bottom: none !important;
}

.head :deep(.el-menu-item) {
  position: relative;
  display: flex;
  align-items: center;
  height: 26px;
  margin: 7px 10px 7px 0;
  padding: 0 6px;
  left: 0;
  overflow: hidden;
  background: transparent !important;
  border-bottom: none !important;
  border-radius: 0 !important;
  color: inherit;
  transition: left 0.3s ease-out, color 0.3s ease-out;
}

.head :deep(.el-menu-item)::before,
.head :deep(.el-menu-item)::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: 0;
  left: 100%;
  background-color: var(--nav-accent, #00b7ff);
  transition: 0.3s ease-out;
}

.head :deep(.el-menu-item)::after {
  transition: 0.4s ease-out 0.2s;
}

.head :deep(.el-menu-item:hover) {
  left: 10px;
  color: var(--nav-accent, #00b7ff);
}

.head :deep(.el-menu-item:hover)::before {
  left: -100%;
}

.head :deep(.el-menu-item:hover)::after {
  left: 0%;
}

.head :deep(.el-menu-item.is-active) {
  color: var(--nav-accent, #00b7ff);
}

.head :deep(.el-menu-item.is-active)::before {
  left: -100%;
}

.head :deep(.el-menu-item.is-active)::after {
  left: 0%;
}

.head :deep(.el-menu-item > a) {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.head :deep(.el-menu-item .el-icon) {
  color: inherit;
}

.head :deep(.el-menu-item:first-child) {
  height: 40px;
  margin: 0 14px 0 0;
  padding: 0;
  overflow: visible;
  transition: none;
}

.head :deep(.el-menu-item:first-child)::before,
.head :deep(.el-menu-item:first-child)::after {
  display: none;
}

.head :deep(.el-menu-item:first-child:hover) {
  left: 0;
  color: inherit;
}

.character-page {
  --el-menu-bg-color: rgb(243, 241, 236) !important;
}

.login-page {
  :deep(.el-scrollbar__wrap) {
    overflow: hidden;
  }
}
</style>
