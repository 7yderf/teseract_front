<template>
  <div class="field field--picker" :data-Type="data">

    <div class="input input__box input__box--time" :data-Type="data" :data-focus="isFocused" :data-error="isError"
      :data-empty="isEmpty">
      <FieldLabel :label="label" :data="data" :data-focus="isFocused || !isEmpty" :form-name="formName"
        :data-height="height" :data-withIcon="!!icon" />
      <Field v-slot="{ field, meta, value }" :name="name">
        <DatePicker ref="datePicker" autocomplete="off" cancel-text="Cancelar" select-text="Aceptar" v-bind="field"
          v-model="fieldValue" :readonly="readonly" :format="format" :value-type="valueType" :data-height="height"
          :locale="locale" @focus="onFocus()" @blur="onBlur(meta)" :id="`${label}-${formName}`"
          @update:modelValue="handleUpdate" />
        <span class="input__bullet" @click="listenerClick()" style="cursor: pointer;">
          <Icon :icon="'tabler:calendar'" width="1.4rem" height="1.4rem" />

        </span>
        <span :data-listener="listenerValue(value)" />
      </Field>
    </div>
    <ErrorMessage v-if="showError || submitValidateError" :name="name" class="input__text-danger" />
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, watch } from "vue";
import { Field, ErrorMessage } from "vee-validate";
import { Icon } from '@iconify/vue';
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import FieldLabel from '../others/FieldLabel.vue';
import { parse } from 'date-fns';


const props = defineProps({
  formName: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  data: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: 'yyyy-MM-dd HH:mm',
  },
  valueType: {
    type: String,
    default: 'format',
  },
  locale: {
    type: String,
    default: 'es',
  },
  defaultValue: {
    type: String,
    default: '',
  },
  reset: {
    type: Boolean,
    default: false,
  },
  submitValidate: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: 'medium',
  },
});

const datePicker = ref(null);
const fieldValue = ref(null);
const isFocused = ref(false);
const isEmpty = ref(true);
const isError = ref(false);
const showError = ref(0);
const submitValidateError = ref(false);

const listenerClick = () => {
  datePicker.value.openMenu();
};

const onFocus = () => {
  isFocused.value = true;
  ++showError.value
};

const onBlur = (val) => {
  isFocused.value = false;

};

function handleUpdate(value) {
  fieldValue.value = value;
}

const listenerValue = (val) => {
  isEmpty.value = !val;
  return !val;
};

watch(() => props.reset, (value) => {
  fieldValue.value = null;
  showError.value = 0;
  submitValidateError.value = false;
});

watch(() => props.submitValidate, (value) => {
  submitValidateError.value = true;
});

onMounted(() => {
  if (props.defaultValue) {
    // Convertir el valor por defecto a un objeto Date
    const parsedDate = parse(props.defaultValue, 'yyyy-MM-dd HH:mm', new Date());
    fieldValue.value = parsedDate;
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/inputs/Input.scss";

/* Estilos personalizados para DatePicker */
</style>
