<template>
  <el-container>
    <el-aside
      style="height: 100vh; border-radius: 20px; border: 1px solid #ccc"
      width="200px"
    >
      <el-menu
        :default-openeds="['/admin/news', '/admin/blogs']"
        default-active="/admin"
        router
      >
        <el-menu-item
          index="/"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: transparent;
          "
        >
          <img
            alt="logo"
            src="@\assets\icon.png"
            style="height: 50px; transform: translateY(5px)"
          />
        </el-menu-item>

        <el-menu-item index="/admin">
          <el-icon>
            <House />
          </el-icon>
          首页
        </el-menu-item>

        <el-menu-item index="/admin/users">
          <el-icon>
            <User />
          </el-icon>
          用户管理
        </el-menu-item>

        <el-sub-menu index="/admin/blogs">
          <template #title>
            <el-icon><ChatLineSquare /></el-icon>
            论坛管理
          </template>
          <el-menu-item index="/admin/blog/categories"> 帖子分类 </el-menu-item>
          <el-menu-item index="/admin/blog/blogList"> 帖子管理 </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/admin/news">
          <template #title>
            <el-icon>
              <Tickets />
            </el-icon>
            新闻管理
          </template>
          <el-menu-item index="/admin/news/addNews"> 发布新闻 </el-menu-item>
          <el-menu-item index="/admin/news/newsList"> 新闻列表 </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/chart">
          <el-icon><PieChart /></el-icon>
          数据统计
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header
        style="
          border: 1px solid #ccc;
          background: white;
          border-radius: 20px;
          margin-left: 3px;
        "
      >
        <el-row>
          <el-col :span="12">
            <el-breadcrumb
              style="
                height: 58px;
                display: flex;
                align-items: center;
                font-size: 1em;
              "
              :separator-icon="ArrowRight"
            >
              <el-breadcrumb-item :to="{ path: '/admin' }">
                首页
              </el-breadcrumb-item>
              <el-breadcrumb-item
                v-for="(item, index) in getBreadcrumbs"
                :key="index"
              >
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>

          <el-col :span="12">
            <div
              style="
                height: 58px;
                display: flex;
                align-items: center;
                font-size: 1em;
                position: absolute;
                right: 0;
              "
            >
              <div style="margin-right: 10px">{{ date }}</div>

              <router-link to="/" class="back">
                <el-icon>
                  <RefreshLeft />
                </el-icon>
                返回前台
              </router-link>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-main
        style="
          border: 1px solid #ccc;
          background: white;
          border-radius: 20px;
          margin-left: 3px;
          margin-top: 3px;
        "
      >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {
  Connection,
  House,
  Menu,
  Edit,
  RefreshLeft,
  ChatLineSquare,
  Tickets,
  User,
  PieChart,
} from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import dateFunction from "@/utils/Date";

const route = useRoute();

const getBreadcrumbs = computed(() => {
  // 获取当前路由的所有匹配记录
  const matched = route.matched;
  // 过滤出包含meta.title的路由记录
  const metaTitles = matched.filter((item) => item.meta && item.meta.title);
  // 返回处理后的路由记录
  return metaTitles.map((item) => ({
    path: item.path,
    meta: { title: item.meta.title },
  }));
});

const date = ref("");

const updateTime = () => {
  date.value = dateFunction();
};

setInterval(updateTime, 1000);
</script>

<style lang="scss" scoped>
a {
  color: black;
}

/* aside {
  * {
    background: rgb(240, 244, 255);
  }
  background: rgb(240, 244, 255);
} */

.el-menu {
  border: 0px;
}

* {
  background: white;
}

.back {
  width: 150px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;

  svg {
    transform: translateX(-10px);
  }

  &:hover {
    background: rgb(236, 245, 255, 0.8);
    cursor: pointer;

    svg {
      background: rgb(236, 245, 255, 0.8);
    }
  }
}
</style>
