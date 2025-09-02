<template>
  <BaseModal :show="isOpen" @close="$emit('update:isOpen', false)">
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
            @click="handleClose"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/shared/BaseModal.vue'

interface Props {
  isOpen: boolean
  isUploading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'upload': [file: File, name: string]
}>()

const documentName = ref('')
const selectedFile = ref<File | null>(null)

const canUpload = computed(() => {
  return selectedFile.value && documentName.value.trim()
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    if (!documentName.value) {
      documentName.value = selectedFile.value.name
    }
  }
}

const handleUpload = async () => {
  if (!selectedFile.value || !documentName.value) return
  emit('upload', selectedFile.value, documentName.value)
}

const handleClose = () => {
  emit('update:isOpen', false)
  documentName.value = ''
  selectedFile.value = null
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}
</script>
