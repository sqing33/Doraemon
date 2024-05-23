<template>123</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import _axios from "@/api";

_axios
  .post("/news", {
    params: {
      page: 1,
      pageSize: null,
      category,
      keyword,
      length: 99,
    },
  })
  .then((res) => {
    news.value = res.data.data.map((item: any) => {
      item.content = item.content;
      item.create_time = dateFunction(item.create_time);
      return item;
    });
  });
</script>

<style lang="scss" scoped></style>
