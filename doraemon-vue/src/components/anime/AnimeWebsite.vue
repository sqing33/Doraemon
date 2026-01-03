<template>
  <div class="anime-website">
    <el-row :gutter="20">
      <el-col :lg="16" :md="24" :xs="24">
        <div class="website-section" v-if="officialSites.length">
          <h2 class="section-title">官方网站</h2>
          <el-row :gutter="20">
            <el-col
              :sm="12"
              :xs="24"
              v-for="(site, index) in officialSites"
              :key="index"
            >
              <a
                :href="site.url"
                target="_blank"
                class="website-card"
              >
                <img :src="site.image" :alt="site.name" />
                <div class="website-card__content">
                  <h3>{{ site.name }}</h3>
                  <p v-if="site.description">{{ site.description }}</p>
                </div>
              </a>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-col :lg="8" :md="24" :xs="24">
        <div class="video-section" v-if="videoSites.length">
          <h2 class="section-title">视频资源</h2>
          <div class="video-list">
            <a
              v-for="(video, index) in videoSites"
              :key="index"
              :href="video.url"
              target="_blank"
              class="video-card"
            >
              <img :src="video.image" :alt="video.name" />
              <span>{{ video.name }}</span>
            </a>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-empty v-if="!officialSites.length && !videoSites.length" description="暂无网站信息" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import animeConfig from '@/config/animeConfig';

const props = defineProps<{
  animeId: string;
  animeConfig: any;
}>();

const officialSites = computed(() => props.animeConfig.websites?.official || []);
const videoSites = computed(() => props.animeConfig.websites?.video || []);
</script>

<style lang="scss" scoped>
.anime-website {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.section-title {
  margin: 0 0 24px;
  font-size: 1.5rem;
  color: #1b2430;
}

.website-section,
.video-section {
  margin-bottom: 40px;
}

.website-card {
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f7fa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  &__content {
    padding: 16px;

    h3 {
      margin: 0 0 8px;
      font-size: 1.1rem;
      color: #1b2430;
    }

    p {
      margin: 0;
      color: #5e6b7a;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
}

.video-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.video-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;

  &:hover {
    background: #2f76d2;
    color: white;
    transform: scale(1.05);
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-weight: 600;
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .anime-website {
    padding: 24px;
  }

  .video-list {
    grid-template-columns: 1fr;
  }
}
</style>