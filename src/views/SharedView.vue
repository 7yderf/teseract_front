<template>


  <div class="w-full max-w-[1200px] mx-auto mt-15">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-[3.2rem] font-bold">Documentos compartidos </h2>
      </div>
    <SharedTable
     v-if="!isLoading && !isError && shared.length > 0"
    :style="route.params.id ? 'margin-top:3rem' : 'mt-5'"
    :companies="shared"
    :getPage="getPage"
    :load-with-sort="refetchShared"
    :onDownload="handleDownload"
    :is-downloading="isDownloading"
  />

  <div
    v-if="!isLoading && !isError && shared.length > 0"
    class="flex justify-between pt-5">
    <TablePerpage
    :per-page="perPage"
    :getPage="getPage"
    :setPerPage="setPerPage"
    :total="total"
  />

  <TablePaginator
    :currentPage="currentPage"
    :from="from"
    :lastPage="lastPage"
    :perPage="perPage"
    :to="to"
    :total="total"
    :getPage="getPage"
  />
  </div>
  <!-- no data -->
  <NoData
  v-if="!isLoading && shared.length === 0"
  :description="`Aquí se enlistarán tus documentos compartidos`"
  :icon="'tabler:clipboard-plus'"
  />
  </div>
  
  
</template>

<script  setup lang="ts">
import { ref } from 'vue';
import SharedTable from "@/modules/shared/components/SharedTable.vue";
import TablePaginator from '@/components/shared/VPaginator.vue';
import TablePerpage from '@/components/shared/VPerPageSelector.vue';
import useShared from '@/modules/shared/composables/useShared';
import NoData from "@/components/shared/NoData.vue";
import { useDocument } from '@/modules/documents/composables/useDocument';
import { useRoute } from 'vue-router';
import { showAlert } from '@/composables/useAlerts';


const route = useRoute();

const {
  // #region::Pagination
  currentPage,
  from,
  lastPage,
  perPage,
  to,
  total,
  // #endregion::Pagination

  // #region::Documents requests state
  isLoading,
  isError,
  error,
  // #endregion::Documents requests state

  // #region::Documents data
  getPage,
  setPerPage,
  shared,
  refetchShared
} = useShared();


// Estado local
const showUploadModal = ref(false);
const isDownloading = ref(false);

// Composable de documentos
const { downloadAndDecryptDocument } = useDocument();

// Método para manejar la descarga
const handleDownload = async (documentId: number) => {

  try {
    isDownloading.value = true;
    
    // Usar el nuevo método que hace la petición al servicio
    await downloadAndDecryptDocument(documentId);
    showAlert('success', 'Documento descargado exitosamente');
  } catch (error) {
    console.error('Error al descargar:', error);
    showAlert('error', error instanceof Error ? error.message : 'Error al descargar el documento');
  } finally {
    isDownloading.value = false;
  }
};


// onMounted(() => {});
// onUnmounted(() => {});

</script>
<style lang="scss" scoped>

</style>
