<template>
  <el-row :gutter="20" style="margin: 20px">
    <el-col :span="12">
      <el-card class="chart-container">
        <div id="userRegister" style="width: 100%; height: 40vh"></div>
        <div id="userAge" style="width: 100%; height: 40vh"></div>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card class="chart-container">
        <div id="blog" style="width: 100%; height: 35vh"></div>
      </el-card>
      <el-card class="chart-container" style="margin-top: 5vh">
        <div id="1234" style="width: 100%; height: 35vh"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import dateFunction from "@/utils/Date";
import axios from "axios";
import { ElMessage } from "element-plus";
import { InterfaceUrl } from "@/api";

interface User {
  id: number;
  name: string;
  value: number;
}

let userRegister: User[] = reactive([
  {
    id: 0,
    name: "",
    value: 0,
  },
]);

const userAge = reactive([
  {
    id: 1,
    name: "0-17岁",
    value: 0,
  },
  {
    id: 2,
    name: "18-31岁",
    value: 0,
  },
  {
    id: 3,
    name: "32-45岁",
    value: 0,
  },
  {
    id: 4,
    name: "46-59岁",
    value: 0,
  },
  {
    id: 5,
    name: "60岁以上",
    value: 0,
  },
]);

const ageRanges = {
  "0-17岁": 0,
  "18-31岁": 0,
  "32-45岁": 0,
  "46-59岁": 0,
  "60岁以上": 0,
};

onMounted(() => {
  axios
    .get(InterfaceUrl + "/admin/users")
    .then((response) => {
      const data = response.data.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let todayRegistrations = 0;
      let yesterdayRegistrations = 0;
      let beforeYesterdayRegistrations = 0;

      data.forEach((item) => {
        const birthDate = new Date(item.birthday);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        const registrationDate = new Date(item.create_time);

        const registrationYear = registrationDate.getFullYear();
        const registrationMonth = registrationDate.getMonth();
        const registrationDay = registrationDate.getDate();

        if (
          registrationYear === today.getFullYear() &&
          registrationMonth === today.getMonth() &&
          registrationDay === today.getDate()
        ) {
          todayRegistrations++;
        } else if (
          registrationYear === yesterday.getFullYear() &&
          registrationMonth === yesterday.getMonth() &&
          registrationDay === yesterday.getDate()
        ) {
          yesterdayRegistrations++;
        } else {
          beforeYesterdayRegistrations++;
        }

        if (age >= 0 && age < 18) {
          ageRanges["0-17岁"]++;
        } else if (age >= 18 && age < 32) {
          ageRanges["18-31岁"]++;
        } else if (age >= 32 && age < 46) {
          ageRanges["32-45岁"]++;
        } else if (age >= 46 && age < 60) {
          ageRanges["46-59岁"]++;
        } else {
          ageRanges["60岁以上"]++;
        }
      });

      userAge.forEach((ageObj) => {
        if (ageRanges.hasOwnProperty(ageObj.name)) {
          ageObj.value = ageRanges[ageObj.name];
        }
      });

      userRegister = [
        {
          id: 1,
          name: `今日新增用户 (${todayRegistrations})`,
          value: todayRegistrations,
        },
        {
          id: 2,
          name: `昨日新增用户 (${yesterdayRegistrations})`,
          value: yesterdayRegistrations,
        },
        {
          id: 3,
          name: `历史用户 (${beforeYesterdayRegistrations})`,
          value: beforeYesterdayRegistrations,
        },
      ];

      userRegisterChart();
      userAgeChart();
    })
    .catch((error) => {
      ElMessage.error("请求失败，请联系管理员。");
    });
});

const userRegisterChart = () => {
  const chartDom = document.getElementById("userRegister");
  const chart = echarts.init(chartDom);

  const option = {
    title: {
      text: "用户人数",
      subtext: "截至 " + dateFunction(null, "date"),
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "center",
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "用户注册统计",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        labelLine: {
          show: false,
        },
        data: userRegister,
      },
    ],
  };

  chart.setOption(option);
};

const userAgeChart = () => {
  const chartDom = document.getElementById("userAge");
  const chart = echarts.init(chartDom);

  const option = {
    title: {
      text: "用户年龄分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      top: "center",
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "用户年龄分布",
        type: "pie",
        radius: ["20%", "70%"],
        center: ["50%", "50%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data: userAge,
      },
    ],
  };

  chart.setOption(option);
};

onMounted(() => {
  blogChart();
});

const blogChart = () => {
  const chartDom = document.getElementById("blog");
  const chart = echarts.init(chartDom);

  const option = {
    title: {
      text: "发帖类型统计",
      subtext: "截至 " + dateFunction(null, "date"),
      left: "center",
    },
    xAxis: {
      type: "category",
      data: ["文章", "视频", "音乐", "相册", "其他"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [1, 2, 3, 4, 5],
        type: "bar",
      },
    ],
  };

  chart.setOption(option);
};
</script>

<style lang="scss" scoped></style>
