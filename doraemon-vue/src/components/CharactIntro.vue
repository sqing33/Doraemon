<template>
  <div>
    <div id="map" style="width: 100vw; height: calc(100vh - 40px)"></div>

    <div
      :class="{
        cloudTransition: cloudTransition,
        _cloudTransition: _cloudTransition,
      }"
      class="cloud"
    >
      <img
        alt=""
        src="@/assets/map/cloud.png"
        style="width: 230vw; height: 230vh"
      />
    </div>

    <div
      v-if="characterVisible"
      :style="{
        background:
          'url(' + character.img + ') no-repeat center bottom / cover',
      }"
      class="character"
    >
      <img
        src="@/assets/map/back.png"
        alt=""
        style="
          width: 150px;
          height: 150px;
          position: absolute;
          top: 10px;
          left: 10px;
          cursor: pointer;
        "
        @click="_back()"
      />

      <div class="intro-text">
        <h2>
          {{ chickIntro.name
          }}<span v-if="chickIntro.realname" style="font-size: 18px"
            >(全名{{ chickIntro.realname }})</span
          >
        </h2>
        <p v-if="chickIntro.birthday">
          生日是{{ chickIntro.birthday
          }}<span v-if="chickIntro.age"
            >,动漫中目前大约{{ chickIntro.age }}</span
          >
        </p>
        <p v-if="chickIntro.height">
          {{ chickIntro.height }},{{ chickIntro.weight }}
        </p>
        <p>{{ chickIntro.nature }}</p>
        <p v-if="chickIntro.favorite">喜欢{{ chickIntro.favorite }}</p>
        <p v-if="chickIntro.fear">不喜欢{{ chickIntro.fear }}</p>
      </div>

      <div class="intro-img">
        <img
          v-for="(item, index) in intro"
          :key="index"
          :src="item.img"
          alt=""
          @click="handleClick(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { InterfaceUrl } from "@/api";

import address from "@/assets/map/address.png";

import Nobita from "@/assets/map/character/Nobita/home.jpg";
import Giant from "@/assets/map/character/Giant/home.jpg";

import Shizuka from "@/assets/map/character/Shizuka.jpg";
import Suneo from "@/assets/map/character/Suneo.jpg";
import Teacher from "@/assets/map/character/Teacher.jpg";

const store = useStore();

const character = ref();

const characterVisible = ref(false);

const cloudTransition = ref(false);

const _cloudTransition = ref(false);

const _back = () => {
  _cloudTransition.value = true;

  setTimeout(() => {
    characterVisible.value = false;
  }, 800);

  setTimeout(() => {
    _cloudTransition.value = false;
  }, 1500);
};

const CharactIntro = store.state.CharactIntro;

const intro = ref(CharactIntro.Nobita);

const chickIntro = ref(intro.value[1]);

onMounted(() => {
  const tileLayer = new BMap.TileLayer();
  tileLayer.getTilesUrl = function (tileCoord, zoom) {
    var x = tileCoord.x;
    var y = tileCoord.y;
    return `${InterfaceUrl}/map/${zoom}/tile-${x}_${y}.png`;
  };
  const MyMap = new BMap.MapType("MyMap", tileLayer, {
    minZoom: 4,
    maxZoom: 5,
  });
  const map = new BMap.Map("map", { mapType: MyMap });
  map.addControl(new BMap.NavigationControl());

  // 定义中心经纬度
  map.centerAndZoom(new BMap.Point(0, 0), 4);

  // 启用双指缩放地图
  map.enablePinchToZoom(true);

  // 开启鼠标滚轮缩放
  map.enableScrollWheelZoom(true);

  const swPoint = new BMap.Point(-105, -60);
  const nePoint = new BMap.Point(105, 60);

  const bounds = new BMap.Bounds(swPoint, nePoint);

  let position = [
    {
      id: 1,
      name: "大雄家",
      engName: "Nobita",
      lng: 27,
      lat: -51,
      img: Nobita,
    },
    {
      id: 2,
      name: "静香家",
      engName: "Shizuka",
      lng: -49,
      lat: 27,
      img: Shizuka,
    },
    {
      id: 3,
      name: "胖虎家",
      engName: "Giant",
      lng: 12.5,
      lat: 24.5,
      img: Giant,
    },
    { id: 4, name: "小夫家", engName: "Suneo", lng: 0, lat: 11, img: Suneo },
    {
      id: 5,
      name: "出木衫家",
      engName: "Teacher",
      lng: -100,
      lat: 27,
      img: Teacher,
    },
    {
      id: 6,
      name: "老师家",
      engName: "Teacher",
      lng: 84.5,
      lat: 20,
      img: Teacher,
    },
    {
      id: 7,
      name: "神成家",
      engName: "Teacher",
      lng: -9,
      lat: -37,
      img: Teacher,
    },
    {
      id: 8,
      name: "空地",
      engName: "Teacher",
      lng: -7,
      lat: -29,
      img: Teacher,
    },
  ];

  for (let i = 0; i < position.length; i++) {
    const point = new BMap.Point(position[i].lng, position[i].lat);
    const marker = new BMap.Marker(point);

    marker.setTitle(position[i].name);

    marker.setIcon(
      new BMap.Icon(address, new BMap.Size(50, 50), {
        imageSize: new BMap.Size(50, 50),
        imageOffset: new BMap.Size(0, 0),
      })
    );

    map.addEventListener("zoomend", function (e) {
      let zoomValue = map.getZoom();

      let zoom = 50;

      if (zoomValue === 4) {
        zoom = 50;
      } else if (zoomValue === 5) {
        zoom = 120;
      }

      marker.setIcon(
        new BMap.Icon(address, new BMap.Size(zoom, zoom), {
          imageSize: new BMap.Size(zoom, zoom),
          imageOffset: new BMap.Size(0, 0),
        })
      );
    });

    marker.addEventListener("click", () => {
      if (map.getZoom() === 4) {
        map.setZoom(5);
        map.setCenter(point);
        return;
      }

      character.value = position[i];

      intro.value = CharactIntro[character.value.engName];

      chickIntro.value = intro.value[1];

      cloudTransition.value = true;

      setTimeout(() => {
        characterVisible.value = true;
      }, 700);

      setTimeout(() => {
        cloudTransition.value = false;
      }, 1500);
    });

    map.addOverlay(marker);
  }
});

const handleClick = (value) => {
  chickIntro.value = intro.value[value];
};
</script>

<style scoped lang="scss">
.cloud {
  z-index: -99999;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-220vw, -79vh);
}

.cloudTransition {
  animation: cloud 1.5s ease-in-out;
}

@keyframes cloud {
  0% {
    transform: translate(-220vw, -79vh);
    z-index: 99999;
  }
  100% {
    transform: translate(65vw, -79vh);
    z-index: 99999;
  }
}

._cloudTransition {
  animation: _cloud 1.5s ease-in-out;
}

@keyframes _cloud {
  0% {
    transform: translate(65vw, -79vh) scaleX(-1);
    z-index: 99999;
  }
  100% {
    transform: translate(-220vw, -79vh) scaleX(-1);
    z-index: 99999;
  }
}

.character {
  position: absolute;
  width: 100vw;
  height: calc(100vh - 40px);
  top: 0;
  left: 0;

  .intro-text {
    position: absolute;
    top: 100px;
    width: 500px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .intro-img {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    align-items: end;
    height: 300px;

    img {
      height: 300px;
    }

    @media screen and (max-width: 480px) {
      align-items: center;
      justify-content: center;

      img {
        width: 20vw;
        height: auto;
      }
    }
  }
}
</style>

<style>
.BMap_cpyCtrl,
.BMap_stdMpCtrl,
.anchorBL {
  display: none !important;
}
</style>
