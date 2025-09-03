<template>
  <div class="field" :data-Type="data">
    <div :id="`label-${label}-${formName}`" />
    <div class="input input__box"
      :data-Type="data"
      :data-focus="isFocused"
      :data-error="isError"
      :data-empty="isEmpty"
      :data-readOnly="readonly"
      @mouseleave="handleFocusOut"
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
      
      <div v-show="!!searchGlobal"
        class="file-list">
        <div class="file-item" />
        <Icon icon="ic:round-close"
          class="file-item-icon"
          @click="resetSearchInput"
        />
      </div>
      <div class="input__select-disabled"
        :data-disabled="readonly"
      />
      <Field v-slot="{ field, meta, errors, value }"
        :name="name" v-model="searchGlobal">
        <CustomInput v-bind="field"
          :label="label"
          :formName="formName"
          :icon="icon"
          :meta="meta"
          :errors="errors"
          :placeholder="placeholder"
          :type="type"
          :disabled="!isSearch"
          :searchGlobal="searchGlobal"
          :height="height"
          @focus="activateSearchMode"
          @blur="handleBlurEvent"
          @click="toggleTooltipAndFocus"
          @toggle="initializeSearchDataOnClick" />
        <span :data-listener="updateEmptyState(value)" />
      </Field>
      <Tooltip v-show="tooltipVisible"
        :data-Show="tooltipVisible"
        :keys-identify="keysIdentify"
        id="tooltip"
        :items="tooltipItems"
        @select="selectOption" />
    </div>
    <ErrorMessage :name="name"
      class="input__text-danger" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted } from "vue";
import { Field, ErrorMessage } from "vee-validate";

// Subcomponentes
import FieldLabel from './FieldLabel.vue';
import CustomInput from './CustomInput.vue';
import Tooltip from './Tooltip.vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
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
  selectInfo: {
    type: Array,
    default: () => [],
  },
  keysIdentify: {
    type: Object,
    default: () => ({
      id: 'id',
      name: 'name',
    }),
  },
  reset: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  setValue: {
    type: String,
    default: 'Selecione una opción',
  },
  defaultValue: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: 'medium',
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  labelAnimation: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['select']);

const initValueEdit = ref('');

const isFocused = ref(false);
const isEmpty = ref(true);
const isError = ref(false);

const searchGlobal = ref('');
const datosIniciales = ref([]);

/**
 * Maneja el evento de pérdida de foco en el componente.
 * Oculta el tooltip y actualiza el estado de enfoque.
 */
const handleFocusOut = () => {
  tooltipVisible.value = false;
  if (!props.isSearch) {
    isFocused.value = false;
  }
};

/**
 * Activa el modo de búsqueda al enfocar el componente.
 */
const activateSearchMode = () => {
  isFocused.value = true;
};

/**
 * Maneja el evento de desenfoque del componente, desactivando el estado de enfoque.
 */
const handleBlurEvent = () => {
  isFocused.value = false;
};

/**
 * Actualiza el valor seleccionado y emite el evento correspondiente.
 * También actualiza los datos iniciales si está en modo de búsqueda.
 */
const selectOption = value => {
  searchGlobal.value = value[props.keysIdentify.name] == props.setValue ? '' : value[props.keysIdentify.name];
  tooltipVisible.value = false;
  if (searchGlobal.value) {
    emits('select', value, props[props.keysIdentify.name]);
  }
  if (props.isSearch) {
    datosIniciales.value = props.selectInfo;
  }
};

/**
 * Filtra las opciones disponibles según la consulta de búsqueda.
 * @param {string} query - La consulta de búsqueda.
 * @param {Array} options - Las opciones disponibles.
 * @returns {Array} - Las opciones filtradas.
 */
const filterOptions = (query, options) => {
  return options.filter((item) =>
    item[props.keysIdentify.name].toLowerCase().includes(query.toLowerCase())
  );
};

// Uso en el observador
watch(() => searchGlobal.value, (val) => {
  if (props.isSearch) {
    datosIniciales.value = val ? filterOptions(val, props.selectInfo) : props.selectInfo;
  }
});

/**
 * Alterna la visibilidad del tooltip y activa el estado de enfoque.
 * También inicializa las opciones disponibles.
 */
const toggleTooltipAndFocus = () => {
  datosIniciales.value = props.selectInfo;
  tooltipVisible.value = !tooltipVisible.value;
  isFocused.value = true;
};

/**
 * Inicializa los datos de búsqueda al hacer clic.
 */
const initializeSearchDataOnClick = () => {
  toggleTooltipAndFocus();
};

/**
 * Limpia el valor del campo de búsqueda.
 */
const resetSearchInput = () => {
  console.log('clearInput');
  searchGlobal.value = '';
}

/**
 * Actualiza el estado de vacío basado en el valor proporcionado.
 */
const updateEmptyState = (val) => {
  isEmpty.value = !val;
  return !val;
};

// Tooltip
const tooltipVisible = ref(false);

const tooltipItems = computed(() => [{ [props.keysIdentify.name]: props.setValue, [props.keysIdentify.id]: '' }, ...datosIniciales.value]);

/**
 * Observa cambios en la propiedad `reset` y actualiza el valor de búsqueda según el valor predeterminado.
 */
watch(() => props.reset, () => {
  if (props.defaultValue) {
    searchGlobal.value = props.defaultValue;
  } else {
    searchGlobal.value = '';
  }
});

/**
 * Observa cambios en la lista de opciones y actualiza el valor de búsqueda si la lista está vacía.
 */
watch(() => props.selectInfo, () => {
  if (props.selectInfo.length === 0) {
    searchGlobal.value = '';
  }
});

/**
 * Observa cambios en el valor predeterminado y actualiza el campo de búsqueda.
 */
watch(() => props.defaultValue, () => {
  searchGlobal.value = props.defaultValue;
});

/**
 * Configuración inicial al montar el componente.
 */
onMounted(() => {
  if (props.defaultValue) {
    searchGlobal.value = props.defaultValue;
    initValueEdit.value = props.defaultValue;
  }
});
</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom/Input.scss";

.file-list {
  position: absolute;
  //width: 100%;
  top: 0;
  //left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding-left: 16px;
  padding-right: 40px;
  z-index: 2;

  .file-item {
    margin-bottom: 0.2rem;
  }
}

.input__select-disabled {
  &[data-disabled="true"] {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #00000000;
    z-index: 3;
  }
}

#tooltip {
  border-radius: 5px;
  box-shadow: 0px 0px 5px #999;
}
</style>