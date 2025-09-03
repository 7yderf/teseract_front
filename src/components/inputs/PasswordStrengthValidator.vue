<template>
  <div class="mb-10">
    <div class="row my-2">
      <div class="flex justify-around">
        <div class="col text-center fw-bolder relative">
        <p class="check__font">T</p>
        <span 
          v-if="checks.mayus"
          class="check__content"
        >
          <Icon 
            icon="marketeq:check-double" 
            width="2.5rem" 
            height="2.5rem" 
            :class="'success'"
          />
        </span>
      </div>
      <div class="col text-center fw-bolder relative">
        <p class="check__font">t</p>
        <span 
          v-if="checks.minus"
          class="check__content"
        >
          <Icon 
            icon="marketeq:check-double" 
            width="2.5rem" 
            height="2.5rem" 
            :class="'success'"
          />
        </span>
      </div>
      <div class="col text-center fw-bolder relative">
        <p class="check__font">1</p>
        <span
          v-if="checks.number"
          class="check__content"
        >
          <Icon 
            icon="marketeq:check-double" 
            width="2.5rem" 
            height="2.5rem" 
            :class="'success'"
          />
        </span>
      </div>
      <div class="col text-center fw-bolder relative">
        <p class="check__font">!</p>
        <span
          v-if="checks.special"
          class="check__content"
        >
          <Icon 
            icon="marketeq:check-double" 
            width="2.5rem" 
            height="2.5rem" 
            :class="'success'"
          />
        </span>
      </div>
      <div class="col text-center fw-bolder relative">
        <p class="check__font">+{{ characters }}</p>
        <span
          v-if="checks.min"
          class="check__content"
        >
          <Icon 
            icon="marketeq:check-double" 
            width="2.5rem" 
            height="2.5rem" 
            :class="'success'"
          />
        </span>
      </div>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Al menos una mayúscula, una minúscula, un número, un símbolo y {{ characters }} caracteres.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  password?: string
  minCharacters?: number
  resetTrigger?: boolean
}

interface Emits {
  (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  password: '',
  minCharacters: 8,
  resetTrigger: false
})

const emits = defineEmits<Emits>()

const characters = ref(props.minCharacters)

const checks = ref({
  minus: false,
  mayus: false,
  special: false,
  number: false,
  min: false,
})

const checkPassword = (password: string) => {
  checks.value = {
    minus: /[a-z]/.test(password),
    mayus: /[A-Z]/.test(password),
    special: /[_.@$!%*?&#]/.test(password),
    number: /\d/.test(password),
    min: password.length >= characters.value,
  }
  
  // Emitir si todas las validaciones pasan
  const isValid = Object.values(checks.value).every(check => check)
  emits('validation-change', isValid)
}

// Observar cambios en la contraseña
watch(
  () => props.password,
  (newPassword) => {
    checkPassword(newPassword)
  },
  { immediate: true }
)

// Observar el trigger de reset
watch(
  () => props.resetTrigger,
  (shouldReset) => {
    if (shouldReset) {
      checks.value = {
        minus: false,
        mayus: false,
        special: false,
        number: false,
        min: false,
      }
    }
  }
)

// Función para validar desde el componente padre
const validatePassword = (password: string) => {
  checkPassword(password)
}

// Exponer la función para uso externo
defineExpose({
  validatePassword,
  checks
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/Mixins";

.success {
  color: #03a303;
}

.check {
  &__content {
    position: absolute;
    top: 0;
    left: 60%;
  }
  
  &__font {
    @include text(2rem, 600, 2.8rem, center);
  }
  
}
</style>
