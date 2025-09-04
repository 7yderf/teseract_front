<template>
  <Loader
    v-if="load" 
  />
  <div>
    <Form
      class="w-full flex flex-col items-center gap-4"
      :validation-schema="schema"
      :initial-values="formValues"
      @submit="onSubmit"
    >
      <div class="flex flex-col gap-4 w-full">
        <!-- <FormVTextInput
          type="text"
          name="name"
          label="Nombre"
          placeholder=""
          :icon="'mdi:email'"
          :is-font-black="true"
          height="thin"
          :label-animation="true"
        /> -->
      </div>
      <div class="flex flex-col gap-4 w-full">
        <FormVTextInput
          type="mail"
          name="email"
          label="Correo Electrónico"
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
          placeholder=""
          @input="checkTerms"
          :password="true"
          @showPassword="showPass"
          :label-animation="true"
        />
      </div>
      <div class="flex flex-col gap-4 w-full">
        <FormVTextInput
          :type="typeActivePassword['confirm_password'] ? 'password' : 'text'"
          name="confirm_password"
          label="Confirmar contraseña"
          height="thin"
          :icon="'mdi:lock'"
          :is-font-black="true"
          placeholder=""
          :password="true"
          @showPassword="showPass"
          :label-animation="true"
        />
      </div>
      <PasswordStrengthValidator 
        :password="passwordValue"
        :min-characters="8"
        :reset-trigger="back"
        @validation-change="onPasswordValidationChange"
      />
      <slot name="register" />
      <div
        class="form__submit"
        type="submit"
      >
        <button
          type="submit"
          class=" w-full text-white font-semibold rounded-md bg-sky-500/75 px-4 py-2 hover:bg-sky-500 focus:outline-none"
        >
          Guardar
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, markRaw, watch, defineEmits } from 'vue'
import { Form } from 'vee-validate'
import { FormVTextInput, PasswordStrengthValidator } from '@/components/inputs';
import Loader from '@/components/shared/Loader.vue';
import { schema as validationSchema } from '@/modules/login/schemas/registerValidation';
import useAuth from '@/modules/login/composables/useAuth';

defineProps<{
  redirect?: string
}>()

const { register, isUpdating } = useAuth()

defineEmits<{
  success: []
}>()

const load = ref(false)
const back = ref(false)
const passwordValue = ref('')
const isPasswordValid = ref(false)

const typeActivePassword = ref({
  password: true,
  confirm_password: true,
})

const showPass = (type:any, name: keyof typeof typeActivePassword.value) => {
  console.log('🚀 ~ showPass ~ type:', type)
  typeActivePassword.value = {
    ...typeActivePassword.value,
    [name]: !typeActivePassword.value[name]
  };
};

const onPasswordValidationChange = (isValid: boolean) => {
  isPasswordValid.value = isValid
}

const checkTerms = (val: Event) => {
  const target = val.target as HTMLInputElement
  passwordValue.value = target.value
}

const formValues = ref({
  // name: '',
  email: '',
  password: '',
  confirm_password: '',
})

const characters = ref(8)
const regex = ref<RegExp>(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[_.@$!%*?&#])[A-Za-z\\d@$!%*?&_.#]+$"))

const schema = markRaw(
  validationSchema({
    characters: characters.value,
    regex: regex.value
  })
)

watch(
  () => back.value,
  () => {
    passwordValue.value = ''
  }
)

const onSubmit = async (values: any) => {
  register({
    data: {
      type: "users",
      attributes: {
        ...values,
        role: 3,
        confirmation: false
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

onMounted(async () => {})

</script>
<style lang="scss" scoped>
@import "@/assets/scss/Mixins";
.form{
  &__box{
    @include flex(space-between, 16px, center);
  }
  &__submit{
    width: 100%;
    padding-top: 32px;
  }
  &__submit-btn{
    @include button(solid, 32px);
    max-width: inherit;
    width: 100%;
    padding: 8px;
  }
  &__text{
    @include text(2.4rem, 400, 2.8rem, left);
    margin: 16px 0 32px;
  }
}

@media screen and (max-width: 768px) {
  .form{
    &__box{
      &--mobile{
        flex-direction: column ;
        gap: 0;
        .field{
          width: 100%;
        }
      }
    }
  }
}
</style>
