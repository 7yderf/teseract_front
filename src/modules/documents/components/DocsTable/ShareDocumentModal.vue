<template>
  <BaseModal :show="show" @close="close">
    <div class="space-y-4">
       <h6 class="font-bold mb-4">Compartir documento</h6>

      <form @submit.prevent="handleShare" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="block font-medium text-gray-700 mb-2">
            Email del destinatario
          </label>
          <select
            id="email"
            v-model="email"
            required
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-4"
            :disabled="isSharing"
          >
            <option value="" disabled selected>Selecciona un usuario</option>
            <option 
              v-for="user in users" 
              :key="user.id" 
              :value="user.email"
            >
              {{ user.email }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            :disabled="isSharing"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSharing"
           
            class="px-4 py-2 font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none "
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
  users: any[];
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
    await props.onShare(props.documentId, props.documentName, email.value);
    close();
  } catch (error) {
    console.error('Error al compartir documento:', error);
  }
};
</script>
