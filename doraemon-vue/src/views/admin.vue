<template>
  <div>
    <el-container>
      <el-aside style="height: 100vh; border-radius: 20px" width="200px">
        <el-row class="tac">
          <el-col :span="24">
            <h4
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
              "
            >
              <router-link to="/">
                <img
                  alt="logo"
                  src="@\assets\icon.png"
                  style="height: 50px; transform: translateY(5px)"
                />
              </router-link>
            </h4>
            <el-menu
              :default-openeds="['/admin/news', '/admin/blogs']"
              default-active="/admin"
            >
              <router-link to="/admin">
                <el-menu-item index="/admin" router="/admin">
                  <el-icon>
                    <House />
                  </el-icon>
                  首页
                </el-menu-item>
              </router-link>

              <router-link to="/admin/users">
                <el-menu-item index="/admin/users">
                  <el-icon>
                    <User />
                  </el-icon>
                  用户管理
                </el-menu-item>
              </router-link>

              <router-link to="/admin/comment">
                <el-menu-item index="/admin/comment">
                  <el-icon><Edit /></el-icon>
                  评论管理
                </el-menu-item>
              </router-link>

              <el-sub-menu index="/admin/blogs">
                <template #title>
                  <el-icon><ChatLineSquare /></el-icon>
                  论坛管理
                </template>

                <router-link to="/admin/blog/categories">
                  <el-menu-item index="1-1"> 文章分类 </el-menu-item>
                </router-link>
                <router-link to="/admin/blog/blogList">
                  <el-menu-item index="1-2"> 文章管理 </el-menu-item>
                </router-link>
              </el-sub-menu>

              <el-sub-menu index="/admin/news">
                <template #title>
                  <el-icon>
                    <Tickets />
                  </el-icon>
                  新闻管理
                </template>

                <router-link to="/admin/news/addNews">
                  <el-menu-item index="2-1"> 发布新闻 </el-menu-item>
                </router-link>
                <router-link to="/admin/news/newsList">
                  <el-menu-item index="2-2"> 新闻列表 </el-menu-item>
                </router-link>
              </el-sub-menu>

              <router-link
                to="/"
                style="width: 200px; position: fixed; bottom: 20px; left: 0"
              >
                <el-menu-item index="/">
                  <el-icon>
                    <RefreshLeft />
                  </el-icon>
                  返回前台
                </el-menu-item>
              </router-link>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>

      <el-main
        style="
          border: 1px solid #ccc;
          background: white;
          border-radius: 20px;
          margin-left: 3px;
        "
      >
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
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
} from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>
a {
  color: black;
}

aside {
  * {
    background: rgb(240, 244, 255);
  }
  background: rgb(240, 244, 255);
}

.el-menu {
  border: 0px;
}

* {
  background: white;
}
</style>
