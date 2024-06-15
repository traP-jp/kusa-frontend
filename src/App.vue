<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import Button from "./components/Button.vue";
import Task from "./components/Task.vue";
</script>

<template>
  <h1 class="title">traQタイピング</h1>
  
  <div class="button_container">
    <Button msg="easy" link="https://google.com"></Button>
    <Button msg="hard" link="https://vuejs.org/"></Button>
    <Button msg="ランキング" link="https://vuejs.org/"></Button>
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
 margin: 0 auto;

}
.title {
  font-size: 100px;
  margin-bottom: 160px;
}
</style>
