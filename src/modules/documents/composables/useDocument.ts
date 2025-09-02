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
  encryptedKey: string;
}

interface DocumentResponse {
  id: number;
  name: string;
  mimeType: string;
  createdAt: string;
  sharedBy?: string;
  encryptedKey?: string;
  encryptedContent?: string;
  encryptionIv?: string;
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

  async downloadAndDecryptDocument(document: DocumentResponse) {
    try {
      // 1. Obtener la clave privada del almacenamiento local
      const privateKey = localStorage.getItem('private_key');
      if (!privateKey) {
        throw new Error('No se encontró la clave privada');
      }

      // 2. Importar la clave privada
      const privateKeyBuffer = Uint8Array.from(atob(privateKey), c => c.charCodeAt(0));
      const importedPrivateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["decrypt"]
      );

      // Verificar que tenemos todos los datos necesarios
      if (!document.encryptedKey || !document.encryptionIv || !document.encryptedContent) {
        throw new Error('Faltan datos del documento cifrado');
      }

      // 3. Descifrar la clave AES
      const encryptedKeyBuffer = Uint8Array.from(atob(document.encryptedKey), c => c.charCodeAt(0));
      const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        importedPrivateKey,
        encryptedKeyBuffer
      );

      // 4. Convertir la clave AES descifrada de nuevo a string base64
      const decryptedKey = new TextDecoder().decode(decryptedKeyBuffer);
      
      // 5. Descifrar el contenido del documento
      const iv = CryptoJS.enc.Base64.parse(document.encryptionIv);
      const encryptedContent = document.encryptedContent;
      
      const decrypted = CryptoJS.AES.decrypt(encryptedContent, CryptoJS.enc.Base64.parse(decryptedKey), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // 6. Convertir el contenido descifrado a Uint8Array
      const decryptedBase64 = decrypted.toString(CryptoJS.enc.Base64);
      const decryptedArray = Uint8Array.from(atob(decryptedBase64), c => c.charCodeAt(0));

      // 7. Crear y descargar el archivo
      const blob = new Blob([decryptedArray], { type: document.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error('Error al descifrar el documento:', error);
      throw new Error('No se pudo descifrar el documento');
    }
  },

  async uploadDocument(document: UploadDocumentData) {
    const { data } = await ApiService.post('/documents/upload', {
      data: {
        attributes: {
          name: document.name,
          mime_type: document.mimeType,
          encrypted_content: document.encryptedContent,
          encryption_iv: document.encryptionIv,
          encrypted_key: document.encryptedKey
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
  const encryptFile = async (file: File, publicKey: string): Promise<UploadDocumentData> => {
    try {
      // Generar clave aleatoria para AES
      const key = CryptoJS.lib.WordArray.random(32); // 256 bits
     const iv = CryptoJS.enc.Base64.parse('AAECAwQFBgcICQoLDA0ODw==');

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

      // Cifrar la clave AES con la clave pública RSA del usuario
      const encryptedKey = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        await importPublicKey(publicKey),
        new TextEncoder().encode(key.toString(CryptoJS.enc.Base64))
      );
      
      return {
        encryptedContent: encrypted.toString(),
        encryptionIv: iv.toString(CryptoJS.enc.Base64),
        name: file.name,
        mimeType: file.type,
        encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedKey)))
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

  // Función auxiliar para importar clave pública
  const importPublicKey = async (publicKeyBase64: string): Promise<CryptoKey> => {
    const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
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
            encryptionIv: doc.encryption_iv,
            encryptedKey: doc.encrypted_key
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
    onSuccess: (response: any) => {
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
