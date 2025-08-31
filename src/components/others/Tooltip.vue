<template>
  <div
    class="search__resultSerch"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      class="search__resultSerch-list"
      @click="selectItem(item)"
    >
      {{ item[keysIdentify.name] }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  keysIdentify: {
    type: Object,
    default: () => ({
      id: 'id',
      name: 'name',
    }),
  },
});

const emit = defineEmits(['select']);

const selectItem = (item) => {
  emit('select', item);
};

</script>

<style scoped lang="scss">
.search__resultSerch {
  background: white;
  //backdrop-filter: blur(60px);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  position: absolute;
  width: 100%;
  top: 40px;
  display: none;
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-color: #ff5b2011 #f3f3f300;
  scrollbar-width: thin;
  &::-webkit-scrollbar-thumb {
    background: #565656;
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #565656;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #565656;
  }

  &::-webkit-scrollbar-track {
    background: #f3f3f300;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track:hover,
  &::-webkit-scrollbar-track:active {
    background: #00000000;
  }

  &[data-Show="true"] {
    display: flex;
    z-index: 4;
  }
}

.search__resultSerch-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background: #b4c1bb54;
    backdrop-filter: blur(40px);
    font-weight: 400;
  }
}
</style>
