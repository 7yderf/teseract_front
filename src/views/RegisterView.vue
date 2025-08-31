<template>
  <main class="">
    <h4 class="text-center">Bienvenido</h4>
    <Register>
      <template #register>
        <router-link class="" to="/recovery">
          *Recuperar contraseña
        </router-link>
      </template>
    </Register>
  </main>
</template>
<script setup>
import Register from '@/modules/login/components/Register.vue';
</script>
