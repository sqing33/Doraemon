<template>
  <div class="anime-character">
    <!-- 哆啦A梦使用原有的动漫人物地图样式 -->
    <template v-if="animeId === 'doraemon'">
      <CharactIntro />
    </template>

    <!-- 其他动漫使用新的卡片列表布局 -->
    <template v-else>
      <div class="character-card">
        <div class="character-grid">
          <div
            v-for="(character, index) in characterList"
            :key="index"
            class="character-item"
          >
            <div class="character-item__image">
              <img :src="character.image" :alt="character.name" />
            </div>
            <div class="character-item__info">
              <h3>{{ character.name }}</h3>
              <p v-if="character.realname" class="realname">
                {{ character.realname }}
              </p>
              <div class="character-details">
                <p v-if="character.birthday">
                  <el-icon><Calendar /></el-icon>
                  生日：{{ character.birthday }}
                </p>
                <p v-if="character.height">
                  <el-icon><Tickets /></el-icon>
                  身高：{{ character.height }}
                </p>
                <p v-if="character.weight">
                  <el-icon><Odometer /></el-icon>
                  体重：{{ character.weight }}
                </p>
              </div>
              <p class="character-nature">{{ character.nature }}</p>
              <div
                class="character-tags"
                v-if="character.favorite || character.fear"
              >
                <el-tag v-if="character.favorite" type="success" size="small">
                  喜欢：{{ character.favorite }}
                </el-tag>
                <el-tag v-if="character.fear" type="danger" size="small">
                  不喜欢：{{ character.fear }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Calendar, Tickets, Odometer } from "@element-plus/icons-vue";
import animeConfig from "@/config/animeConfig";
import CharactIntro from "@/components/CharactIntro.vue";

const props = defineProps<{
  animeId: string;
  animeConfig: any;
}>();

const characterList = computed(() => props.animeConfig.characters || []);
</script>

<style lang="scss" scoped>
.anime-character {
  min-height: 600px;
}

.character-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.character-item {
  background: #f5f7fa;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &__image {
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.1);
    }
  }

  &__info {
    padding: 24px;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 1.5rem;
    color: #1b2430;
  }

  .realname {
    margin: 0 0 16px;
    color: #5e6b7a;
    font-size: 0.95rem;
  }

  .character-details {
    margin-bottom: 16px;
    color: #5e6b7a;

    p {
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
    }
  }

  .character-nature {
    margin: 0 0 16px;
    color: #1b2430;
    line-height: 1.6;
  }

  .character-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media screen and (max-width: 768px) {
  .character-card {
    padding: 24px;
  }

  .character-grid {
    grid-template-columns: 1fr;
  }

  .character-item__image {
    height: 200px;
  }
}
</style>
