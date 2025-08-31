<script setup>
import { defineProps } from 'vue';


const props = defineProps({
  position:{
    type: String,
    default: 'fixed'
  },
  height:{
    type: String,
    default: '100vh'
  },
  blur:{
    type: String,
    default: '10px'
  },
  background:{
    type: Boolean,
    default: true
  }
});

</script>
<template>
  <div
  :disabled="false"
  class="lodaer__body"
  :data-background="background"
  :style="`position: ${position}; height: ${height}; backdrop-filter: blur(${blur});`"
  >
    <span class="loader" />
  </div>
</template>

<style lang="scss" setup>
@import "@/assets/scss/shared/load.scss";
</style>
