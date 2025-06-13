<script setup lang="ts">
import type { PropType } from 'vue';
import type { WorkflowDefinition } from '~/stores/workflow';
import { ref, computed } from 'vue';

const props = defineProps({
  availableWorkflows: {
    type: Array as PropType<WorkflowDefinition[]>,
    default: () => [],
  },
  selectedWorkflowId: String,
  workflowName: String,
  zoom: Number,
  nodesCount: {
    type: Number,
    default: 0,
  },
  connectionsCount: {
    type: Number,
    default: 0,
  },
  isDirty: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:selected-workflow-id',
  'zoom-in',
  'zoom-out',
  'reset-zoom',
  'fit-to-screen',
  'save',
  'export',
  'import',
  'undo',
  'redo',
  'clear-canvas'
])

const showDropdown = ref(false);

const selectedWorkflow = computed(() => {
  return props.availableWorkflows.find(wf => wf.id === props.selectedWorkflowId);
});

const zoomPercentage = computed(() => {
  return Math.round((props.zoom || 1) * 100);
});

const workflowStats = computed(() => {
  const stats = [];
  if (props.nodesCount > 0) stats.push(`${props.nodesCount} nodes`);
  if (props.connectionsCount > 0) stats.push(`${props.connectionsCount} connections`);
  return stats.join(' • ');
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (event: Event) => {
  if (!(event.target as Element).closest('.dropdown-container')) {
    showDropdown.value = false;
  }
};

// Add click outside listener
if (process.client) {
  document.addEventListener('click', handleClickOutside);
}
</script>

<template>
  <div class="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shadow-sm">
    <!-- Left Section - Branding & Workflow Info -->
    <div class="flex items-center space-x-6">
      <!-- Logo & Title -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-slate-800">Workflow Designer</h1>
      </div>

      <!-- Workflow Selector -->
      <div class="flex items-center space-x-3">
        <div class="relative dropdown-container">
          <select
            :value="selectedWorkflowId"
            @change="emit('update:selected-workflow-id', ($event.target as HTMLSelectElement).value)"
            class="min-w-[200px] px-4 py-2 pr-10 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            <option value="" disabled>Select Workflow</option>
            <option v-for="wf in availableWorkflows" :key="wf.id" :value="wf.id">
              {{ wf.workflow_name }} (Rev: {{ wf.revision }}) {{ wf.is_active ? '★' : '' }}
            </option>
            <option v-if="availableWorkflows.length === 0" value="">Loading workflows...</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        <!-- Current Workflow Badge -->
        <div v-if="selectedWorkflow" class="flex items-center space-x-2">
          <div class="flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-sm font-medium text-blue-800">{{ workflowName }}</span>
            <span v-if="selectedWorkflow.is_active" class="ml-2 text-xs text-green-600 font-semibold">ACTIVE</span>
            <span v-if="isDirty" class="ml-2 w-1.5 h-1.5 bg-orange-500 rounded-full" title="Unsaved changes"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section - Status & Save -->
    <div class="flex items-center space-x-4">
      <!-- Zoom Controls -->
      <div class="flex items-center space-x-1 px-2 py-1 bg-slate-50 rounded-lg">
        <button 
          @click="emit('zoom-out')" 
          class="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200"
          title="Zoom Out"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
          </svg>
        </button>
        
        <button 
          @click="emit('reset-zoom')" 
          class="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-all duration-200 min-w-[60px]"
          title="Reset Zoom"
        >
          {{ zoomPercentage }}%
        </button>
        
        <button 
          @click="emit('zoom-in')" 
          class="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200"
          title="Zoom In"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
          </svg>
        </button>
      </div>
      <!-- Stats -->
      <div v-if="workflowStats" class="flex items-center space-x-1 px-3 py-1.5 bg-slate-50 rounded-lg">
        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <span class="text-sm text-slate-600">{{ workflowStats }}</span>
      </div>

      <!-- Status Indicator -->
      <div class="flex items-center space-x-2">
        <div v-if="isLoading" class="flex items-center space-x-2 text-sm text-slate-600">
          <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Saving...</span>
        </div>
        <div v-else-if="isDirty" class="flex items-center space-x-2 text-sm text-orange-600">
          <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Unsaved changes</span>
        </div>
        <div v-else class="flex items-center space-x-2 text-sm text-green-600">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Saved</span>
        </div>
      </div>

      <!-- Save Button -->
      <button
        @click="emit('save')"
        class="relative flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        {{ isLoading ? 'Saving...' : 'Save Workflow' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
}
</style>