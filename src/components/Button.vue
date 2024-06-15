<script setup lang="ts">
defineProps<{ msg: string; link: string }>();
</script>
<template>
  <a :href="link" target="_blank"
    ><button class="button" type="button">{{ msg }}</button></a
  >
</template>
<style scoped>
.button {
  background-color: #2563eb;
  color: #ffffff;
  height: 48px;
  border-radius: 8px;
  padding: 0.6em 0;
  font-family: inherit;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: border-color 0.25s;
  border: 1px solid transparent;
  width: 100%;
}

button:hover {
  background-color: #5487f8;
}
/* button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
} */
</style>
