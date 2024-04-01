<template>
  <div>
    <el-button type="primary" @click="handleClick">验证</el-button>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { InterfaceUrl } from "@/api";

const token = localStorage.getItem("token");

const handleClick = () => {
  console.log("token:", token);
  axios
    .post(
      InterfaceUrl + "/user/info",
      { asd: "123" },
      { headers: { Authorization: token } }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<style lang="scss" scoped></style>
