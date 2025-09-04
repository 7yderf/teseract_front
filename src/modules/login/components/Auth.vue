<template>
  <Loader v-if="load" />
  <div>
    <Form class="w-full flex flex-col items-center gap-4"
      :validation-schema="schema"
      :initial-values="formValuesAuth"
      @submit="onSubmit"
    >
      <div class="flex flex-col gap-4 w-full">
        <FormVTextInput
          type="mail"
          name="email"
          label="Correo"
          placeholder=""
          :icon="'mdi:email'"
          :is-font-black="true"
          height="thin"
          :label-animation="true"
        />
      </div>
      <div class="flex flex-col gap-4 w-full">
        <FormVTextInput
          :type="typeActivePassword['password'] ? 'password' : 'text'"
          name="password"
          label="Contraseña"
          height="thin"
          :icon="'mdi:lock'"
          :is-font-black="true"
          :password="true"
          @showPassword="showPass"
          :label-animation="true"
        />
      </div>
      <div class="flex flex-col gap-4 w-full">
        <FormVTextInput
          :type="typeActivePassword['private'] ? 'password' : 'text'"
          name="private"
          label="Clave Privada"
          height="thin"
          :icon="'mdi:lock'"
          :is-font-black="true"
          :password="true"
          @showPassword="showPass"
          :label-animation="true"
        />
      </div>
      <slot name="register" />
      <div class="w-full pt-8">
        <button type="submit" class=" w-full text-white font-semibold rounded-md bg-sky-500/75 px-4 py-2 hover:bg-sky-500 focus:outline-none">
          Iniciar Sesión
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, markRaw, watch } from 'vue'
import { Form } from 'vee-validate'
import Loader from '@/components/shared/Loader.vue';
import { FormVTextInput } from '@/components/inputs';
import  useAuth  from '@/modules/login/composables/useAuth';
import { schema as validationSchema } from '@/modules/login/schemas/validationSchemas';
import JwtService from '@/core/services/JwtService';

const {
  login,
  formValuesAuth,
  isUpdating,
  isSuccess
} = useAuth()

const privateK = ref('')
const schema = ref(markRaw(validationSchema()));
const load = ref(false)

const typeActivePassword = ref({
  password: true,
  private: true
})

const showPass = (type:any, name: 'password' | 'private') => {
  console.log('🚀 ~ showPass ~ type:', type)
  typeActivePassword.value = {
    ...typeActivePassword.value,
    [name]: !typeActivePassword.value[name]
  };
};

const onSubmit = async (values: any) => {
  const { private: privateKey, ...rest } = values;
  privateK.value = privateKey;
  login({
    data: {
      type: "auth",
      attributes: {
        ...rest,
      },
    }
  })
}

watch(
  () => isUpdating.value,
  (newValue) => {
    load.value = newValue;
  }
);
watch(
  () => isSuccess.value,
  (newValue) => {
    if (newValue) {
      JwtService.encryptPrivateKey(privateK.value.trim());
    }
  }
);

onMounted(async () => { })

</script>

