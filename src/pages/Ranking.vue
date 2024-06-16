<script setup lang="ts">
import { ref } from 'vue';
import Table from '@/components/Table.vue'
import { paths } from '@/openapi.gen';
import createClient from "openapi-fetch";

const items = ref([
  { rank: 1, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 3041, level: 1, timeStamp: '' },
  { rank: 2, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 2041, level: 1, timeStamp: '' },
  { rank: 3, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 2041, level: 1, timeStamp: '' },
  { rank: 4, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 2041, level: 1, timeStamp: '' }
])

const client = createClient<paths>(
  {
    baseUrl: "https://kusa.trap.show/api"
  });

const { data } = await client.GET("/rankings", {
  params: {
    query: { count: 10, level: 1 }
  }
})
</script>

<template>
  <div class="container">
    <h1>ランキング</h1>
    <div class="table_container">
      <Table :columns="items"></Table>
      <Table :columns="data" v-if="data"></Table>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: "Mochiy Pop One", sans-serif;
}

.container {}
</style>
