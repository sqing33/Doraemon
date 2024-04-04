<template>
  <el-row :gutter="10">
    <el-col :span="24" class="head"></el-col>
    <el-col :sm="4" class="content hidden-sm-and-down"></el-col>
    <el-col :sm="4" :xs="7" class="content">
      <el-menu class="content" default-active="我的资料" @select="menuSelect">
        <h4
          style="
            height: 60px;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          个人信息
        </h4>
        <el-menu-item index="我的资料">我的资料</el-menu-item>
        <el-menu-item index="账号设置">账号设置</el-menu-item>
        <el-menu-item index="我的收藏">我的收藏</el-menu-item>
        <el-menu-item index="建议意见">建议意见</el-menu-item>
      </el-menu>
    </el-col>
    <el-col
      :sm="12"
      :xs="17"
      class="content"
      style="
        background-image: linear-gradient(
          120deg,
          rgba(161, 196, 253, 0.8) 0%,
          rgba(194, 233, 251, 0.8) 100%
        );
      "
    >
      <div class="contentInfo" v-if="menuIndex == '我的资料'">
        <div style="padding: 35px 0">
          <span>头像:</span>
          <img :src="userInfo.avatar" alt="" height="100px" />
        </div>
        <div><span>昵称:</span> {{ userInfo.nickname }}</div>
        <div><span>用户名:</span> {{ userInfo.username }}</div>
        <div><span>性别:</span> {{ userInfo.gender }}</div>
        <div><span>生日:</span> {{ timeConvert(userInfo.birthday) }}</div>
      </div>

      <div class="contentInfo" v-if="menuIndex == '账号设置'">
        <div><span>手机号:</span> {{ userInfo.phone }}</div>
        <div><span>邮箱:</span> {{ userInfo.email }}</div>
        <div>
          <span>密码:</span>
          ******
          <el-button
            type="text"
            style="padding-left: 10vw"
            @click="changePassword"
          >
            修改密码
          </el-button>
        </div>
      </div>
      <div class="contentInfo" v-if="menuIndex == '我的收藏'">我的收藏</div>
      <div class="contentInfo" v-if="menuIndex == '建议意见'">建议意见</div>
    </el-col>
    <el-col :sm="4" class="content hidden-sm-and-down"></el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

const menuIndex = ref("我的资料");

const menuSelect = (index: string) => {
  menuIndex.value = index;
};

const store = useStore();

const userInfo = store.getters.getUserInfo;

// 转换时间格式
const timeConvert = (time) => {
  const date = new Date(time);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const cstDateTime = `${year}年${month}月${day}日`;
  return cstDateTime;
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
}

.head {
  height: 10vh;
  padding: 0;

  @media (max-width: 768px) {
    height: 5vh;
  }
}

.content {
  height: 70vh;
  border-radius: 10px;
}

.contentInfo {
  width: 80%;
  position: relative;
  top: 50%;
  transform: translate(10vw, -50%);

  div {
    margin: 0;
    padding: 25px 0;

    span {
      display: inline-block;
      width: 60px;
    }
  }
}

li {
  padding: 0;
  display: flex;
  justify-content: center;
  --el-menu-level: none;
}
</style>
