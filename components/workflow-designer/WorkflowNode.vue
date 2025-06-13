<script setup lang="ts">
import type { WorkflowNode } from '~/stores/workflow'
import { computed, type PropType } from 'vue'

type WorkflowNodeType = WorkflowNode;

const props = defineProps({
  node: {
    type: Object as PropType<WorkflowNodeType>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  getNodeColor: {
    type: Function as PropType<(nodeType: string) => string>,
    required: true,
  },
  getNodeDimensions: {
    type: Function as PropType<(node: WorkflowNodeType) => { width: number, height: number }>,
    required: true,
  },
})

const emit = defineEmits<{
  'mousedown': [event: MouseEvent]
  'dblclick': [event: MouseEvent]
  'mousedown-output': [event: MouseEvent]
}>()

const nodeDimensions = computed(() => props.getNodeDimensions(props.node))
</script>

<template>
  <div
    class="drawflow-node absolute rounded-lg shadow-lg transition-all duration-100 ease-in-out border-2"
    :class="[isSelected ? 'ring-4 ring-blue-400 border-blue-500' : 'border-transparent', getNodeColor(node.type)]"
    :style="{
      width: `${nodeDimensions.width}px`,
      height: `${nodeDimensions.height}px`,
    }"
    @mousedown="emit('mousedown', $event)"
    @dblclick="emit('dblclick', $event)"
  >
    <div class="p-2 text-sm font-semibold border-b border-gray-200 text-gray-800">
      {{ node.label }}
    </div>
    <div class="p-2 text-xs text-gray-700 flex-grow overflow-hidden">
      <p v-if="node.node_id">
        ID: {{ node.node_id.substring(0, 8) }}
      </p>
      <p v-if="node.type">
        Type:
        {{ node.type }}
      </p>
      <p v-if="node.description">
        {{ node.description }}
      </p>
      <p v-if="node.role">
        Role:
        {{ node.role }}
      </p>
      <p v-if="node.message">
        {{ node.message }}
      </p>
      <div v-if="node.transformedOutputs && node.transformedOutputs.length > 0" class="mt-1">
        <p class="font-medium">
          Outputs:
        </p>
        <ul class="list-disc list-inside ml-2">
          <li v-for="output in node.transformedOutputs" :key="output.id">
            {{ output.label }}
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="node.type !== 'end'"
      class="node-output absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500 rounded-full cursor-grab hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-md"
      @mousedown.stop="emit('mousedown-output', $event)"
    >
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
        <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
      </svg>
    </div>

    <div
      v-if="node.type !== 'start'"
      class="node-input absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-500 rounded-full cursor-grab hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center shadow-md"
      @mousedown.stop
    >
      <svg class="w-3 h-3 text-white transform rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
        <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.drawflow-node {
  background-color: white;
  min-width: 120px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>
