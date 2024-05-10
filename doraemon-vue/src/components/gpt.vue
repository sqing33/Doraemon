<template>

  <div style="height: 90vh;width: 96vw;margin:2vh 2vw 0 2vw;display:flex;text-align:center;background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);;border-radius:10px;">
    <div style="width:300px;background: rgba(255,255,255,0.8);border-radius:20px">
      <h2>历史记录</h2>
      <div style="margin-top: 30px;height:75vh;">
        <div v-for="item in history" :key="item.id">
          <div class="history-item">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <div id="asd" style="flex:1;margin-left:10px;display: flex;  flex-direction: column;">
      <div style="height: 80%;flex:1;border-radius:20px;margin:20px;text-align:left">
        <el-scrollbar>
          <div v-for="item in answer" :key="item.id" style="margin-bottom: 30px;">
            <div style="display: flex;background:#fff;padding:20px;border-radius:10px;">
              <el-icon :size="50">
                <Avatar/>
              </el-icon>
              <div style="display: flex;align-items: center;margin-left: 10px;">
                {{ item.problem }}
              </div>
            </div>

            <div style="display: flex;background:#fff;padding:20px;border-radius:10px;margin-top:10px">
              <img alt="" src="@/assets/avatar.png" style="width: 50px">
              <div style="display: flex;align-items: center;margin-left: 10px;">
                {{ item.content }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div style="height: 80px;">
        <el-input v-model="problem" maxlength="50" placeholder="请输入想问哆啦A梦的问题！" show-word-limit size="large" style="width: 80%;margin: 10px auto"></el-input>
        <el-button plain size="large" style="border-radius: 5px 10px 10px 5px" @click="sendProblem">发送</el-button>
      </div>
    </div>
  </div>


</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {Avatar} from "@element-plus/icons-vue";
import axios from "axios";


const history = reactive([
  {
    id: 1,
    title: "title1",
    content: "content1"
  },
  {
    id: 2,
    title: "title2",
    content: "content2"
  }
]);

const problem = ref();

const answer = reactive([
  {
    id: 1,
    problem: "问题1",
    content: "玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡玛卡巴卡"
  },
  {
    id: 2,
    problem: "问题2",
    content: "answer2"
  }
]);

// 导入TTSRecorder类
import TTSRecorder from '@/utils/TTSRecorder.js';

// 创建TTSRecorder实例
const ttsRecorder = new TTSRecorder();

// 定义msgStore和msgDom对象
const msgStore = {
  list: [],
  aiAddMsg: function (content, status) {
    this.list.push({content, status});
    console.log(content);
  },
};


const sendProblem = () => {
  console.log(problem.value);

  // 调用start方法
  ttsRecorder.start(msgStore, problem.value);
  /*
    const apiKey = "94ac6e519e199d9404e1f074dda9f20d";

    axios.post("https://api.starfire-model.com/v1/predict", {
          query: problem.value
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`
          }
        }
    ).then(res => {
      console.log(res.data);
      answer.push({
        id: answer.length + 1,
        problem: problem.value,
        content: res.data.answer
      });
      problem.value = "";
    }).catch(err => {
      console.log(err);
    });*/
}
</script>

<style lang="scss" scoped>

.history-item {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
}

:deep(.el-input__wrapper) {
  border-radius: 10px 5px 5px 10px;
}
</style>