<script setup lang="ts">
import Button from "@/components/Button.vue";
import { ref } from "vue";
const test = ref({
  average_keytype: 32,
  sum_keytype: 3,
  miss_keytype: 3,
  ranking: 3

});
</script>

<template>
  <div class="outer">
    <div class="container">
      <div class="title_container">
        <div class="item">称号:</div>
        <div class="item">お笑いの鬼</div>
      </div>

      <div id="minicontainer">
        <div class="item">平均キータイプ数</div>
        <div class="item">{{ test.average_keytype }}回/s</div>
        <div class="item">正しく打ったキーの数</div>
        <div class="item">{{ test.sum_keytype }}回</div>
        <div class="itemG">ミスタイプ数</div>
        <div class="itemH">{{ test.miss_keytype }}回</div>
        <div class="itemI">ランキング</div>
        <div class="itemJ">{{ test.ranking }}回</div>
      </div>
      <div class="button_container">
        <router-link to="/"><Button msg="ホーム画面に戻る" link=""></Button></router-link>
        <router-link to="/play"><Button msg="もう一回プレイする" link="https://vuejs.org/"></Button></router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 1280px;
  place-items: center;
  margin: 0 auto;
}

.button_container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
  margin: auto 0;
}

.item {
  font-size: 50px;
  margin-bottom: 50px;
}

.title_container {
  display: grid;
  grid-template-rows: 100px;
  grid-template-columns: 150px 1fr;
  font-size: 50px;
  margin-bottom: 50px;
}

#minicontainer {
  display: grid;
  /* グリッドレイアウト */
  grid-template-rows: 50px 50px 50px 50px;
  grid-template-columns: 150px 1fr;
}
</style>
