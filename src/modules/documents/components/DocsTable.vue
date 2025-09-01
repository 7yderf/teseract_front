<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
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
            <div class="flex items-center justify-between">
              <Icon
                icon="bi:pencil-square"
                class="h-5 w-5 cursor-pointer text-gray-600 hover:text-primary-600"
              />
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  :checked="doc.id === 'Activa'"
                  class="peer sr-only"
                />
                <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
              </label>
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

interface Props {
  companies: any[];
  loadWithSort: Function;
  getPage: (page: number) => void;
}

defineProps<Props>();
</script>

