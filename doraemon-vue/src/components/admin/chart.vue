<template>
  <el-row :gutter="20" style="margin: 20px">
    <el-col :span="12">
      <el-card class="chart-container">
        <div id="user" style="width: 100%; height: 35vh;">
          <div>当前用户人数：{{ 10000 }}</div>
          <div>今日新增人数：{{ 100 }}</div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card class="chart-container">
        <div id="blog" style="width: 100%; height: 35vh;"></div>
      </el-card>
    </el-col>

    <el-col :span="12" style="margin-top: 3vh">
      <el-card class="chart-container">
        <div id="1234" style="width: 100%; height: 35vh;"></div>
      </el-card>
    </el-col>

    <el-col :span="12" style="margin-top: 3vh">
      <el-card class="chart-container">
        <div id="12345" style="width: 100%; height: 35vh;"></div>
      </el-card>
    </el-col>

  </el-row>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import {onMounted, reactive} from "vue";
import dateFunction from "@/utils/Date";
import axios from "axios";
import {ElMessage} from "element-plus";
import {InterfaceUrl} from "@/api";

interface Category {
  id: number;
  name: string;
  state: string;
  value: number;
}

let categories: Category = reactive({
  id: 0,
  name: '',
  state: '',
  value: 0
});

console.log();

onMounted(() => {
  axios
      .get(InterfaceUrl + '/admin/blog/categories')
      .then(res => {
        categories = res.data.data;

        axios
            .get(InterfaceUrl + '/admin/blog/categories/count')
            .then(res => {

              categories = categories.map((category: Category) => {
                const count = res.data.data.find((c: any) => c.category_id === category.id)?.count || 0;
                return {
                  id: category.id,
                  name: category.name,
                  state: category.state,
                  value: count
                };
              });

              blogChart();
            })
            .catch(err => {
              console.log(err);
              ElMessage.error('请求失败，请联系管理员');
            })
      })
      .catch(err => {
        console.log(err);
        ElMessage.error('请求失败，请联系管理员');
      })


})

const blogChart = () => {
  const chartDom = document.getElementById('blog');
  const myChart = echarts.init(chartDom);
  // 饼图
  /*let option = {
    title: {
      text: '发帖类型统计',
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
        data: categories,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };*/

  // 柱状图
  const option = {
    title: {
      text: '发帖类型统计',
      subtext: '截至 ' + dateFunction(null, 'date'),
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: categories.map((category: Category) => category.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: categories.map((category: Category) => category.value),
        type: 'bar'
      }
    ]
  };

  myChart.setOption(option);
}


</script>

<style lang="scss" scoped>

</style>