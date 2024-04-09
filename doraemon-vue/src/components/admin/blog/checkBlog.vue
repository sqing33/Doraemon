<template>
  <el-descriptions column>
    <el-descriptions-item label="标题">{{ form.title }}</el-descriptions-item>
    <el-descriptions-item label="ID">{{ form.id }}</el-descriptions-item>
    <el-descriptions-item label="封面">
      <img :src="form.coverUrl" alt="" width="100" />
    </el-descriptions-item>
    <el-descriptions-item label="内容">
      <div v-html="content" class="check-blog-content"></div>
    </el-descriptions-item>
    <el-descriptions-item label="类型">
      <el-tag size="large" style="font-size: 14px">
        {{ getCategoryLabel(form.category_id) }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="发布者ID">
      {{ form.publisher_id }}
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

const form = reactive(store.getters.getCheck.form);

const categories = ref(store.getters.getCheck.categories);

const content = ref(LZString.decompressFromBase64(form.content));

const getCategoryLabel = (categoryId: any) => {
  const category = categories.value.find(
    (item: any) => item.value === categoryId
  );
  return category ? category.label : "";
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.check-blog-content {
  img {
    max-width: 50%;
  }
}
</style>
