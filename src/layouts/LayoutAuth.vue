<template>
  <main class="w-full bg-gray-100">
    <article class="flex min-h-screen flex-col-reverse md:flex-row h-full">
      <section class="p-8 w-full md:w-[500px]  m-auto">
        <div class="max-w-lg mx-auto p-5 py-10  shadow-xl rounded-md bg-white">
          <router-view />
        </div>
      </section>
      <section class="max-h-[100px] md:max-h-full flex items-center justify-center grow-1 bg-(--secondary-color) p-5">
        <!-- <BackgroundSrc :from="from" class="h-full w-full object-cover object-center" /> -->
        <img src="../assets/logo.png" alt="Auth Illustration" class="md:w-[400px] w-[200px] object-cover object-center"/>
      </section>
    </article>

  </main>

</template>

<script setup>
// import BackgroundSrc from '@/components/globals/BackgroundSrc.vue';
const from = 'auth-layout';


</script>

<style lang="scss" scoped>
</style>