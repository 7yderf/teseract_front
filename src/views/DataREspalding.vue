<template>
  <main class="main w-100">
    <div class="container mx-auto px-4 py-8">
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

      <!-- Lista de documentos (implementaremos después) -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-center">Carga tu primer documento seguro</p>
      </div>
    </div>

    <!-- Modal de carga de documentos -->
    <BaseModal :show="showUploadModal" @close="closeUploadModal">
      <div class="upload-modal">
        <h3 class="text-xl font-bold mb-4">Subir Documento Seguro</h3>
        
        <form @submit.prevent="handleUpload" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del documento
            </label>
            <input
              v-model="documentName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="selectedFile?.name || 'Nombre del documento'"
              :disabled="isUploading"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar archivo
            </label>
            <input
              type="file"
              @change="handleFileSelect"
              class="w-full"
              :disabled="isUploading"
            >
            <p class="mt-1 text-sm text-gray-500">
              El archivo será cifrado antes de subirse al servidor
            </p>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeUploadModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              :disabled="isUploading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="!canUpload || isUploading"
            >
              <template v-if="isUploading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cifrando y subiendo...
              </template>
              <template v-else>
                Subir documento
              </template>
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import { useDocuments } from '@/modules/documents/composables/useDocuments';

// Estado local
const showUploadModal = ref(false);
const documentName = ref('');
const selectedFile = ref<File | null>(null);

// Composable de documentos
const { upload, encryptFile, isUploading } = useDocuments();

// Computed properties
const canUpload = computed(() => {
  return selectedFile.value && documentName.value.trim();
});

// Métodos
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    // Si no hay nombre especificado, usar el nombre del archivo
    if (!documentName.value) {
      documentName.value = selectedFile.value.name;
    }
  }
};

const handleUpload = async () => {
  if (!selectedFile.value || !documentName.value) return;

  try {
    // Cifrar el archivo
    const encryptedData = await encryptFile(selectedFile.value);
    
    // Personalizar el nombre si es diferente al nombre del archivo
    if (documentName.value !== selectedFile.value.name) {
      encryptedData.name = documentName.value;
    }
    
    // Subir el documento
    await upload(encryptedData);
    
    // Cerrar modal y limpiar formulario
    closeUploadModal();
    
  } catch (error) {
    console.error('Error al subir el documento:', error);
  }
};

const closeUploadModal = () => {
  showUploadModal.value = false;
  documentName.value = '';
  selectedFile.value = null;
  // Limpiar input file
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};
</script>