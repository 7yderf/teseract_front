import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import ApiService from '@/core/services/ApiService';
import useStoreDocument from '../store/StoreDocument';
import CryptoJS from 'crypto-js';
import { showAlert } from '@/composables/useAlerts';

// Interfaces
export interface UploadDocumentData {
  name: string;
  mimeType: string;
  encryptedContent: string;
  encryptionIv: string;
  tempKeyId: string;
}

interface DocumentResponse {
  id: number;
  name: string;
  mimeType: string;
  createdAt: string;
  sharedBy?: string;
}

interface DocumentListResponse {
  own: DocumentResponse[];
  shared: DocumentResponse[];
}

// Servicios API separados
const documentServices = {
  

  async getDocument(id: number) {
    const { data } = await ApiService.get(`/documents/download/${id}`);
    return data;
  },

  async uploadDocument(document: UploadDocumentData) {
    const { data } = await ApiService.post('/documents/upload', {
      data: {
        attributes: {
          name: document.name,
          mime_type: document.mimeType,
          encrypted_content: document.encryptedContent,
          encryption_iv: document.encryptionIv
        }
      }
    });
    return data;
  },

  async shareDocument(documentId: number, sharedWithEmail: string, encryptedKey: string) {
    const { data } = await ApiService.post('/documents/share', {
      data: {
        attributes: {
          document_id: documentId,
          shared_with_email: sharedWithEmail,
          encrypted_key: encryptedKey
        }
      }
    });
    return data;
  }
};

export function useDocument() {
  const documentsStore = useStoreDocument();
  const queryClient = useQueryClient();
  const errorMessage = ref<string | null>(null);

  // Cifrar un archivo para su envío
  const encryptFile = async (file: File): Promise<UploadDocumentData> => {
    try {
      // Generar clave aleatoria para AES
      const key = CryptoJS.lib.WordArray.random(32); // 256 bits
      const iv = CryptoJS.lib.WordArray.random(16); // 128 bits

      // Leer el contenido del archivo como ArrayBuffer
      const fileContent = await readFileAsArrayBuffer(file);
      
      // Convertir ArrayBuffer a WordArray que CryptoJS pueda usar
      const wordArray = CryptoJS.lib.WordArray.create(fileContent);
      
      // Cifrar el contenido del archivo
      const encrypted = CryptoJS.AES.encrypt(wordArray.toString(CryptoJS.enc.Base64), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      // Guardamos temporalmente la clave con un identificador único temporal
      const tempId = Date.now().toString();
      localStorage.setItem(`temp_document_key_${tempId}`, key.toString(CryptoJS.enc.Hex));
      
      return {
        tempKeyId: tempId, // Añadimos el ID temporal para poder actualizar la clave después
        encryptedContent: encrypted.toString(),
        encryptionIv: iv.toString(CryptoJS.enc.Base64),
        name: file.name,
        mimeType: file.type
      };
    } catch (error) {
      console.error('Error al cifrar archivo:', error);
      throw new Error('No se pudo cifrar el archivo');
    }
  };

  // Función auxiliar para leer un archivo como ArrayBuffer
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error('Error al leer el archivo'));
        }
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsArrayBuffer(file);
    });
  };



  // Query para obtener un documento específico
  const getDocumentQuery = (documentId: number) => useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      try {
        documentsStore.setLoading(true);
        documentsStore.setError(null);
        
        const response = await ApiService.get(`/api/v1/documents/download/${documentId}`);
        
        if (response?.data?.data?.attributes) {
          const doc = response.data.data.attributes;
          
          // Transformar los datos para que coincidan con nuestra interfaz
          const formattedDoc = {
            id: doc.id,
            name: doc.name,
            mimeType: doc.mime_type,
            createdAt: doc.created_at,
            encryptedContent: doc.encrypted_content,
            encryptionIv: doc.encryption_iv
          };
          
          documentsStore.setCurrentDocument(formattedDoc);
          return formattedDoc;
        }
        
        return null;
      } catch (error: any) {
        const message = error?.response?.data?.errors?.[0]?.detail || 'Error al cargar el documento';
        documentsStore.setError(message);
        errorMessage.value = message;
        throw error;
      } finally {
        documentsStore.setLoading(false);
      }
    },
    enabled: !!documentId,
    retry: 1
  });

  // Mutación para subir un documento
  const uploadDocumentMutation = useMutation({
    mutationFn: (documentData: UploadDocumentData) => documentServices.uploadDocument(documentData),
    onSuccess: (response: any, variables) => {
      console.log('Response de upload:', response);
      // Obtenemos el ID del documento del response
      const documentId = response?.data?.id;
      console.log('DocumentId extraído:', documentId);
      
      if (documentId && variables.tempKeyId) {
        console.log('TempKeyId:', variables.tempKeyId);
        // Obtenemos la clave temporal
        const tempKey = localStorage.getItem(`temp_document_key_${variables.tempKeyId}`);
        console.log('Clave temporal encontrada:', !!tempKey);
        
        if (tempKey) {
          // Guardamos la clave con el ID real del documento
          localStorage.setItem(`document_key_${documentId}`, tempKey);
          console.log('Clave guardada con ID:', documentId);
          // Eliminamos la clave temporal
          localStorage.removeItem(`temp_document_key_${variables.tempKeyId}`);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["page[size]"] });
      showAlert('success', 'Documento subido exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.errors?.[0]?.detail || 'Error al subir el documento';
      showAlert('error', message);
      documentsStore.setError(message);
    }
  });

  // Mutación para compartir un documento
  const shareDocumentMutation = useMutation({
    mutationFn: (data: { documentId: number, sharedWithEmail: string, encryptedKey: string }) => 
      documentServices.shareDocument(data.documentId, data.sharedWithEmail, data.encryptedKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showAlert('success', 'Documento compartido exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.errors?.[0]?.detail || 'Error al compartir el documento';
      showAlert('error', message);
      documentsStore.setError(message);
    }
  });

  return {
    // Queries y mutaciones
    getDocument: getDocumentQuery,
    upload: uploadDocumentMutation.mutate,
    share: shareDocumentMutation.mutate,
    
    // Utilidades
    encryptFile,
    
    // Estado
    isLoading: documentsStore.isLoading,
    error: documentsStore.error,
    currentDocument: documentsStore.currentDocument,
    
    // Estado de las operaciones
    isUploading: uploadDocumentMutation.isPending,
    isSharing: shareDocumentMutation.isPending
  };
}

export default useDocument;
