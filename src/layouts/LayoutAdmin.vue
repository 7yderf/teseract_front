<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import useAuth from '@/modules/login/composables/useAuth';
const { logout, sesion } = useAuth();

</script>
<template>
 <main class="flex w-full  flex-col align-items-stretch">
  <header class="bg-(--secondary-color) flex text-white py-4 font-semibold">
    <nav class="flex max-w-[1200px]  w-full flex-wrap mx-auto  items-center justify-center sm:justify-between flex-col-reverse sm:flex-row gap-4 px-4">
      <ul class="flex items-center gap-4 ">
        <li><router-link  class="text-white font-normal" activeClass="rounded-md bg-sky-500/75 px-4 py-2  opacity-100 focus:outline-none" to="/documents">Documentos</router-link></li>
        <li><router-link  class="text-white font-normal" activeClass="rounded-md bg-sky-500/75 px-4 py-2  opacity-100 focus:outline-none" to="/shared">Compartidos</router-link></li>
      </ul>
      <div class="flex items-center gap-4 ml-auto sm:ml-0">
        <p class="font-semibold">{{ sesion.user }}</p>
        <button class="rounded-md bg-sky-500/75 px-4 py-2  opacity-100 focus:outline-none" type="button" @click="logout">Logout</button>
      </div>
    </nav>
    
  </header>
  <section class="flex-grow p-8">
    <router-view/>    
  </section>

</main>
</template>
<style lang="scss" scoped>

</style>