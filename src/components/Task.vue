<script setup lang="ts">
import { components } from '../openapi.gen.ts'

defineProps<{ tasks: components['schemas']['task'] }>();
</script>

<template>
  <div class="_task" v-for="task in tasks" :key="task.content">
    <div class="_container">
      <div class="_userIcon_wrap" style="width: 40px; height: 40px;">
        <img class="_userIcon" :src="task.iconUri">
      </div>
      <div class="_messageHeader">
        <span class="_displayName">{{ task.authorDisplayName }}</span>
        <div class="_body" data-is-grade="true">
          <span>{{ task.grade }}</span>
        </div>
        <span class="_name">@{{ task.authorName }}</span>
        <span class="_date">{{ task.updatedAt }}</span>
      </div>
      <div class="_messageContents">
        <span class="markdown-body">
          <p>{{ task.content }}</p>
          <!-- <p>{{ task.yomi }}</p> -->
        </span>
        <div class="_messageEmbeddingsList" v-if="task.citated != ''">
          <div class="_messageEmbedding">
            <div class="_messageEmbeddingContents">
              <div class="_markdownContainer">
                <span class="markdown-body-Embedding">
                  <p>{{ task.citated }}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="_stampWrapper">
      <div class="_stampList">
        <div class="_stamp" v-for="stamp in task.stamps" :key="stamp.stampId">
          <div class="_stamp_body" v-if="stamp.stampId=='6308a443-69f0-45e5-866f-56cc2c93578f'">
            <div class="_stamp_container" style="width: 1.25rem; height: 1.25rem;">
              <img class="_img" src="../assets/w.png" draggable="false">
            </div>
            <div class="_count_body">
              <div class="_dummy">{{ stamp.count }}</div>
              <div class="_number">{{ stamp.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._task {
  font-family: Inter, "M PLUS 1p", Avenir, Helvetica Neue, Helvetica, Arial, Hiragino Sans, ヒラギノ角ゴシック, YuGothic, Yu Gothic, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif;
  color: var(--theme-ui-primary-default);
  overflow-y: scroll;
}

* {
  box-sizing: border-box;
}

p {
  margin: 0;
  text-align: left;
}

div {
  display: block;
  unicode-bidi: isolate;
}

._task {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  overflow: clip;
  padding: 8px 32px;
}

._container {
  display: grid;
  grid-template-areas:
    "user-icon message-header"
    "user-icon message-contents"
    "......... message-contents";
  grid-template-rows: 20px auto 1fr;
  grid-template-columns: 42px 1fr;
  width: 100%;
  min-width: 0;
}

._userIcon {
  grid-area: user-icon;
  grid-row-start: user-icon;
  grid-column-start: user-icon;
  grid-row-end: user-icon;
  grid-column-end: user-icon;
  margin-top: 2px;
  color: var(--theme-ui-secondary-default);
  position: relative;
  border-radius: 100vw;
  flex-shrink: 0;
  flex-grow: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

._messageHeader {
  grid-area: message-header;
  padding-left: 8px;
  display: inline-flex;
  align-items: baseline;
  min-width: 0;
}

._displayName {
  font-weight: 700;
  flex: 2;
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 0%;
  max-width: min-content;
  word-break: keep-all;
  white-space: nowrap;
  white-space-collapse: collapse;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
}

._body {
  background: var(--theme-background-secondary-default);
  color: var(--theme-ui-secondary-default);
  font-size: .875rem;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  border-radius: 4px;
  padding: 0 4px;
  margin-left: 4px;
}

._name {
  color: var(--theme-ui-secondary-default);
  font-size: .875rem;
  margin-left: 4px;
  flex: 1;
  max-width: min-content;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

._date {
  color: var(--theme-ui-secondary-default);
  font-size: .75rem;
  margin-left: 4px;
}

._messageContents {
  grid-area: message-contents;
  padding-top: 4px;
  padding-left: 8px;
  min-width: 0;
}

.markdown-body {
  -webkit-text-size-adjust: 100%;
  line-height: 1.2;
  word-break: normal;
  overflow-wrap: anywhere;
  line-break: loose;
  margin: 0;
}

._stampWrapper {
  position: relative;
  margin-top: 8px;
  margin-left: 42px;
}

._stampList {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  contain: content;
}

._stamp {
  display: flex;
}

._stamp_body {
  margin-right: .25rem;
  margin-bottom: .25rem;
  background: var(--theme-background-tertiary-default);
  display: inline-flex;
  flex-shrink: 0;
  height: 1.5rem;
  align-items: center;
  padding: .125rem .25rem;
  border-radius: .25rem;
  -webkit-user-select: none;
  user-select: none;
  overflow: hidden;
  contain: content;
}

._stamp_container {
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
  contain: content;
}

._img {
  max-height: 100%;
  margin: auto;
}

img {
  image-orientation: from-image;
  max-width: 100%;
  display: block;
}

._count_body {
  color: var(--specific-count-text);
  font-size: .875rem;
  font-weight: 700;
  margin-left: 6px;
  margin-right: 4px;
  position: relative;
  height: 100%;
}

._dummy {
  opacity: 0;
}

._number {
  position: absolute;
  left: 0;
  top: 0;
}

._messageEmbeddingsList {
  margin-top: 16px;
}

._messageEmbedding {
  width: 100%;
  min-width: 0;
  padding-left: 16px;
  border-left-width: 4px;
  border-left-style: solid;
  border-color: var(--theme-ui-tertiary-default);
  overflow: hidden;
}

._messageEmbeddingContents {
  font-size: .875rem;
  grid-area: message-contents;
  padding-top: 4px;
  padding-left: 8px;
  min-width: 0;
  position: relative;
}

._markdownContainer {
  max-height: 200px;
  overflow: clip;
}

.markdown-body-Embedding {
  -webkit-text-size-adjust: 100%;
  line-height: 1.2;
  word-break: normal;
  overflow-wrap: anywhere;
  line-break: loose;
}
</style>