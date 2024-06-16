<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  { rank: 1, image_link: "https://q.trap.jp/api/v3/public/icon/anko", name: "あんこ", score: 3041 },
  { rank: 2, image_link: "https://q.trap.jp/api/v3/public/icon/anko", name: "あんこ", score: 2041 },
  { rank: 3, image_link: "https://q.trap.jp/api/v3/public/icon/anko", name: "あんこ", score: 2041 },
  { rank: 4, image_link: "https://q.trap.jp/api/v3/public/icon/anko", name: "あんこ", score: 2041 }
])
</script>

<template>
  <div class="table_container">
    <div v-for="item in items" class="row_container">
      <div class="row_rank">
        <img src="../assets/rank_1.png" height="32" v-if="item.rank == 1">
        <img src="../assets/rank_2.png" height="32" v-if="item.rank == 2">
        <img src="../assets/rank_3.png" height="32" v-if="item.rank == 3">
        <span v-if="item.rank > 3">{{ item.rank }}</span>
      </div>
      <div class="row_user">
        <img :src="item.image_link" height="32px">
        <span class="row_name">
          {{ item.name }}
        </span>
      </div>
      <span class="row_score">{{ item.score.toLocaleString() }}</span>
    </div>
  </div>
</template>

<style scoped>
.table_container {
  overflow-y: scroll;
}

.row_container {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  gap: 10px;
  grid-auto-rows: minmax(64px, auto);
  border-bottom: 1px solid #dbdde2;
}

.row_rank {
  display: flex;
  justify-content: center;
  align-items: center;
}

.row_user {
  display: flex;
  align-items: center;
}

.row_name {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-left: 16px;
}

.row_score {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
}
</style>
