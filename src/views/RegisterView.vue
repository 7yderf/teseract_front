<template>
  <main class="">
    <h4 class="text-center">Bienvenido</h4>
    <Register>
      <template #register>
        <router-link class="font-semibold" to="/">
          Regresar e iniciar sesión
        </router-link>
        <!-- Importante: nota para el usuario, infromando que despues del registro se enviara a su correo una token que devera guardar y no compartir pues es la llave para poder decargar documentos y acceder a ellos de forma segura -->
        <p class="text-lg text-gray-600 mt-2">Nota: Después de registrarte, recibirás un correo con un token. Guarda este token en un lugar seguro, ya que lo necesitarás para descargar y acceder a tus documentos de forma segura.
        </p>
      </template>
    </Register>
  </main>
</template>
<script setup>
import Register from '@/modules/login/components/Register.vue';
</script>
