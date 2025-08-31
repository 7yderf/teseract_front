<template>
  <main class="">
    <h4 class="text-center">Bienvenido</h4>
    <Auth>
      <template #register>
        <router-link class="" to="/recovery">
          *Recuperar contraseña
        </router-link>
      </template>
    </Auth>
  </main>
</template>
<script setup>
import Auth from '../modules/login/components/Auth.vue';
</script>

<style lang="scss" scoped>
//@import "@/assets/scss/custom/login.scss";
</style>