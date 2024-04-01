<template>
  <div class="homelist">
    <div :style="{height: `${windowHeight -17}px`}" class="tailer">
      <div :style="{height: `${windowHeight * 0.9}px`}" class="left">
        <div id="characters">
          <button v-for="character in characters" :key="character.name" class="character"
                  @click="selectCharacter(character.name)">
            {{ character.name }}
          </button>
        </div>
      </div>
      <div class="right">
        <div id="introduce">
          <div id="title">人物介绍</div>
          <img :src="currentCharacter.img" alt="人物图片">
          <ul>
            <li v-for="info in characterInfo" :key="info.label">
              <span>{{ info.label }}：</span><span style="font-family: 'jam font', serif" v-html="formatValue(info.value)"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {CharactIntro} from './CharactIntro.js';

const windowHeight = ref(0)

onMounted(() => {
  const updateWindowSize = () => {
    windowHeight.value = window.innerHeight - 17
  }
  // 初始化窗口尺寸
  updateWindowSize()
  // 监听窗口尺寸变化
  window.addEventListener('resize', updateWindowSize)
})

const characters = Object.values(CharactIntro);
const selectedCharacter = ref(characters[0].name);

// 根据选中的角色名称获取当前角色
const currentCharacter = computed(() => {
  return characters.find(character => character.name === selectedCharacter.value) || {};
});

// 选择角色
const selectCharacter = (name) => {
  selectedCharacter.value = name;
};

//将字符串中的\n替换为<br>标签,通过v-html使<br>生效
const formatValue = (value) => {
  return value.replace(/\n/g, '<br>');
};

const characterInfo = computed(() => {
  const character = currentCharacter.value;
  const info = [
    {label: '本名', value: character.realname},
    {label: '生日', value: character.birthday},
    {label: '星座', value: character.constellation},
    {label: '身高', value: character.height},
    {label: '体重', value: character.weight},
    {label: '特点', value: character.nature},
    {label: '喜欢', value: character.favorite},
    {label: '讨厌', value: character.fear},
    {label: '梦想', value: character.dream},
    {label: '未来', value: character.future},
    {
      label: '其他',
      value: character.other1 + '\n'
          + character.other2 + '\n'
          + character.other3 + '\n'
          + character.other4 + '\n'
          + character.other5
    }
  ]
  return info.filter(info => info.value !== '');
})

console.log(characterInfo)

</script>

<style lang="scss" scoped>
.tailer {
  position: fixed;
  width: 100%;
  top: 34px;
  height: 100%;
  display: flex;
  align-items: center;

  .left {
    position: relative;
    height: 500px;
    width: 150px;
    margin: 25px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;

    #characters {
      height: 100%;
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      text-align: center;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .character {
        display: inline-block;
        margin: 10px;
        padding: 10px;
        background-color: rgb(87, 185, 234);
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        color: black;
        transition: 0.5s;

        &:hover {
          background-color: rgb(27, 160, 225);
        }
      }
    }
  }

  .right {
    width: 100%;
    height: 100%;

    #introduce {
      width: 95%;
      height: 90%;
      transform: translate(0%, 2.5%);
      background-color: rgba(255, 255, 255, 0.8);
      padding: 20px;

      #title {
        font-size: 45px;
        text-align: center;
        padding-bottom: 15px;
      }

      img {
        position: absolute;
        right: 5%;
        height: 600px;
      }

      ul {
        position: relative;
        top: 5%;
        left: 5%;
      }

      li {
        list-style-type: none;
        margin-bottom: 10px;

        span {
          color: rgb(27, 160, 225);
          font-size: 22px;
          display: inline-block;
          vertical-align: top;

          &:first-child {
            width: 85px;
            font-weight: bold;
            color: rgb(27, 160, 225);
          }
        }
      }
    }
  }
}
</style>
