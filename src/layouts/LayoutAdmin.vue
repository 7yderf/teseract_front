<template>
  <!-- <Loader v-if="load || storeDevice.loader.show" /> -->
  <main class="admin">
    <article class="admin__body">

      <section class="admin__modules-box">
        <div class="admin__modules-header">
          <div class="admin__modules-info-user">
            <!-- <Icon
              class="admin__modules-info-user-icon" 
              icon="ic:baseline-account-circle" 
              width="3.2rem"
              height="3.2rem"
            />
            <h5>{{user}}</h5>
            <button
              @click="logOut"
            >
              Salir
            </button> -->
          </div>
        </div>
        <router-view />
      </section>
    </article>
  </main>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
// import { Icon } from '@iconify/vue';
// import { useRouter } from 'vue-router';

// import { useAuth } from '@/modules/login/composables/useAuth';
// import storeDevice from '@/modules/tasks/store/StoreDevice';
// import Loader from '@/components/globals/Loader.vue';

// const { 
//   logout,
//   sesion
// } = useAuth()

// const load = ref(false)
// const router = useRouter()
// const isRetraction = computed(()=> storeDevice.aside.show);
// const user = computed(()=> sesion.value.user);
// const desktopMidViewport = computed(()=> storeDevice.viewport.desktopMid.value);

// watch(
//   () => storeDevice.viewport.tabletPortrait.value,
//   (value) => {
//     if(!value){
//       storeDevice.asideToggle(false)
//     }
//   }
// )




// const logOut = async()=>{
//   load.value = true;
//   logout()
//   load.value = false;
//   router.push('/login');
// }

// onMounted(()=>{
// storeDevice.useMediaQuery('tabletPortrait');
// storeDevice.useMediaQuery('desktopMid');
// storeDevice.asideToggle(storeDevice.viewport.tabletPortrait.value)

// })

</script>
<style lang="scss" scoped>
//@import "@/assets/sass/custom/layoutAdmin.scss";</style>