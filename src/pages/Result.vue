<script setup lang="ts">
import Button from "@/components/Button.vue";
import { ref } from "vue";
const test = ref({
  average_keytype: 3.5,
  sum_keytype: 328,
  miss_keytype: 13,
  ranking: 3
});

const score = test.value.average_keytype * 123 - test.value.miss_keytype * 8;
</script>

<template>
  <div class="outer">
    <div class="container">
      <h1 class="title">
        称号: お笑いの鬼
      </h1>

      <div class="minicontainer">
        <div class="item">平均キータイプ数</div>
        <div class="item">{{ test.average_keytype }} 回/s</div>
        <div class="item">正しく打ったキーの数</div>
        <div class="item">{{ test.sum_keytype }} 回</div>
        <div class="item">ミスタイプ数</div>
        <div class="item">{{ test.miss_keytype }} 回</div>
        <div class="item">スコア</div>
        <div class="item">{{ score }}</div>
        <div class="item">ランキング</div>
        <div class="item">{{ test.ranking }} 位</div>
      </div>

      <div class="button_container">
        <router-link to="/"><Button msg="ホーム画面に戻る" link=""></Button></router-link>
        <router-link to="/play"><Button msg="もう一回プレイする" link="https://vuejs.org/"></Button></router-link>
      </div>
    </div>
  </div>
  <div class="upper_left">
    <img src="@/assets/w.png">
  </div>
  <div class="upper_right">
    <img src="@/assets/w.png">
  </div>
  <div class="lower_left">
    <img src="@/assets/w.png">
  </div>
</template>

<style scoped>
.outer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Mochiy Pop One", sans-serif;
}

.container {
  max-width: 1280px;
  margin: 200px auto 0;
}

.button_container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
  margin: 0 auto;
}

.item {
  font-size: 32px;
}

.title {
  font-size: 128px;
  margin-bottom: 50px;
  width: 1000px;
}

.minicontainer {
  width: 70%;
  display: grid;
  grid-template-rows: 50px 50px 50px 50px;
  grid-template-columns: 3fr 2fr;
  gap: 16px 128px;
  margin: 100px auto 98px;
}

.upper_left {
  position: absolute;
  top: 32px;
  left: 64px;
  transform: rotate(-32deg);
  z-index: -2;
}

.upper_right {
  position: absolute;
  top: 256px;
  right: 64px;
  transform: rotate(20deg);
  z-index: -2;
}

.lower_left {
  position: absolute;
  bottom: 128px;
  left: 256px;
  transform: rotate(10deg);
  z-index: -2;
}
</style>
