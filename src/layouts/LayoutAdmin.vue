<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import useAuth from '@/modules/login/composables/useAuth';
const { logout, sesion } = useAuth();

</script>
<template>
 <main class="admin">
  <header class="admin__header">
    <div class="admin__logout">
      <p>{{ sesion.user }}</p>
      <button type="button" @click="logout">Logout</button>
    </div>
  </header>
  <section class="admin__body">
    <router-view/>    
  </section>

</main>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/Mixins";
.admin{
  @include flex(center, false, stretch);
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  &__header{
    @include flex;
    background-color: wheat;
    height: 50px;
  }
  &__logout{
    @include flex(center, 8px);
    margin-left: auto;
    padding: 8px;
  }
  &__body{
    flex-grow: 1;
  }
}
</style>