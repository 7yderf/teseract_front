<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

interface Props {
  sort?: string;
  name?: string;
  keyName?: string;
  loadWithSort?: () => void;
  getPage?: (page: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
  sort: 'default',
  name: '',
  keyName: '',
  loadWithSort: () => {},
  getPage: () => {},
});

const stateSort = ref(props.sort);
</script>

<template>
  <div class="flex items-center  gap-2 cursor-pointer">
    <p class="font-semibold">{{ name }}</p>
    <span class="flex flex-col">
      <Icon 
        icon="tabler:chevron-up"
        class="h-4 w-4 transition-colors"
        :class="[
          stateSort === 'asc' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
        ]"
      />
      <Icon 
        icon="tabler:chevron-down"
        class="h-4 w-4 transition-colors"
        :class="[
          stateSort === 'desc' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
        ]"
      />
    </span>
  </div>
</template>