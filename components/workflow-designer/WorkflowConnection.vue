<script setup lang="ts">
import type { PropType } from 'vue'
import type { WorkflowConnection } from '~/stores/workflow'
import { computed } from 'vue'
import { useWorkflowStore } from '~/stores/workflow'

const props = defineProps({
  connection: {
    type: Object as PropType<WorkflowConnection>,
    required: true,
  },
  getConnectionPath: {
    type: Function as PropType<(connection: WorkflowConnection) => string>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const workflowStore = useWorkflowStore()

// Computed property untuk mendapatkan label output jika ada
const connectionLabel = computed(() => {
  if (props.connection.condition) {
    return props.connection.condition
  }
  // Anda juga bisa mencari label dari outputId jika condition tidak ada
  const fromNode = workflowStore.nodes.find(n => n.id === props.connection.from)
  if (fromNode && fromNode.transformedOutputs && props.connection.outputId) {
    const output = fromNode.transformedOutputs.find(o => o.id === props.connection.outputId)
    return output?.label
  }
  return null
})

// Menghitung posisi tengah garis untuk label
const getLabelPosition = computed(() => {
  const pathData = props.getConnectionPath(props.connection)
  // Ini adalah pendekatan sederhana, mungkin perlu library SVG path parsing yang lebih canggih
  // untuk posisi yang akurat di tengah kurva Bezier.
  // Untuk saat ini, kita akan memperkirakan posisi di tengah antara start dan end point.
  const fromNode = workflowStore.nodes.find(n => n.id === props.connection.from)
  const toNode = workflowStore.nodes.find(n => n.id === props.connection.to)

  if (!fromNode || !toNode) {
    return { x: 0, y: 0 }
  }

  // Menggunakan posisi yang disimpan di connection.temp_start_x/y jika ini adalah koneksi sementara
  const startX = props.connection.temp_start_x !== undefined ? props.connection.temp_start_x : (fromNode.position?.x ?? fromNode.position_x) + (fromNode.width || 180) // Asumsi lebar node
  const startY = props.connection.temp_start_y !== undefined ? props.connection.temp_start_y : (fromNode.position?.y ?? fromNode.position_y) + (fromNode.height || 70) / 2 // Asumsi tinggi node
  const endX = props.connection.temp_end_x !== undefined ? props.connection.temp_end_x : (toNode.position?.x ?? toNode.position_x)
  const endY = props.connection.temp_end_y !== undefined ? props.connection.temp_end_y : (toNode.position?.y ?? toNode.position_y) + (toNode.height || 70) / 2

  return {
    x: (startX + endX) / 2,
    y: (startY + endY) / 2,
  }
})
</script>

<template>
  <g>
    <path
      :d="getConnectionPath(connection)"
      :class="[
        'workflow-connection-path stroke-2 fill-none cursor-pointer',
        isSelected ? 'stroke-blue-500' : 'stroke-gray-500',
      ]"
      style="pointer-events: all;"
    />
    <text
      v-if="connectionLabel"
      :x="getLabelPosition.x"
      :y="getLabelPosition.y"
      class="fill-gray-700 text-xs font-semibold pointer-events-none"
      text-anchor="middle"
      alignment-baseline="middle"
      :style="{ transform: `translate(-50%, -50%)` }"
      transform="translate(-10, -10)"
    >
      {{ connectionLabel }}
    </text>
  </g>
</template>

<style scoped>
.workflow-connection-path {
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
.workflow-connection-path:hover {
  stroke: #60a5fa;
  stroke-width: 3;
}
</style>
