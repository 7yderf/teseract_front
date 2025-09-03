import { defineStore } from "pinia";
import { ref } from "vue";

export const useStoreShared = defineStore("shared", () => {
  const currentPage = ref<number>(1);
  const from = ref<number>(1);
  const lastPage = ref<number>(1);
  const perPage = ref<number>(10);
  const to = ref<number>(1);
  const total = ref<number>(1);
  
  const sortQuery = ref<string>('name');
  const shared = ref<any[]>([]);

  const filtesParams = ref<any>('');
  // end-filters


  return {
    currentPage,
    from,
    lastPage,
    perPage,
    to,
    total,
    shared,
    sortQuery,
    filtesParams,

    idShared: ref<any>(null),


    setCurrentPage(page: number) {
      currentPage.value = page;
    },

    setFrom(value: number) {
      from.value = value;
    },

    setLastPage(value: number) {
      lastPage.value = value;
    },

    setPerPage(value: number) {
      perPage.value = value;
    },

    setTo(value: number) {
      to.value = value;
    },

    setTotal(value: number) {
      total.value = value;
    },

    setShared(value: any[]) {
      shared.value = value;
    },
    
    
  };
});