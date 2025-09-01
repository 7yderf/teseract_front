import { computed, watch } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import ApiService from "@/core/services/ApiService";
import { storeToRefs } from "pinia";
import { useStoreDocs } from "../store/StoreDocs";
import CryptoJS from 'crypto-js';
import { showAlert } from '@/composables/useAlerts';


const getDocuments = async ( perPage:any, currentPage:any ): Promise<any> => {

  const { data } = await ApiService.get(`/documents/own?page=${currentPage}&per_page=${perPage}&order=asc`);
    return data;
};

const useDocs = () => {
  const store = useStoreDocs();
  const queryClient = useQueryClient();
  const { currentPage, from, lastPage, perPage, to, total, sortQuery, docs, filtesParams } =
    storeToRefs(store);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["page[size]", perPage, "page[number]=", currentPage, "sort=", sortQuery, "filters=", filtesParams],
    queryFn: () => getDocuments(perPage.value, currentPage.value),
    retry: 3,
    retryDelay: 1000,
  });

  watch(error, (newError ) => {
    if(newError){
      console.log('🚀 ~ useDocs ~ newError:', newError)
    }
  })

  watch(data, (docsListResponse) => {
    if (docsListResponse) {
      const { meta, data } = docsListResponse as any;
      const { data:docs, pagination } = data.attributes;
      console.log('🚀 ~ useDocs ~ docs:', docs)

      const { current_page, from, last_page, per_page, to, total } = pagination;

      store.setCurrentPage(+current_page);
      store.setFrom(+from);
      store.setLastPage(+last_page);
      store.setPerPage(+per_page);
      store.setTo(+to);
      store.setTotal(+total);
      store.setDocs(docs);
    }
  });

  // Método para recargar los datos
  const refetchDocs = async () => {
    await queryClient.invalidateQueries({ queryKey: ["page[size]"] });
  };

  return {
    // Properties
    error,
    isError,
    isLoading,

    currentPage,
    from,
    lastPage,
    perPage,
    to,
    total,
    docs,
    filtesParams,
   
  
    // Methods
    getPage: store.setCurrentPage,
    setPerPage: store.setPerPage,
    // recargar la data cuando se crea un nuevo usuario
    refetchDocs,
    //filters
    
    // Permissions
    
  };
};

export default useDocs;