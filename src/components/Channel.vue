<script setup lang="ts">
defineProps<{
  channelName: string
  hasChild: boolean
}>()

</script>

<template>
  <div class="_channelContainer">
    <div class="_channelHash">
      <div class="_hash" :class="{hasChild: hasChild}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" class="_iconImage" role="img"><path fill="currentColor" d="M5 15.717v-1.728h2.38l.793-4.38H6.017V7.881h2.481l.57-3.214h2.034l-.57 3.214h2.44l.57-3.214h2.034l-.57 3.214H17V9.61h-2.319l-.793 4.38h2.095v1.728h-2.4l-.65 3.616h-2.035l.651-3.616H9.11l-.651 3.616H6.424l.65-3.616H5Zm7.648-6.108h-2.441l-.793 4.38h2.44l.794-4.38Z"></path></svg>
      </div>
    </div>
    <div class="_channel">
      <div class="_channelName">
        <span class="_channelNameText">{{ channelName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
    display: block;
    text-align: left;
}
._channelContainer {
    position: relative;
    display: flex;
    height: 32px;
    padding-left: 2px;
    padding-right: 4px;
    margin-left: 8px;
    z-index: 0;
}
._channelHash {
    flex-shrink: 0;
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 32px;
    height: 32px;
}
._hash {
    color: var(--theme-ui-primary-default);
    border-width: 2px;
    border-style: solid;
    border-color: transparent;
    border-radius: 4px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    box-sizing: content-box;
    position: relative;
}
.hasChild {
  background: var(--theme-ui-secondary-background);
  color: var(--specific-channel-hash-opened);
}
._iconImage {
   margin-left: .5px;
   contain: strict;
}
._channel {
    display: flex;
    align-items: center;
    margin-left: 8px;
    width: calc(100% - 8px);
}
._channelName {
    font-size: 1rem;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 0 8px;
}
._channelNameText {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>