<template>
  <main class="w-full h-screen bg-gray-100">
    <article class="flex  flex-col-reverse md:flex-row h-full">
      <section class="p-8 w-full md:w-[500px]  m-auto">
        <div class="max-w-lg mx-auto p-4 border rounded-md">
          <router-view />
        </div>
      </section>
      <section class="max-h-[100px] md:max-h-full flex items-center justify-center grow-1 bg-white">
        <!-- <BackgroundSrc
        :class="from"
        :imgSrc="'/branding/logo-V-dental.png'"
        :position="'center'"
        /> -->

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