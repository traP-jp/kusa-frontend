<script setup lang="ts">
import Button from "@/components/Button.vue";
</script>

<template>
  <div class="container">
    <h2 class="sub_title">traQ 厳選投稿！</h2>
    <h1 class="title">草タイピング</h1>

    <div class="button_container">
      <router-link to="/play">
        <Button msg="easy" link=""></Button>
      </router-link>
      <router-link to="/play">
        <Button msg="hard" link=""></Button>
      </router-link>
      <router-link to="/ranking">
        <Button msg="ランキング" link=""></Button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  margin-top: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

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
  margin: 0 auto;
}

.sub_title {
  font-family: "Mochiy Pop One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 96px;
  margin: 0;
  margin-bottom: 32px;
  align-items: center;
}

.title {
  font-family: "Mochiy Pop One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 128px;
  margin-bottom: 160px;
  align-items: center;
}
</style>