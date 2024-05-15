<template>
  <div class="content">
    <span>{{ content }}</span>
  </div>
</template>

<script setup>

import {ref} from "vue";

const contents =
    '设计模式（Design pattern）代表了最佳的实践，设计模式是一套被反复使用的、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了重用代码、让代码更容易被他人理解、保证代码可靠性。这些解决方案是众多软件开发人员经过相当长的一段时间的试验和错误总结出来的。'

const content = ref('');

let index = 0;

setInterval(() => {
  if (index < contents.length) {
    content.value += contents[index];
    index++;
  }
}, 100)

</script>

<style lang="scss" scoped>


</style>
