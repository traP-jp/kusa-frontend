<script setup lang="ts">
import Table from '@/components/Table.vue'
import { components } from '@/openapi.gen';
import createClient from "openapi-fetch";
import { ref } from 'vue';

const items = ref([
  { rank: 1, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 3041, level: 1, timeStamp: '' },
  { rank: 2, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 2041, level: 1, timeStamp: '' },
  { rank: 3, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 2041, level: 1, timeStamp: '' },
  { rank: 4, iconUri: "https://q.trap.jp/api/v3/public/icon/anko", userName: "あんこ", score: 2041, level: 1, timeStamp: '' }
])

const client = createClient<components['schemas']['']>({ baseUrl: "https://myapi.dev/v1/" });

https://kusa.trap.show/api/rankings?count=10&level=1
</script>

<template>
  <div class="table_container">
    <Table :columns="items"></Table>
  </div>
</template>

<style scoped></style>
