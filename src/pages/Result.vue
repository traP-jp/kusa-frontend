<script setup lang="ts">
import Button from "@/components/Button.vue";
import { ref } from "vue";
const test = ref({ average_keytype: 32,
  sum_keytype: 3,
  miss_keytype: 3,
  ranking:3

 });
// const test2 = ref({ keytype: 32 });
// const test3 = ref({ keytype: 32 });
// const test4 = ref({ keytype: 32 });
</script>

<template>
  <div id="titlecontainer">
    <div class="itemA">称号:</div>
    <!-- アイテム -->
    <div class="itemB">B</div>
  </div>

  <div id="minicontainer">
    <!-- コンテナ -->

    <div class="itemC">平均キータイプ数</div>
    <!-- アイテム -->
    <div class="itemD">{{ test.average_keytype }}回/s</div>
    <!-- アイテム -->
    <div class="itemE">正しく打ったキーの数</div>
    <!-- アイテム -->
    <div class="itemF">{{ test.sum_keytype }}回</div>
    <!-- アイテム -->
    <div class="itemG">ミスタイプ数</div>
    <!-- アイテム -->
    <div class="itemH">{{ test.miss_keytype }}回</div>
    <!-- アイテム -->
    <div class="itemI">ランキング</div>
    <!-- アイテム -->
    <div class="itemJ">{{ test.ranking }}回</div>
    <!-- アイテム -->
  </div>
  <!-- <h2 class="title">称号：</h2>
  <h2 class="2">平均キータイプ数</h2>
  <h2 class="3">正しく打ったキーの数</h2>
  <h2 class="4">ミスタイプ数</h2>
  <h2 class="5">ランキング</h2>
  <h2 class="6">{{test.keytype}}回/s</h2>
  <h2 class="7">{{test2.keytype}}回</h2>
  <h2 class="8">{{test3.keytype}}回</h2>
  <h2 class="9">{{test4.keytype}}位</h2> -->
  <div class="button_container">
    <Button msg="ホーム画面に戻る" link="https://google.com"></Button>
    <Button msg="もう一回プレイする" link="https://vuejs.org/"></Button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.button_container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
  margin: auto 0;
}
.itemA {
  width: 200%;
  display: grid; /* グリッドレイアウト */
  grid-template-rows: 100px;
  grid-template-columns: 150px 1fr;
  font-size: 50px;
  margin-bottom: 50px;
}
/* .itemB {
  width: 200%;
} */
#titlecontainer {
  display: grid; /* グリッドレイアウト */
  grid-template-rows: 100px;
  grid-template-columns: 150px 1fr;
  font-size: 50px;
  margin-bottom: 50px;
}
#minicontainer {
  display: grid; /* グリッドレイアウト */
  grid-template-rows: 50px 50px 50px 50px;
  grid-template-columns: 150px 1fr;
}
</style>
