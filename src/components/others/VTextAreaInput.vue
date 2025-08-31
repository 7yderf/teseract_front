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

      <span class="input__bullet">
        <Icon v-if="!!icon"
          :icon="icon"
          width="1.4rem"
          height="1.4rem" />
      </span>

      <Field v-slot="{ field, meta, value }" :name="name">
        <textarea v-bind="field"
          :id="`${label}-${formName}`"
          :data-height="height"
          class="input__input input__area"
          :class="{
            'is-success': meta.valid && meta.touched,
            'is-danger': !meta.valid && meta.touched,
          }"
          rows="4"
          :placeholder="placeholder"
          :type="type"
          :readonly="readonly"
          @focus="onFocus()"
          @blur="onBlur()" />
      </Field>
    </div>
    <ErrorMessage :name="name" class="input__text-danger" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, onMounted } from "vue";
import { Field, ErrorMessage } from "vee-validate";
import { Icon } from '@iconify/vue';
import FieldLabel from './FieldLabel.vue';

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
const isFocused = ref(false)
const isEmpty = ref(true)
const isError = ref(false)

const onFocus = () => {
  isFocused.value = true
}

const onBlur = () => {
  isFocused.value = false
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom/Input.scss";
</style>
