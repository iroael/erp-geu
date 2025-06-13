<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import type { WorkflowNode, WorkflowConnection } from '~/stores/workflow';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  selectedNode: {
    type: Object as PropType<WorkflowNode | null>,
    default: null,
  },
  selectedConnection: {
    type: Object as PropType<WorkflowConnection | null>,
    default: null,
  },
});

const emit = defineEmits(['delete-selected', 'update-node', 'update-connection']);

const localNode = ref<WorkflowNode | null>(null);
const localConnection = ref<WorkflowConnection | null>(null);

watch(() => props.selectedNode, (newNode) => {
  localNode.value = newNode ? JSON.parse(JSON.stringify(newNode)) : null;
}, { deep: true, immediate: true });

watch(() => props.selectedConnection, (newConn) => {
  localConnection.value = newConn ? JSON.parse(JSON.stringify(newConn)) : null;
}, { deep: true, immediate: true });

const saveNodeChanges = () => {
  if (localNode.value) {
    emit('update-node', localNode.value);
  }
};

const addOutput = () => {
  if (localNode.value) {
    if (!localNode.value.transformedOutputs) {
      localNode.value.transformedOutputs = [];
    }
    localNode.value.transformedOutputs.push({ id: uuidv4(), label: 'New Output' });
  }
};

const removeOutput = (index: number) => {
  if (localNode.value && localNode.value.transformedOutputs) {
    localNode.value.transformedOutputs.splice(index, 1);
  }
};

const saveConnectionChanges = () => {
  if (localConnection.value) {
    emit('update-connection', localConnection.value);
  }
};
</script>

<template>
  <div class="property-panel w-80 p-4 bg-white border-l shadow-lg overflow-y-auto">
    <h2 class="mb-4 text-xl font-bold text-gray-800">Properties</h2>

    <div v-if="selectedNode && localNode" class="space-y-4">
      <h3 class="mb-3 text-lg font-semibold text-gray-700 border-b pb-2">Node Properties</h3>
      
      <div>
        <label for="node-label" class="block text-sm font-medium text-gray-700">Label:</label>
        <input
          id="node-label"
          type="text"
          v-model="localNode.label"
          class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <div>
        <label for="node-type" class="block text-sm font-medium text-gray-700">Type:</label>
        <input
          id="node-type"
          type="text"
          v-model="localNode.type"
          disabled
          class="block w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>

      <div v-if="localNode.description !== undefined">
        <label for="node-description" class="block text-sm font-medium text-gray-700">Description:</label>
        <textarea
          id="node-description"
          v-model="localNode.description"
          rows="3"
          class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        ></textarea>
      </div>

      <div v-if="localNode.role !== undefined">
        <label for="node-role" class="block text-sm font-medium text-gray-700">Role:</label>
        <input
          id="node-role"
          type="text"
          v-model="localNode.role"
          class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <div v-if="localNode.message !== undefined">
        <label for="node-message" class="block text-sm font-medium text-gray-700">Message:</label>
        <textarea
          id="node-message"
          v-model="localNode.message"
          rows="3"
          class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        ></textarea>
      </div>

      <div v-if="localNode.type === 'decision' || localNode.type === 'approval'">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Outputs:</h4>
        <div v-for="(output, index) in localNode.transformedOutputs" :key="output.id || index" class="flex items-center space-x-2 mb-2">
          <input
            type="text"
            v-model="output.label"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm transition-all duration-200"
          />
          <button @click="removeOutput(index)" class="px-3 py-1.5 text-sm text-white bg-red-400 rounded-md hover:bg-red-500 transition-colors duration-200 shadow-sm">
            Remove
          </button>
        </div>
        <button @click="addOutput" class="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">
          Add Output
        </button>
      </div>
      
      <button
        @click="saveNodeChanges"
        class="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md mt-4"
      >
        Update Node
      </button>

      <button
        @click="emit('delete-selected')"
        class="w-full px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md mt-2"
      >
        Delete Node
      </button>
    </div>

    <div v-else-if="selectedConnection && localConnection" class="space-y-4">
      <h3 class="mb-3 text-lg font-semibold text-gray-700 border-b pb-2">Connection Properties</h3>
      
      <div>
        <label for="connection-condition" class="block text-sm font-medium text-gray-700">Condition:</label>
        <input
          id="connection-condition"
          type="text"
          v-model="localConnection.condition"
          class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <button
        @click="saveConnectionChanges"
        class="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md mt-4"
      >
        Update Connection
      </button>

      <button
        @click="emit('delete-selected')"
        class="w-full px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md mt-2"
      >
        Delete Connection
      </button>
    </div>

    <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
      Pilih node atau koneksi untuk melihat properti.
    </div>
  </div>
</template>
