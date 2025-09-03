import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Document {
  id: number;
  name: string;
  mimeType: string;
  createdAt: string;
  sharedBy?: string;
  encryptedKey?: string;  // Clave cifrada del documento
}

export interface DocumentDetail extends Document {
  encryptedContent: string;
  encryptionIv: string;
  encryptedKey: string;   // Siempre requerida para documentos detallados
}

export interface DocumentShare {
  documentId: number;
  sharedWithEmail: string;
  encryptedKey: string;   // Clave recifrada para el destinatario
}

export const useStoreDocument = defineStore('document', () => {
  // Estado
  const documents = ref<{
    own: Document[];
    shared: Document[];
  }>({
    own: [],
    shared: []
  });
  
  const currentDocument = ref<DocumentDetail | null>(null);
  const documentKey = ref<CryptoKey | null>(null);     // Clave temporal para el documento actual
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const sharingProgress = ref<number>(0);              // Progreso durante la compartición

  // Acciones
  const setDocuments = (data: { own: Document[], shared: Document[] }) => {
    documents.value = data;
  };

  const setCurrentDocument = (doc: DocumentDetail | null) => {
    currentDocument.value = doc;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage;
  };

  const clearDocuments = () => {
    documents.value = { own: [], shared: [] };
    currentDocument.value = null;
  };

  return {
    // Estado
    documents,
    currentDocument,
    documentKey,
    isLoading,
    error,
    sharingProgress,
    
    // Acciones
    setDocuments,
    setCurrentDocument,
    setLoading,
    setError,
    clearDocuments
  };
});

export default useStoreDocument;
