<template>


  <div class="w-full max-w-[1200px] mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Documentos Seguros</h2>
        <button
          @click="showUploadModal = true"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <span class="mr-2">Subir Documento</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    <DocsTable
     v-if="!isLoading && !isError && docs.length > 0"
    :style="route.params.id ? 'margin-top:3rem' : 'mt-5'"
    :companies="docs"
    :getPage="getPage"
    :load-with-sort="refetchDocs"
  />

  <div
    v-if="!isLoading && !isError && docs.length > 0"
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
  v-if="!isLoading && docs.length === 0"
  :description="`Aquí se enlistarán tus documentos`"
  :icon="'tabler:clipboard-plus'"
  />
  </div>
  <VDocumentUploader
    v-model:is-open="showUploadModal"
    :is-uploading="isUploading"
    @upload="handleDocumentUpload"
  />
  
</template>

<script  setup lang="ts">
import { ref } from 'vue';
import DocsTable from "../modules/documents/components/DocsTable.vue";
import TablePaginator from '@/components/shared/VPaginator.vue';
import TablePerpage from '@/components/shared/VPerPageSelector.vue';
import useCompanies from '../modules/documents/composables/useDocs';
import NoData from "@/components/shared/NoData.vue";
import VDocumentUploader from '@/components/shared/VDocumentUploader.vue';
import { useDocument } from '@/modules/documents/composables/useDocument';
import { useRoute } from 'vue-router';


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
  docs,
  refetchDocs
} = useCompanies();
  console.log('🚀 ~ docs:', docs.value)


// Estado local
const showUploadModal = ref(false);

// Composable de documentos
const { upload, encryptFile, isUploading } = useDocument();

// Métodos
const handleDocumentUpload = async (file: File, name: string) => {
  try {
    // Cifrar el archivo
    const encryptedData = await encryptFile(file);
    
    // Personalizar el nombre si es diferente al nombre del archivo
    if (name !== file.name) {
      encryptedData.name = name;
    }
    
    // Subir el documento
    await upload(encryptedData);
    
    // Cerrar modal y refrescar lista
    showUploadModal.value = false;
    refetchDocs();
  } catch (error) {
    console.error('Error al subir el documento:', error);
  }
};

// onMounted(() => {});
// onUnmounted(() => {});

</script>
<style lang="scss" scoped>

</style>
