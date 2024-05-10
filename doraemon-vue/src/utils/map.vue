<template>
  <div id="map" style="height: 80vh; margin: 20px"></div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-image";
import img from './2.jpg';

onMounted(() => {
  const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
  });
  /*L.tileLayer(img).addTo(map);*/
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://863rc.com"></a>',
    subdomains: '1234'
  }).addTo(map);
})
</script>

<style lang="scss" scoped>

</style>