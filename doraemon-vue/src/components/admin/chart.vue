<template>
  <el-row :gutter="20" style="margin: 20px">
    <el-col :span="12">
      <el-card class="chart-container">
        <div id="blog" style="width: 100%; height: 80vh;"></div>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card class="chart-container">
        <div id="123" style="width: 100%; height: 80vh;"></div>
      </el-card>
    </el-col>

  </el-row>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import {onMounted} from "vue";
import dateFunction from "@/utils/Date";


onMounted(() => {
  const chartDom = document.getElementById('blog');
  const myChart = echarts.init(chartDom);
  let option = {
    title: {
      text: '帖子类型统计',
      subtext: '截至 ' + dateFunction(null, 'date'),
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '帖子类型统计',
        type: 'pie',
        radius: '50%',
        data: [
          {value: 1048, name: 'Search Engine'},
          {value: 735, name: 'Direct'},
          {value: 580, name: 'Email'},
          {value: 484, name: 'Union Ads'},
          {value: 300, name: 'Video Ads'}
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
})

</script>

<style lang="scss" scoped>

</style>