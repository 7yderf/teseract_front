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
    :onShare="handleShare"
    :is-sharing="isSharing"
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
import ApiService from '@/core/services/ApiService';


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
const { upload, encryptFile, isUploading, share, isSharing } = useDocument();

// Métodos
import { showAlert } from '@/composables/useAlerts';

const handleShare = async (documentId: number, documentName: string, email: string) => {
  try {
    console.log('Intentando compartir documento:', { documentId, documentName, email });
    
    // 1. Obtener la llave pública del usuario destino
    const { data } = await ApiService.get(`/users/public-key?email=${encodeURIComponent(email)}`);
    console.log('🚀 ~ handleShare ~ response:', data.data.attributes.public_key)
    const destinationPublicKey = data.data.attributes.public_key;
    
    if (!destinationPublicKey) {
      throw new Error('No se pudo obtener la llave pública del usuario destino');
    }

    // 2. Obtener la clave AES cifrada del documento
    const doc = docs.value.find(d => d.id === documentId);
    console.log('🚀 ~ handleShare ~ doc:', doc)
    if (!doc?.encrypted_key) {
      throw new Error('No se encontró la clave del documento');
    }

    // 3. Descifrar la clave AES con nuestra llave privada
    const privateKey = localStorage.getItem('private_key');
    if (!privateKey) {
      throw new Error('No se encontró tu llave privada');
    }

    // Imprimir valores para debug
    console.log('Clave original:', doc.encrypted_key);
    console.log('Clave privada:', privateKey);
    
    // Verificar que tenemos la clave encriptada
    if (!doc.encrypted_key) {
      console.error('La clave encriptada es undefined o null');
      throw new Error('No se encontró la clave encriptada del documento');
    }

    // Asegurarse de que la clave está en formato base64 válido
    const cleanedKey = doc.encrypted_key.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - cleanedKey.length % 4) % 4);
    const base64Key = cleanedKey + padding;
    
    console.log('Clave limpia:', cleanedKey);
    console.log('Clave con padding:', base64Key);

    let encryptedKeyBuffer;
    let importedPrivateKey;

    try {
      // Primero intentar importar la llave privada
      const privateKeyBuffer = Uint8Array.from(atob(privateKey), c => c.charCodeAt(0));
      importedPrivateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true, // extractable a true para debug
        ["decrypt"]
      );
      
      console.log('Llave privada importada correctamente');

      // Luego intentar decodificar la clave del documento
      encryptedKeyBuffer = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
      console.log('Clave del documento decodificada correctamente');
      
    } catch (error) {
      console.error('Error detallado:', error);
      if (error instanceof Error) {
        throw new Error(`Error al decodificar la clave: ${error.message}`);
      } else {
        throw new Error('Error al decodificar la clave del documento');
      }
    }

    const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      importedPrivateKey,
      encryptedKeyBuffer
    );

    // 4. Cifrar la clave AES con la llave pública del destinatario
    const importedDestPublicKey = await window.crypto.subtle.importKey(
      "spki",
      Uint8Array.from(atob(destinationPublicKey), c => c.charCodeAt(0)),
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"]
    );

    const reEncryptedKey = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      importedDestPublicKey,
      decryptedKeyBuffer
    );

    // Intentar compartir el documento
    await share({
      documentId,
      sharedWithEmail: email,
      encryptedKey: btoa(String.fromCharCode(...new Uint8Array(reEncryptedKey)))
    });

    showAlert('success', 'Documento compartido exitosamente');
  } catch (error: any) {
    console.error('Error completo:', error);
    const errorMessage = error?.message || 'Error al compartir el documento';
    showAlert('error', errorMessage);
    throw error;
  }
};

const handleDocumentUpload = async (file: File, name: string) => {
  try {
    // Obtener la clave pública del usuario del localStorage
    const publicKey = localStorage.getItem('public_key');
    if (!publicKey) {
      throw new Error('No se encontró la clave pública del usuario');
    }

    // Cifrar el archivo con la clave pública
    const encryptedData = await encryptFile(file, publicKey);
    
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
