<template>
  <BaseModal :show="show" @close="close">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Compartir documento</h2>
      
      <form @submit.prevent="handleShare" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email del destinatario
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="correo@ejemplo.com"
            :disabled="isSharing"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            :disabled="isSharing"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSharing"
           
            class="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none "
          >
            {{ isSharing ? 'Compartiendo...' : 'Compartir' }}
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/shared/BaseModal.vue';

interface Props {
  show: boolean;
  documentId: number;
  documentName: string;
  isSharing?: boolean;
  onShare: (documentId: number, documentName: string, email: string) => Promise<void>;
}

const props = withDefaults(defineProps<Props>(), {
  isSharing: false
});
const emit = defineEmits(['close']);

const email = ref('');

const close = () => {
  email.value = '';
  emit('close');
};

const handleShare = async () => {
  try {
    console.log('ShareDocumentModal - Intentando compartir:', {
      documentId: props.documentId,
      documentName: props.documentName,
      email: email.value
    });
    
    // Verificar las claves en localStorage
    const keys = Object.keys(localStorage);
    console.log('Claves en localStorage:', keys.filter(k => k.includes('document_key_')));
    
    // Verificar específicamente la clave que buscamos
    const keyExists = localStorage.getItem(`document_key_${props.documentId}`);
    console.log(`Clave document_key_${props.documentId} existe:`, !!keyExists);
    
    await props.onShare(props.documentId, props.documentName, email.value);
    close();
  } catch (error) {
    console.error('Error al compartir documento:', error);
  }
};
</script>
