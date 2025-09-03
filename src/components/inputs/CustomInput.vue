<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="input__box--select">
    <span class="input__bullet">
      <Icon
        v-if="icon"
        :icon="icon"
        width="2rem"
        height="2rem"
      />
    </span>
    <input
      v-bind="field"
      :id="`${label}-${formName}`"
      class="input__input input__input--select"
      :class="{ 'is-success': meta.valid && meta.touched, 'is-danger': !meta.valid && meta.touched }"
      :placeholder="placeholder"
      :type="type"
      autocomplete="off"
      :data-search="true"
      :data-height="height"
      :readonly="disabled"
      :value="searchGlobal"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @click="$emit('click')"
    />
    <span
      class="input__check--select click"
      tabindex="0"
      role="button"
      @click="$emit('toggle')"
      @keydown.enter="$emit('toggle')"
    >
      <Icon
        icon="carbon:chevron-down"
        width="1.5rem"
        height="1.5rem"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Icon } from '@iconify/vue';

defineProps({
  field: {
    type: Object,
    default: () => ({}),
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
  errors: {
    type: Array,
    default: () => [],
  },
  icon: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  searchGlobal: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: 'medium',
  },
  formName: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },

})

defineEmits(['focus', 'blur', 'click', 'toggle'])
</script>

<style lang="scss" scoped>
@import "@/assets/scss/Inputs/Input.scss";

.click{
  cursor: pointer;
}

.input__box--select{
  @include flex;
  width: 100%;
}

</style>
