<template>
  <div>
    <div id="map" style="width:100vw;height:95vh;"></div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  const tileLayer = new BMap.TileLayer();
  tileLayer.getTilesUrl = function (tileCoord, zoom) {
    const x = tileCoord.x;
    const y = tileCoord.y;
    return 'http://localhost:3000/images/tiles/' + zoom + '/tile-' + x + '_' + y + '.png';
  }
  const MyMap = new BMap.MapType('MyMap', tileLayer, {minZoom: 3, maxZoom: 5});
  const map = new BMap.Map('map', {mapType: MyMap});
  map.addControl(new BMap.NavigationControl());
  // 定义中心经纬度
  map.centerAndZoom(new BMap.Point(0, -10), 3);
  // 启用双指缩放地图
  map.enablePinchToZoom(true)

  // 开启鼠标滚轮缩放
  map.enableScrollWheelZoom(true);


  /*const myIcon = new BMap.Icon("https://source.unsplash.com/random/8000x600", new BMapGL.Size(23, 25), {
    // 指定定位位置。
    // 当标注显示在地图上时，其所指向的地理位置距离图标左上
    // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
    // 图标中央下端的尖角位置。
    anchor: new BMapGL.Size(10, 25),
    // 设置图片偏移。
    // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
    // 需要指定大图的偏移位置，此做法与css sprites技术类似。
    imageOffset: new BMapGL.Size(0, 0 - 25)   // 设置图片偏移
  });*/


  let position = [
    {id: 1, name: '大雄家', lng: 55, lat: -80},
    {id: 2, name: '静香家', lng: -97, lat: 50},
    {id: 3, name: '胖虎家', lng: 25, lat: 45},
    {id: 4, name: '小夫家', lng: -1, lat: 21},
    {id: 5, name: '小红家', lng: 100, lat: 100},
    {id: 6, name: '小明家', lng: 120, lat: 120},
  ];


  for (let i = 0; i < position.length; i++) {
    const point = new BMap.Point(position[i].lng, position[i].lat);
    const marker = new BMap.Marker(point);

    marker.addEventListener("click", function () {
      alert(`您点击了标注：${position[i].name}`);
    });

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
