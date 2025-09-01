import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Document {
  id: number;
  name: string;
  mimeType: string;
  createdAt: string;
  sharedBy?: string;
}

export interface DocumentDetail extends Document {
  encryptedContent: string;
  encryptionIv: string;
}

export const useStoreDocuments = defineStore('documents', () => {
  // Estado
  const documents = ref<{
    own: Document[];
    shared: Document[];
  }>({
    own: [],
    shared: []
  });
  
  const currentDocument = ref<DocumentDetail | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

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
    isLoading,
    error,
    
    // Acciones
    setDocuments,
    setCurrentDocument,
    setLoading,
    setError,
    clearDocuments
  };
});

export default useStoreDocuments;
