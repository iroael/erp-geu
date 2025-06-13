<script setup lang="ts">
import type { PropType } from 'vue'
import type { WorkflowConnection, WorkflowNode } from '~/stores/workflow'
import { computed, ref } from 'vue'
import WorkflowNodeCmp from './WorkflowNode.vue'
import WorkflowConnectionCmp from '@/Components/workflow-designer/WorkflowConnection.vue' // Perbaikan path jika diperlukan

type WorkflowNodeType = WorkflowNode
type WorkflowConnectionType = WorkflowConnection

const props = defineProps({
  nodes: {
    type: Array as PropType<WorkflowNodeType[]>,
    default: () => [],
  },
  connections: {
    type: Array as PropType<WorkflowConnectionType[]>,
    default: () => [],
  },
  zoom: {
    type: Number,
    default: 1,
  },
  panX: {
    type: Number,
    default: 0,
  },
  panY: {
    type: Number,
    default: 0,
  },
  selectedNodeId: {
    type: String,
    default: null,
  },
  selectedConnection: {
    type: Object as PropType<WorkflowConnectionType | null>,
    default: null,
  },
  connectionState: {
    type: Object as PropType<{
      isConnecting: boolean
      startNode: WorkflowNodeType | null
      startPortX: number
      startPortY: number
      endX: number
      endY: number
    }>,
    required: true,
  },
  getNodeColor: {
    type: Function as PropType<(nodeType: string) => string>,
    required: true,
  },
  getNodeDimensions: {
    type: Function as PropType<(node: WorkflowNodeType) => { width: number; height: number }>,
    required: true,
  },
  getConnectionPath: {
    type: Function as PropType<(connection: WorkflowConnectionType) => string>,
    required: true,
  },
})

const emit = defineEmits<{
  'node-mousedown': [node: WorkflowNodeType, event: { clientX: number, clientY: number, button: number }]
  'dblclick': [node: WorkflowNodeType]
  'canvas-mousedown': [event: MouseEvent]
  'node-output-mousedown': [node: WorkflowNodeType, event: { clientX: number, clientY: number, button: number }]
  'connection-click': [connection: WorkflowConnectionType]
  'connection-dblclick': [connection: WorkflowConnectionType]
  'connection-contextmenu': [connection: WorkflowConnectionType, event: MouseEvent]
  'mouseup': [event: MouseEvent]
}>()

const canvasContainerRef = ref<HTMLElement | null>(null);

defineExpose({
  canvasContainerRef
})

const handleNodeMousedown = (node: WorkflowNodeType, event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const { clientX, clientY, button } = event
  emit('node-mousedown', node, { clientX, clientY, button })
}

const handleCanvasMousedown = (event: MouseEvent) => {
  if (event.button === 0) {
    event.preventDefault()
    emit('canvas-mousedown', event)
  }
}

const handleNodeOutputMousedown = (node: WorkflowNodeType, event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const { clientX, clientY, button } = event
  emit('node-output-mousedown', node, { clientX, clientY, button })
}

const temporaryConnection = computed(() => {
  if (props.connectionState.isConnecting) {
    const tempConn: WorkflowConnectionType = {
      id: 'temp-connection',
      from: props.connectionState.startNode?.id || '',
      to: '',
      temp_start_x: props.connectionState.startPortX,
      temp_start_y: props.connectionState.startPortY,
      temp_end_x: props.connectionState.endX,
      temp_end_y: props.connectionState.endY,
      condition: null,
      from_node: props.connectionState.startNode?.node_id || '',
      to_node: '',
    }
    return tempConn
  }
  return null
})
</script>

<template>
  <div
    ref="canvasContainerRef"
    class="relative flex-1 overflow-hidden bg-gray-100"
    @mousedown="handleCanvasMousedown"
    @mouseup="emit('mouseup', $event)"
    @contextmenu.prevent
  >
    <div
      class="workflow-canvas-grid absolute inset-0 bg-repeat"
      :style="{
        'background-size': `${20 * props.zoom}px ${20 * props.zoom}px`,
        'background-image': `linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
        transform: `translate(${props.panX * props.zoom}px, ${props.panY * props.zoom}px) scale(${props.zoom})`,
        'transform-origin': '0 0',
      }"
    >
      <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <g :transform="`scale(1) translate(0, 0)`">
          <WorkflowConnectionCmp
            v-for="connection in connections"
            :key="connection.id"
            :connection="connection"
            :get-connection-path="getConnectionPath"
            :is-selected="selectedConnection?.id === connection.id"
            @click.stop="emit('connection-click', connection)"
            @dblclick.stop="emit('connection-dblclick', connection)"
            @contextmenu.stop="emit('connection-contextmenu', connection, $event)"
          />

          <path
            v-if="temporaryConnection"
            :d="getConnectionPath(temporaryConnection)"
            class="stroke-blue-400 stroke-2 fill-none animate-pulse pointer-events-none"
            stroke-dasharray="5,5"
          />
        </g>
      </svg>

      <WorkflowNodeCmp
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :is-selected="selectedNodeId === node.id"
        :get-node-color="getNodeColor"
        :get-node-dimensions="getNodeDimensions"
        :style="{
          left: `${node.position?.x ?? node.position_x}px`,
          top: `${node.position?.y ?? node.position_y}px`,
          position: 'absolute',
          transform: `scale(1)`
        }"
        @mousedown="handleNodeMousedown(node, $event)"
        @dblclick="emit('dblclick', node)"
        @mousedown-output="handleNodeOutputMousedown(node, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.workflow-canvas-grid {
  /* background-position: var(--pan-offset-x, 0) var(--pan-offset-y, 0); */
}
</style>
