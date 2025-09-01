<script setup lang="ts">
import { defineProps, ref } from 'vue';

interface Props {
  perPage: number;
  getPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  total: number;
}

const props = defineProps<Props>();


const perPage = ref(props.perPage);

const setItemsPerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  props.getPage(1);
  props.setPerPage(+value);
  console.log(value);
};
</script>
<template>
  <div class="custom-table__perpage">
    <strong>Ver</strong>
    <label>
      <select
        name="kt_customers_table_length"
        class="custom-table__perpage-label form-select form-select-sm form-select-solid"
        v-model="perPage"
        @change="setItemsPerPage($event)"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </label>
    <strong>por página</strong>
  </div>
</template>
<style lang="scss" scoped>
.custom-table{
  &__perpage {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: right;
    justify-content: md-start;
  }
  &__perpage-label{
    border: 1px solid #d2d6e5;
    background-color: #ffffff;
  }
}
</style>