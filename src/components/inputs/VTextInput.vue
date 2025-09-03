<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="field" :data-Type="data">
    <div :id="`label-${label}-${formName}`" />
    <div class="input input__box"
      :data-Type="data"
      :data-focus="isFocused"
      :data-error="isError"
      :data-empty="isEmpty"
      :data-readOnly="readonly"
    >
      <Teleport :disabled="labelAnimation" :to="`#label-${label}-${formName}`">
        <FieldLabel 
          :label="label"
          :data="data"
          :data-focus="isFocused || !isEmpty"
          :form-name="formName"
          :data-height="height"
          :data-withIcon="!!icon"
          :data-label="labelAnimation"
        />
      </Teleport>

      <span class="input__bullet" @click="clickIcon()">
        <Icon v-if="!!icon"
          :icon="icon"
          width="1.4rem"
          height="1.4rem" />
      </span>

      <Field v-slot="{ field, meta, value }" :name="name">
        <input v-bind="field"
          :id="`${label}-${formName}`" 
          class="input__input border-none"
          :data-height="height"
          :class="{
            'is-success': meta.valid && meta.touched,
            'is-danger': !meta.valid && meta.touched,
          }"
          :placeholder="placeholder"
          :type="type" :readonly="readonly"
          :value="currency ? value : value"
          :autocomplete="type === 'password' ? 'new-password' : 'true'" 
          @focus="onFocus()"
          @blur="onBlur()"
        />
        <span v-if="!readonly" class="flex">
          <!-- <span
            v-if="meta.valid && meta.touched"
            class="input__check-success"
          >
            <Icon
              name="carbon:add-alt"
              width="1.5rem"
              height="1.5rem"
            />
          </span>
          <span
            v-else-if="!meta.valid && meta.touched"
            class="input__check-danger"
          >
            <Icon
              name="carbon:add-alt"
              width="1.5rem"
              height="1.5rem"
            />
          </span> -->
          <span v-if="password && (type === 'text')" 
            class="input__hide-pass"
            @click="showPassword('hide', name)">
            <!-- Ocultar -->
            <Icon icon="iconamoon:eye-off-thin"
              width="1.5rem"
              height="1.5rem"
              style="color: black"
            />
          </span>
          <span v-if="password && (type === 'password')" 
            class="input__show-pass"
            @click="showPassword('show', name)"
          >
            <!-- Mostrar -->
            <Icon icon="ph:eye-thin"
              width="1.5rem"
              height="1.5rem"
              style="color: black"
            />
          </span>
        </span>
        <span :data-listener="listenerValue(value)" />
      </Field>
    </div>
    <ErrorMessage :name="name" class="input__text-danger" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { Field, ErrorMessage } from "vee-validate";
import { Icon } from '@iconify/vue';
import FieldLabel from './FieldLabel.vue';
// import { formatCurrency } from '@/composables/useForm.ts'
// import { formatCurrency } from '@/modules/composables/useForm'
// formatCurrency(value)

defineProps({
  formName: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  data: {
    type: String,
    default: '',
  },
  password: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: 'medium',
  },
  listenerClick: {
    type: Boolean,
    default: false,
  },
  labelAnimation: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['showPassword', 'iconClick'])
const isFocused = ref(false)
const isEmpty = ref(true)
const isError = ref(false)

const onFocus = () => {
  isFocused.value = true
}

const onBlur = () => {
  isFocused.value = false
}
const showPassword = (type: string, name: string) => {
  emit('showPassword', type, name)
}
const listenerValue = (val: any) => {
  isEmpty.value = !val
  return !val
}
const clickIcon = () => {
  emit('iconClick', 'hola')
}


</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom/Input.scss";
</style>
