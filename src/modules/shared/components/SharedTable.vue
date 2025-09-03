<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="w-full min-w-[700px] divide-y divide-gray-200">
      <thead class="bg-gray-100">
        <tr class="text-sm font-semibold text-gray-800">
          <th class="whitespace-nowrap px-4 py-3">
            <TableThead name="Nombre" key-name="name" sort="default" />
          </th>
          <th class="whitespace-nowrap px-4 py-3">
            <TableThead name="MIME Type" key-name="mime_type" sort="default" />
          </th>
          <th class="whitespace-nowrap px-4 py-3">
            <TableThead
              name="Fecha de registro"
              key-name="createdAt"
              sort="default"
            />
          </th>
          <th class="whitespace-nowrap px-4 py-3">
            <p>Acciones</p>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="doc in companies" :key="doc.id" class="hover:bg-gray-50">
          <td class="cursor-pointer px-4 py-3">
            {{ doc.name }}
          </td>
          <td class="px-4 py-3">{{ doc.mime_type }}</td>
          <td class="px-4 py-3">
            <span
              class="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800"
            >
              {{ doc.created_at }}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-start gap-3">
              <!-- boton para descargar -->
              <button 
                @click="() => handleDownload(Number(doc.attributes?.id || doc.id))"
                :disabled="isDownloading"
                class="relative inline-flex items-center"
              >
                <Icon
                  :icon="isDownloading ? 'eos-icons:loading' : 'bi:download'"
                  class="h-5 w-5 cursor-pointer text-gray-600 hover:text-primary-600"
                  :class="{ 'animate-spin': isDownloading, 'cursor-not-allowed': isDownloading }"
                  :title="isDownloading ? 'Descargando...' : 'Descargar documento'"
                />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup lang="ts">

import { Icon } from '@iconify/vue';
import TableThead from "./TableThead.vue";

interface Document {
  id: number;
  name: string;
  mime_type: string;
  created_at: string;
  attributes?: {
    id: string;
    name: string;
    mime_type: string;
  };
}

interface Props {
  companies: Document[];
  loadWithSort: Function;
  getPage: (page: number) => void;
  onDownload: (documentId: number) => Promise<void>;
  isDownloading: boolean;
}



const props = defineProps<Props>();

// Función para manejar la descarga
const handleDownload = async (id: number) => {
  try {
    await props.onDownload(id);
  } catch (error) {
    console.error('Error al descargar:', error);
  }
};
</script>

