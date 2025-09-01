<template>
  <ul class="pagination">
    <!-- Botón para ir a la primera página -->
    <li
      class="page-item"
      :class="{ disabled: currentPage === 1 }"
      @click="currentPage !== 1 && getPage(1)"
    >
      <a href="#" class="page-link">«</a>
    </li>

    <!-- Botón para ir a la página anterior -->
    <li
      class="page-item previous"
      :class="{ disabled: currentPage === 1 }"
      @click="currentPage !== 1 && getPage(currentPage - 1)"
    >
      <a href="#" class="page-link">‹</a>
    </li>

    <!-- Mostrar el primer número de página -->
    <li
      v-if="showStartEllipsis"
      class="page-item"
      @click="getPage(1)"
      :class="{ active: currentPage === 1 }"
    >
      <a href="#" class="page-link">1</a>
    </li>

    <!-- Mostrar puntos suspensivos antes del grupo de páginas -->
    <li v-if="showStartEllipsis" class="page-item disabled">
      <a href="#" class="page-link">...</a>
    </li>

    <!-- Números de página dinámicos -->
    <li
      v-for="number in visiblePageNumbers"
      :key="number"
      class="page-item"
      :class="{ active: currentPage === number }"
      @click="getPage(number)"
    >
      <a href="#" class="page-link">{{ number }}</a>
    </li>

    <!-- Mostrar puntos suspensivos después del grupo de páginas -->
    <li v-if="showEndEllipsis" class="page-item disabled">
      <a href="#" class="page-link">...</a>
    </li>

    <!-- Mostrar el último número de página -->
    <li
      v-if="showEndEllipsis"
      class="page-item"
      @click="getPage(lastPage)"
      :class="{ active: currentPage === lastPage }"
    >
      <a href="#" class="page-link">{{ lastPage }}</a>
    </li>

    <!-- Botón para ir a la página siguiente -->
    <li
      class="page-item next"
      :class="{ disabled: currentPage === lastPage }"
      @click="currentPage !== lastPage && getPage(currentPage + 1)"
    >
      <a href="#" class="page-link">›</a>
    </li>

    <!-- Botón para ir a la última página -->
    <li
      class="page-item"
      :class="{ disabled: currentPage === lastPage }"
      @click="currentPage !== lastPage && getPage(lastPage)"
    >
      <a href="#" class="page-link">»</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';

interface Props {
  currentPage: number;
  from: number;
  lastPage: number;
  perPage: number;
  to: number;
  total: number;
  getPage: (page: number) => void;
}

const props = defineProps<Props>();

const currentPage = toRef(props, 'currentPage');
const lastPage = toRef(props, 'lastPage');

const maxVisiblePages = 5; // Máximo número de páginas visibles
const visiblePageNumbers = computed(() => {
  const pages: number[] = [];

  const startPage = Math.max(1, currentPage.value - 2);
  const endPage = Math.min(lastPage.value, currentPage.value + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Mostrar puntos suspensivos y primera página
const showStartEllipsis = computed(() => currentPage.value > 3);

// Mostrar puntos suspensivos y última página
const showEndEllipsis = computed(() => currentPage.value < lastPage.value - 2);

</script>

<style scoped>
/* Puedes añadir estilos personalizados para mejorar la presentación */
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
  color: #6c757d;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.page-item.disabled .page-link:hover,
.page-item.active .page-link:hover {
  background-color: #007bff;
}
</style>
