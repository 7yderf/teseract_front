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
      <slot name="register" />
      <div class="w-full pt-8">
        <button type="submit" class="btn-primary">
          Iniciar Sesión
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, markRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, Form } from 'vee-validate'
import Loader from '@/components/shared/Loader.vue';
import { FormVTextInput } from '@/components/others';
import  useAuth  from '@/modules/login/composables/useAuth';
import { schema as validationSchema } from '@/modules/login/schemas/validationSchemas';

const {
  login,
  formValuesAuth,
  isUpdating
} = useAuth()

const schema = ref(markRaw(validationSchema()));
const router = useRouter()
const load = ref(false)

const typeActivePassword = ref<{ password: boolean }>({ password: true });

const showPass = (type: "", name: 'password') => {
  typeActivePassword.value = {
    ...typeActivePassword.value,
    [name]: !typeActivePassword.value[name]
  };
};

const onSubmit = async (values: any, { resetForm }: any) => {

  login({
    data: {
      type: "auth",
      attributes: values,
    }
  })
}

watch(
  () => isUpdating.value,
  (newValue) => {
    load.value = newValue;
  }
);

onMounted(async () => { })

</script>

