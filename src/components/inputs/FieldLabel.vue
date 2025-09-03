<template>
  <div class="label" :data-Type="data" data-font-black="true">
    <label class="label__text" :for="`${label}-${formName}`">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">

defineProps({
  formName: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },

  data: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss">
@import "@/assets/scss/custom/Input.scss";
</style>
