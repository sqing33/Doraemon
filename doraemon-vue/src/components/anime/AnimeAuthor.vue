<template>
  <div class="anime-author">
    <!-- 哆啦A梦使用原有的作者介绍样式 -->
    <template v-if="animeId === 'doraemon'">
      <AuthorIntro />
    </template>

    <!-- 其他动漫使用新的卡片布局 -->
    <template v-else>
      <div class="author-card">
        <div class="author-header">
          <div class="author-avatar">
            <img :src="authorConfig.avatar" :alt="authorConfig.name" />
          </div>
          <div class="author-info">
            <h2>{{ authorConfig.name }}</h2>
            <p>{{ authorConfig.title }}</p>
          </div>
        </div>

        <div class="author-bio">
          <div class="bio-section" v-html="authorConfig.bio"></div>
        </div>

        <div class="author-links" v-if="authorConfig.links && authorConfig.links.length">
          <h3>了解更多</h3>
          <div class="link-list">
            <a
              v-for="(link, index) in authorConfig.links"
              :key="index"
              :href="link.url"
              target="_blank"
              class="link-item"
            >
              <el-icon><Link /></el-icon>
              {{ link.name }}
            </a>
          </div>
        </div>

        <div class="author-gallery" v-if="authorConfig.gallery && authorConfig.gallery.length">
          <h3>作品展示</h3>
          <div class="gallery-grid">
            <img
              v-for="(img, index) in authorConfig.gallery"
              :key="index"
              :src="img"
              alt=""
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Link } from '@element-plus/icons-vue';
import animeConfig from '@/config/animeConfig';
import AuthorIntro from '@/components/AuthorIntro.vue';

const props = defineProps<{
  animeId: string;
  animeConfig: any;
}>();

const authorConfig = computed(() => {
  if (!props.animeConfig || !props.animeConfig.author) {
    return {
      name: '暂无信息',
      title: '',
      avatar: '',
      bio: '暂无作者信息',
      links: [],
      gallery: []
    };
  }
  return props.animeConfig.author;
});
</script>

<style lang="scss" scoped>
.anime-author {
  min-height: 600px;
}

.author-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.author-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: center;

  &__avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #2f76d2;
    box-shadow: 0 8px 24px rgba(47, 118, 210, 0.3);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;

    h2 {
      margin: 0 0 12px;
      font-size: 2rem;
      color: #1b2430;
    }

    p {
      margin: 0;
      color: #5e6b7a;
      font-size: 1.1rem;
    }
  }
}

.author-bio {
  margin-bottom: 40px;

  .bio-section {
    line-height: 1.8;
    color: #1b2430;
    font-size: 1.05rem;

    :deep(p) {
      margin: 0 0 16px;
    }
  }
}

.author-links {
  margin-bottom: 40px;

  h3 {
    margin: 0 0 20px;
    font-size: 1.5rem;
    color: #1b2430;
  }

  .link-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .link-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #f5f7fa;
    border-radius: 12px;
    color: #2f76d2;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: #2f76d2;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(47, 118, 210, 0.3);
    }
  }
}

.author-gallery {
  h3 {
    margin: 0 0 20px;
    font-size: 1.5rem;
    color: #1b2430;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 12px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .author-card {
    padding: 24px;
  }

  .author-header {
    flex-direction: column;
    text-align: center;

    &__avatar {
      width: 120px;
      height: 120px;
    }
  }

  .author-gallery .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>