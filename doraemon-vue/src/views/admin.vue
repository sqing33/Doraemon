<template>
  <div>
    <el-container>
      <el-aside
          style="height: 100vh; border: 1px solid #ccc; background-color: white"
          width="200px"
      >
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
              <img alt="logo" src="@\assets\icon.png" style="height: 50px"/>
            </h4>
            <el-menu
                :default-openeds="['/admin/news']"
                class="el-menu-vertical-demo"
                default-active="1"
            >
              <el-menu-item index="1" route="/admin">
                <el-icon>
                  <House/>
                </el-icon>
                <router-link to="/admin">首页</router-link>
              </el-menu-item>

              <el-menu-item index="/admin/pet">
                <el-icon>
                  <Menu/>
                </el-icon>
                <router-link to="/admin/pet">宠物信息</router-link>
              </el-menu-item>

              <el-menu-item index="/admin/user">
                <el-icon>
                  <User/>
                </el-icon>
                <router-link to="/admin/user">用户信息</router-link>
              </el-menu-item>

              <el-sub-menu index="/admin/news">
                <template #title>
                  <el-icon>
                    <Tickets/>
                  </el-icon>
                  新闻管理
                </template>
                <el-menu-item index="1-1">
                  <router-link to="/admin/addNews">发布新闻</router-link>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <router-link to="/admin/newsList">新闻列表</router-link>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/admin/adoption">
                <el-icon>
                  <Connection/>
                </el-icon>
                <router-link to="/admin/adoption">领养情况</router-link>
              </el-menu-item>

              <el-menu-item index="5">
                <el-icon>
                  <RefreshLeft/>
                </el-icon>
                <router-link to="/">返回前台</router-link>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {Connection, House, Menu, RefreshLeft, Tickets, User,} from "@element-plus/icons-vue";
</script>

<style scoped>
a {
  color: black;
}

* {
  background: white;
}
</style>
