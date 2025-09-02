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
  encryptedKey: string;
  encryptedContent: string;
  encryptionIv: string;
}

interface DocumentListResponse {
  own: DocumentResponse[];
  shared: DocumentResponse[];
}

// Respuesta del servicio de descarga
interface DownloadResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      id: number;
      name: string;
      mime_type: string;
      created_at: string;
      encrypted_content: string;
      encryption_iv: string;
      encrypted_key: string;
    };
  };
}

// Servicios API separados
const documentServices = {
  

  async getDocument(id: number): Promise<DocumentResponse> {
    const response = await ApiService.get(`/documents/download/${id}`);
    const doc = response.data.data.attributes;
    
    // Limpiar y formatear las claves
    const cleanKey = doc.encrypted_key.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - cleanKey.length % 4) % 4);
    const formattedKey = cleanKey + padding;

    return {
      id: doc.id,
      name: doc.name,
      mimeType: doc.mime_type,
      createdAt: doc.created_at,
      encryptedContent: doc.encrypted_content,
      encryptionIv: doc.encryption_iv,
      encryptedKey: formattedKey
    };
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

   const downloadAndDecryptDocument = async (documentId: number): Promise<boolean> => {
    try {
      // 1. Obtener el documento del servidor
      const docResponse = await documentServices.getDocument(documentId);
      
      // 2. Obtener la clave privada del almacenamiento local
      const privateKeyStr = localStorage.getItem('private_key');
      if (!privateKeyStr) {
        throw new Error('No se encontró la clave privada');
      }

      // 3. Verificar que tenemos todos los datos necesarios
      if (!docResponse.encryptedKey || !docResponse.encryptionIv || !docResponse.encryptedContent) {
        throw new Error('Faltan datos del documento cifrado');
      }

      // 4. Importar la clave privada RSA
      const privateKeyBuffer = Uint8Array.from(atob(privateKeyStr), c => c.charCodeAt(0));
      const rsaPrivateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["decrypt"]
      );

      // 5. Descifrar la clave AES con RSA
      const encryptedAesKeyBuffer = Uint8Array.from(atob(docResponse.encryptedKey), c => c.charCodeAt(0));
      const decryptedAesKeyBuffer = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        rsaPrivateKey,
        encryptedAesKeyBuffer
      );

      // 6. Convertir la clave AES descifrada a string
      const aesKey = new TextDecoder().decode(decryptedAesKeyBuffer);

      // 7. Descifrar el contenido con AES
      const ivBytes = CryptoJS.enc.Base64.parse(docResponse.encryptionIv);
      const encryptedContent = CryptoJS.enc.Base64.parse(docResponse.encryptedContent);
      const cryptoJsAesKey = CryptoJS.enc.Base64.parse(aesKey);
      
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encryptedContent
      });
      
      const decryptedBytes = CryptoJS.AES.decrypt(
        cipherParams,
        cryptoJsAesKey,
        {
          iv: ivBytes,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      // 8. Convertir el contenido descifrado a Uint8Array
      const base64Content = decryptedBytes.toString(CryptoJS.enc.Base64);
      const binaryContent = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

      // 9. Crear y descargar el archivo
      const fileBlob = new Blob([binaryContent], { type: docResponse.mimeType });
      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const downloadLink = window.document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = docResponse.name;
      
      window.document.body.appendChild(downloadLink);
      downloadLink.click();
      window.URL.revokeObjectURL(downloadUrl);
      window.document.body.removeChild(downloadLink);

      return true;

      
    } catch (error) {
      console.error('Error al descifrar el documento:', error);
      throw new Error('No se pudo descifrar el documento');
    }
  }

  // Cifrar un archivo para su envío
  const encryptFile = async (file: File, publicKey: string): Promise<UploadDocumentData> => {
    try {
      // Generar clave aleatoria para AES
      const key = CryptoJS.lib.WordArray.random(32); // 256 bits
      
      // Generar IV
      const iv = CryptoJS.enc.Base64.parse('AAECAwQFBgcICQoLDA0ODw==');

      // Leer el contenido del archivo como ArrayBuffer y convertirlo a WordArray
      const fileContent = await readFileAsArrayBuffer(file);
      const wordArray = CryptoJS.lib.WordArray.create(fileContent);

      // Cifrar el contenido del archivo
      const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Cifrar la clave AES con la clave pública RSA
      const aesKeyBase64 = key.toString(CryptoJS.enc.Base64);
      const importedPublicKey = await importPublicKey(publicKey);
      const encryptedKey = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        importedPublicKey,
        new TextEncoder().encode(aesKeyBase64)
      );
      
      const encryptedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedKey)));

      const result = {
        encryptedContent: encrypted.toString(),
        encryptionIv: iv.toString(CryptoJS.enc.Base64),
        name: file.name,
        mimeType: file.type,
        encryptedKey: encryptedKeyBase64
      };

      return result;
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
        return await documentServices.getDocument(documentId);
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
    downloadAndDecryptDocument,

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
