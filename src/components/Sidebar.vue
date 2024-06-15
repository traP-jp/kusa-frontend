<script setup lang="ts">
import Channel from './Channel.vue'

defineProps<{ 
  level: string
  isNSFW: boolean
  score: number
}>()

</script>

<template>
  <div class="_sidebar">
    <div class="_container">
      <div class="_content">
        <div class="_item">
          <div class="_subtitleContainer">
            <h3 class="_subtitle">チャンネル</h3>
          </div>
          <div>
            <div class="_element">
              <Channel channelName="Level" :hasChild=true />
              <div class="_slot">
                <div class="_wrapper">
                  <div class="children">
                    <div class="_element">
                      <Channel :channelName="level" :hasChild=false />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="_element" v-if="isNSFW">
              <Channel channelName="NSFW" :hasChild="false" />
            </div>
            <div class="_element">
              <Channel channelName="Score" :hasChild=true />
              <div class="_slot">
                <div class="_wrapper">
                  <div class="children">
                    <div class="_element">
                      <Channel :channelName="score.toString()" :hasChild=false />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  display: block;
  text-align: left;
}
._sidebar {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}
._container {
    width: 100%;
    height: 100%;
    /* overflow-y: scroll; */
    /* scrollbar-gutter: stable; */
    padding-top: 24px;
    padding-left: 8px;
    backface-visibility: hidden;
    /* contain: strict; */
}
._content {
    margin: 24px;
}
._item {
    margin: 16px;
}
._subtitleContainer {
    display: flex;
    justify-content: space-between;
}
._subtitle {
    color: var(--theme-ui-secondary-default);
    font-size: .875rem;
    margin-bottom: 8px;
    font-weight: 700;
}
._element {
    margin: 4px 0;
    color: var(--theme-ui-primary-default);
    display: block;
    -webkit-user-select: none;
    user-select: none;
    position: relative;
    contain: layout;
}
._slot {
    padding-left: 8px;
}
._wrapper {
    overflow: hidden;
}
._children {
    margin-left: 12px;
}
</style>