<script setup lang="ts">
import { ref } from 'vue'
import Task from '@/components/Task.vue'
import Sidebar from '@/components/Sidebar.vue'

</script>

<template>
  <div class="HomeWrapper">
    <div class="HomeContainer">
      <div class="SidebarContainer">
        <Sidebar level="easy" :isNSFW=true :score=1500 />
      </div>
      <div class="MainContainer">
        <div class="body">
          <div class="container">
            <div class="layoutContainer">
              <div class="taskContainer">
                <Task />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HomeWrapper {
  height: 100vh;
  width: 100vw;
}
.HomeContainer {
    height: 100%;
    display: flex;
}
.SidebarContainer {
    background: var(--theme-background-tertiary-default);
    height: 100%;
    max-width: 400px;
    min-width: 260px;
    flex-shrink: 0;
    flex-basis: calc(260px +(100vw - 700px)* .0752688172);
}
.MainContainer {
    opacity: 1;
    position: relative;
    width: 100%;
    min-width: 0;
    transition: opacity .3s ease;
    contain: strict;
}
.body{
    height: 100vh;
    width: 100%;
}
.container{
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
/* .layoutContainer{
    position: relative;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
} */
.taskContainer{
    color: var(--theme-ui-primary-default);
    display: flex;
    flex-direction: row;
    position: relative;
    height: 100vh;
    background: var(--specific-main-view-background);
    flex: 1 1;
    flex-direction: column;
    position: relative;
    width: 100%;
}
</style>