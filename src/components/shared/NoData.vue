<template>
	<div
	    class=" w-full mt-5 d-flex justify-content-center align-items-center mt-5 border rounded border-dark-subtle w-100 flex-column p-5 gap-4 ">
	    <Icon
	      class="border rounded-circle p-3 bg-body-secondary"
	      :icon="icon"
	      width="4rem"
	      height="4rem"
	    />
	    <h6 class="text-center">{{ title }}</h6>
	    <p> {{ description }} </p>
	  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
interface Props {
  title?: string;
  description?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Sin contenido que mostrar',
  description: 'Aquí se enlistarán los nuevos clientes',
  icon: 'tabler:clipboard-plus',
});
</script>
