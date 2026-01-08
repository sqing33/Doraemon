<template>
  <div class="blog-sidebar">
    <UserAccount :showCta="showCta" :ctaText="ctaText" />
    <LatestPosts />
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import UserAccount from "./UserAccount.vue";
import LatestPosts from "./LatestPosts.vue";

const props = withDefaults(
  defineProps<{
    showCta?: boolean;
    ctaText?: string;
  }>(),
  {
    showCta: true,
    ctaText: "把灵感放进时光胶囊，分享给更多人。",
  }
);

const emit = defineEmits<{}>();
</script>

<style lang="scss" scoped>
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
