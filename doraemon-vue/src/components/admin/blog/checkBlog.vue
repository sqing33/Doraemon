<template>
  <el-descriptions column>
    <el-descriptions-item label="标题">{{ form.title }}</el-descriptions-item>
    <el-descriptions-item label="ID">{{ form.id }}</el-descriptions-item>
    <el-descriptions-item label="封面">
      <img :src="form.coverUrl" alt="" width="100" />
    </el-descriptions-item>
    <el-descriptions-item label="内容">
      <div
        class="check-blog-content"
        style="background: #dcdcdc; padding: 10px"
        v-html="form.content"
      ></div>
    </el-descriptions-item>
    <el-descriptions-item label="类型">
      <el-tag size="large" style="font-size: 14px">
        {{ form.category }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="发布者ID">
      {{ form.user_id }}
    </el-descriptions-item>
    <el-descriptions-item label="发布时间">
      {{ dateFunction(form.create_time) }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import dateFunction from "@/utils/Date";
import { useStore } from "vuex";
import LZString from "lz-string";

const store = useStore();

const form = reactive(store.getters.getCheck);
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.check-blog-content {
  img {
    max-width: 50%;
  }
}
</style>
