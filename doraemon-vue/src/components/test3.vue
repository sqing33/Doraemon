<template>
  <div>
    <div id="map" style="width:100vw;height:95vh;"></div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  // 创建地图实例
  const map = new BMap.Map("map");

  // 定义中心经纬度
  const center = [119.226, 34.612];

  // 定义地图缩放级别
  const zoom = 5;

  map.centerAndZoom(new BMap.Point(center[0], center[1]), zoom);

  //添加地图类型控件
  map.addControl(new BMap.MapTypeControl({
    mapTypes: [
      BMAP_NORMAL_MAP,
      BMAP_HYBRID_MAP
    ]
  }));
  map.setCurrentCity("连云港");          // 设置地图显示的城市 此项是必须设置的

  // 启用双指缩放地图
  map.enablePinchToZoom(true)

  // 开启鼠标滚轮缩放
  map.enableScrollWheelZoom(true);

  var countries = [
    {name: "中国", lng: 116.4074, lat: 39.9042},
    {name: "蒙古", lng: 106.8480, lat: 47.9053},
    {name: "哈萨克斯坦", lng: 71.3150, lat: 51.1797},
    {name: "吉尔吉斯斯坦", lng: 74.7660, lat: 41.2994},
    {name: "塔吉克斯坦", lng: 68.8586, lat: 38.5090},
    {name: "乌兹别克斯坦", lng: 69.2080, lat: 41.2772},
    {name: "土库曼斯坦", lng: 55.8337, lat: 37.9663},
    {name: "伊朗", lng: 51.3890, lat: 35.6892},
    {name: "土耳其", lng: 39.9255, lat: 40.1005},
    {name: "俄罗斯", lng: 37.6184, lat: 55.7512},
    {name: "波兰", lng: 19.9450, lat: 52.2297},
    {name: "捷克", lng: 14.4209, lat: 50.0878},
    {name: "匈牙利", lng: 19.0402, lat: 47.4979},
    {name: "斯洛文尼亚", lng: 14.5060, lat: 46.0524},
    {name: "克罗地亚", lng: 15.9782, lat: 45.7615},
    {name: "罗马尼亚", lng: 26.1025, lat: 44.4268},
    {name: "保加利亚", lng: 23.3288, lat: 42.6960},
    {name: "希腊", lng: 23.7275, lat: 37.9838},
    {name: "意大利", lng: 12.4964, lat: 41.9028},
    {name: "塞尔维亚", lng: 19.3642, lat: 44.8040},
    {name: "北马其顿", lng: 21.7830, lat: 42.3500},
    {name: "阿尔巴尼亚", lng: 19.8180, lat: 41.3270},
    {name: "黑山", lng: 18.7650, lat: 42.4090},
    {name: "波斯尼亚和黑塞哥维那", lng: 18.0630, lat: 43.5080},
    {name: "科索沃", lng: 19.6590, lat: 42.6410},
    {name: "埃及", lng: 31.2357, lat: 30.0444},
    {name: "利比亚", lng: 13.1870, lat: 32.7530},
    {name: "突尼斯", lng: 10.1815, lat: 36.8065},
    {name: "阿尔及利亚", lng: 3.0637, lat: 36.7065},
    {name: "摩洛哥", lng: -4.7960, lat: 34.0800},
    {name: "西撒哈拉", lng: -13.5922, lat: 27.7333},
    {name: "毛里塔尼亚", lng: -15.8000, lat: 21.0018},
    {name: "塞内加尔", lng: -17.4480, lat: 14.4974},
    {name: "冈比亚", lng: -15.8750, lat: 13.2205},
    {name: "马里", lng: -8.1508, lat: 12.2383},
    {name: "布基纳法索", lng: -1.5610, lat: 12.2383},
    {name: "几内亚", lng: -13.8610, lat: 9.2631},
    {name: "几内亚比绍", lng: -15.1804, lat: 11.8062},
    {name: "佛得角", lng: -23.9600, lat: 14.6900},
    {name: "塞拉利昂", lng: -12.7760, lat: 8.4070},
    {name: "利比里亚", lng: -10.5019, lat: 6.3744},
    {name: "科特迪瓦", lng: -5.5150, lat: 7.3055},
    {name: "加纳", lng: -0.1970, lat: 5.5994},
    {name: "多哥", lng: 1.2716, lat: 6.3744},
    {name: "贝宁", lng: 2.3950, lat: 9.4980},
    {name: "尼日尔", lng: 8.0000, lat: 13.5161},
    {name: "尼日利亚", lng: 7.4951, lat: 9.0578},
    {name: "乍得", lng: 14.0780, lat: 12.4384},
    {name: "中非", lng: 18.6575, lat: -7.1820},
    {name: "喀麦隆", lng: 12.3544, lat: 6.3690},
    {name: "赤道几内亚", lng: 8.7730, lat: 3.9600},
    {name: "圣多美和普林西比", lng: 6.6800, lat: 0.1080},
    {name: "加蓬", lng: 12.3880, lat: 1.6960},
    {name: "刚果（布）", lng: 18.7733, lat: -4.0900},
    {name: "刚果（金）", lng: 28.2150, lat: -12.9233},
    {name: "赞比亚", lng: 28.2357, lat: -15.2998},
    {name: "津巴布韦", lng: 31.0850, lat: -17.8196},
    {name: "莫桑比克", lng: 32.9965, lat: -25.9201},
    {name: "马达加斯加", lng: 48.4660, lat: -18.9560},
    {name: "南非", lng: 28.1240, lat: -25.9490},
    {name: "纳米比亚", lng: 17.9750, lat: -21.9680},
    {name: "莱索托", lng: 27.4500, lat: -29.1500},
    {name: "斯威士兰", lng: 31.4200, lat: -26.3200},
    {name: "埃斯瓦蒂尼", lng: 31.3980, lat: -30.5340},
    {name: "印度", lng: 77.1115, lat: 28.6139},
    {name: "巴基斯坦", lng: 73.1350, lat: 33.7470},
    {name: "孟加拉国", lng: 90.3563, lat: 23.6846},
    {name: "缅甸", lng: 96.1930, lat: 16.8460},
    {name: "泰国", lng: 100.5018, lat: 13.7563},
    {name: "柬埔寨", lng: 104.9280, lat: 11.3220},
    {name: "越南", lng: 105.8340, lat: 21.0230},
    {name: "老挝", lng: 102.6330, lat: 17.9757},
    {name: "马来西亚", lng: 101.6860, lat: 3.1390},
    {name: "新加坡", lng: 103.8198, lat: 1.3521},
    {name: "菲律宾", lng: 120.9770, lat: 14.6042},
    {name: "印度尼西亚", lng: 106.8071, lat: -6.1744},
    {name: "东帝汶", lng: 125.6596, lat: -8.8753},
    {name: "澳大利亚", lng: 149.1290, lat: -35.2870},
    {name: "新西兰", lng: 174.7760, lat: -41.2860},
    {name: "斐济", lng: 177.5150, lat: -17.9860},
    {name: "所罗门群岛", lng: 159.6800, lat: -9.4360},
    {name: "瓦努阿图", lng: 168.2600, lat: -17.4400},
    {name: "汤加", lng: -175.1500, lat: -21.1950},
    {name: "萨摩亚", lng: -172.8860, lat: -13.7563},
    {name: "帕劳", lng: 134.4360, lat: 7.2933}
  ];

  for (var i = 0; i < countries.length; i++) {
    var country = countries[i];
    var point = new BMap.Point(country.lng, country.lat);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
  }

})

</script>

<style>
.BMap_cpyCtrl,
.BMap_stdMpCtrl,
.anchorBL {
  display: none !important;
}

</style>
