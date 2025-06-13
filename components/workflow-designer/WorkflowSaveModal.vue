<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialIsActive: {
    type: Boolean,
    default: false,
  },
  initialRevision: {
    type: String,
    default: '',
  },
  initialDescription: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['confirm-save', 'cancel']);

const isActive = ref(props.initialIsActive);
const revision = ref(props.initialRevision);
const description = ref(props.initialDescription);

// Watch for changes in initial props to update local refs when modal is opened/re-opened
watch(() => props.initialIsActive, (newVal) => {
  isActive.value = newVal;
});
watch(() => props.initialRevision, (newVal) => {
  revision.value = newVal;
});
watch(() => props.initialDescription, (newVal) => {
  description.value = newVal;
});

const handleConfirm = () => {
  emit('confirm-save', {
    isActive: isActive.value,
    revision: revision.value,
    description: description.value,
  });
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div v-if="show" class="workflow-save-modal fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all sm:my-8 sm:w-full">
      <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Save Workflow</h3>
      
      <div class="space-y-4">
        <div>
          <label for="revision-input" class="block text-sm font-medium text-gray-700">Revision:</label>
          <input
            id="revision-input"
            type="text"
            v-model="revision"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 1.0, 2.1"
          />
        </div>

        <div>
          <label for="description-input" class="block text-sm font-medium text-gray-700">Description / Workflow Name:</label>
          <textarea
            id="description-input"
            v-model="description"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Work Order Approval Process v1"
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            id="is-active-checkbox"
            type="checkbox"
            v-model="isActive"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="is-active-checkbox" class="ml-2 block text-sm text-gray-900">Set as Active Workflow</label>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="handleCancel"
          type="button"
          class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save Workflow
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Anda bisa menambahkan gaya khusus jika diperlukan */
</style>
