<script setup lang="ts">
import type { PropType } from 'vue'
import type { WorkflowDefinition } from '~/stores/workflow'
import { ref, computed } from 'vue'

const props = defineProps({
  availableWorkflows: {
    type: Array as PropType<WorkflowDefinition[]>,
    default: () => [],
  },
  selectedWorkflowId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select-workflow', 'export-workflow', 'add-node', 'create-new-workflow'])

const searchQuery = ref('')
const expandedSections = ref({
  workflow: true,
  nodes: true,
  actions: true
})

const nodeTypes = [
  {
    type: 'start',
    label: 'Start',
    description: 'Initiate workflows',
    color: 'bg-emerald-500 hover:bg-emerald-600',
    iconColor: 'text-emerald-100',
    category: 'flow',
  },
  {
    type: 'end', 
    label: 'End', 
    description: 'Terminate workflows', 
    color: 'bg-rose-500 hover:bg-rose-600', 
    iconColor: 'text-rose-100',
    category: 'flow'
  },
  { 
    type: 'create', 
    label: 'Create', 
    description: 'Collect input from staff', 
    color: 'bg-blue-500 hover:bg-blue-600', 
    iconColor: 'text-blue-100',
    category: 'action'
  },
  { 
    type: 'decision', 
    label: 'Decision', 
    description: 'Branch the workflow', 
    color: 'bg-amber-500 hover:bg-amber-600', 
    iconColor: 'text-amber-100',
    category: 'logic'
  },
  { 
    type: 'notification', 
    label: 'Notification', 
    description: 'Send alerts or notifications', 
    color: 'bg-purple-500 hover:bg-purple-600', 
    iconColor: 'text-purple-100',
    category: 'action'
  },
  { 
    type: 'task', 
    label: 'Task', 
    description: 'Perform automated tasks', 
    color: 'bg-slate-500 hover:bg-slate-600', 
    iconColor: 'text-slate-100',
    category: 'action'
  },
]

const nodeIcons = {
  start: 'M5.636 5.636a9 9 0 1012.728 0M12 3v9m0 0l-3-3m3 3l3-3',
  end: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  create: 'M12 4.5v15m7.5-7.5h-15',
  decision: 'M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9',
  notification: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  task: 'M9 12h3.75M9 15h3.75M9 18h3.75m3-18v18a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 015.25 21V3a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0118.75 3z'
}

const filteredNodeTypes = computed(() => {
  if (!searchQuery.value) return nodeTypes
  return nodeTypes.filter(node => 
    node.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectedWorkflow = computed(() => {
  return props.availableWorkflows.find(wf => wf.id === props.selectedWorkflowId)
})

const getNodeColorClass = (type: string) => {
  const nodeType = nodeTypes.find(nt => nt.type === type)
  return nodeType ? nodeType.color : 'bg-gray-400 hover:bg-gray-500'
}

const getNodeIconColor = (type: string) => {
  const nodeType = nodeTypes.find(nt => nt.type === type)
  return nodeType ? nodeType.iconColor : 'text-gray-100'
}

const handleClickNodeCard = (nodeType: string) => {
  emit('add-node', nodeType)
}

const toggleSection = (section: string) => {
  expandedSections.value[section] = !expandedSections.value[section]
}
</script>

<template>
  <div class="w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-xl flex flex-col h-full">
    <!-- Header -->
    <div class="p-6 border-b border-slate-200 bg-white">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-slate-800">Workflow Designer</h1>
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <p class="text-sm text-slate-600">Build and manage your workflows</p>
    </div>

    <!-- Nodes Library Section -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="px-6 py-4 border-b border-slate-100">
        <button 
          @click="toggleSection('nodes')"
          class="flex items-center justify-between w-full mb-3 text-left"
        >
          <h2 class="text-lg font-semibold text-slate-800">Nodes Library</h2>
          <svg 
            :class="{ 'rotate-180': expandedSections.nodes }" 
            class="w-5 h-5 text-slate-500 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Search Bar -->
        <div v-show="expandedSections.nodes" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search nodes..."
            class="w-full px-4 py-2 pl-10 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Nodes List -->
      <div v-show="expandedSections.nodes" class="flex-1 overflow-y-auto px-6 py-2">
        <div class="space-y-2">
          <div
            v-for="type in filteredNodeTypes"
            :key="type.type"
            class="group relative"
          >
            <div
              class="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer"
              @click="handleClickNodeCard(type.type)"
            >
              <div :class="[getNodeColorClass(type.type), 'p-3 rounded-lg mr-4 transition-all duration-200 group-hover:scale-110']">
                <svg :class="getNodeIconColor(type.type)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="nodeIcons[type.type]"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-slate-800 group-hover:text-slate-900">{{ type.label }}</h3>
                  <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full">
                    {{ type.category }}
                  </span>
                </div>
                <p class="text-sm text-slate-600 mt-1 leading-tight">{{ type.description }}</p>
              </div>
            </div>
            
            <!-- Drag indicator -->
            <div class="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredNodeTypes.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-slate-500">No nodes found</p>
          <p class="text-sm text-slate-400">Try adjusting your search</p>
        </div>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="px-6 py-4 border-t border-slate-200 bg-white">
      <button 
        @click="toggleSection('actions')"
        class="flex items-center justify-between w-full mb-3 text-left"
      >
        <h2 class="text-lg font-semibold text-slate-800">Actions</h2>
        <svg 
          :class="{ 'rotate-180': expandedSections.actions }" 
          class="w-5 h-5 text-slate-500 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <div v-show="expandedSections.actions" class="space-y-2">
        <button 
          @click="emit('export-workflow')" 
          class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Export Workflow
        </button>
      </div>
    </div>
  </div>
</template>