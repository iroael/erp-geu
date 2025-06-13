<script setup lang="ts">
import type { WorkflowConnection, WorkflowDefinition, WorkflowNode } from '~/stores/workflow'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkflowInteractions } from '~/composables/useWorkflowInteractions'
import { useWorkflowStore } from '~/stores/workflow'
import WorkflowCanvas from './WorkflowCanvas.vue'
import WorkflowConnectionContextMenu from './WorkflowConnectionContextMenu.vue'
import WorkflowPropertyPanel from './WorkflowPropertyPanel.vue'
import WorkflowSaveModal from './WorkflowSaveModal.vue'
import WorkflowSidebar from './WorkflowSidebar.vue'
import WorkflowToolbar from './WorkflowToolbar.vue'

const route = useRoute()
const workflowTypeFromRoute = route.params.workflow_type as string
console.log('Workflow type from route:', workflowTypeFromRoute)

const availableWorkflows = ref<WorkflowDefinition[]>([])
const selectedWorkflowId = ref<string | null>(null)
const isLoading = ref(false)
const showSaveModal = ref(false)
const saveModalRevision = ref('')
const saveModalDescription = ref('') // Menambahkan input keterangan

const saveModalIsActive = ref(false)

const workflowStore = useWorkflowStore()

const workflowCanvasInstanceRef = ref<InstanceType<typeof WorkflowCanvas> | null>(null)
const actualCanvasDomRef = computed(() => workflowCanvasInstanceRef.value?.canvasContainerRef || null)

const getNodeColor = (nodeType: string): string => {
  switch (nodeType) { // Menggunakan huruf kecil untuk case
    case 'start': return 'bg-green-500'
    case 'end': return 'bg-red-500'
    case 'decision': return 'bg-yellow-500'
    case 'notification': return 'bg-purple-500'
    case 'task': return 'bg-blue-500'
    case 'staff_submission': return 'bg-orange-500'
    case 'approval': return 'bg-indigo-500'
    default: return 'bg-gray-400'
  }
}

const getNodeDimensions = (node: WorkflowNode): { width: number; height: number } => {
  let width = 180
  let height = 70

  if (node.description) height += 15
  if (node.role) height += 20
  if (node.message) height += 30

  if ((node.type === 'decision' || node.type === 'approval') && node.transformedOutputs && node.transformedOutputs.length > 0) {
    height += (node.transformedOutputs.length * 20) + 10
  }

  height = Math.max(height, 100)

  const labelLength = node.label.length
  if (labelLength > 15) {
    width = Math.max(width, 180 + (labelLength - 15) * 5)
  }

  return { width, height }
}

// Fungsi getPortPosition yang diperbarui untuk mendukung multiple output ports
const getPortPosition = (node: WorkflowNode, type: 'input' | 'output', outputId?: string): { x: number; y: number } => {
  const { width, height } = getNodeDimensions(node)
  const portSize = 16
  const portHalfSize = portSize / 2

  const nodePosX = node.position?.x ?? node.position_x
  const nodePosY = node.position?.y ?? node.position_y

  if (type === 'input') {
    return { x: nodePosX - 2 + portHalfSize, y: nodePosY + height / 2 }
  }
  else { // type === 'output'
    if ((node.type === 'decision' || node.type === 'approval') && node.transformedOutputs && node.transformedOutputs.length > 0 && outputId) {
      const outputIndex = node.transformedOutputs.findIndex(output => output.id === outputId);
      if (outputIndex === -1) {
        return { x: nodePosX + width + 2 - portHalfSize, y: nodePosY + height / 2 }
      }

      // Menggunakan logika yang sama dengan WorkflowNode.vue untuk posisi Y
      const numOutputs = node.transformedOutputs.length
      const verticalSpacing = height / (numOutputs + 1)
      const calculatedY = nodePosY + (outputIndex + 1) * verticalSpacing

      return { x: nodePosX + width + 2 - portHalfSize, y: calculatedY }
    }
    else {
      return { x: nodePosX + width + 2 - portHalfSize, y: nodePosY + height / 2 }
    }
  }
}

const getConnectionPath = (connection: WorkflowConnection): string => {
  let startX: number, startY: number
  let endX: number, endY: number

  if (connection.temp_start_x !== undefined && connection.temp_start_y !== undefined &&
      connection.temp_end_x !== undefined && connection.temp_end_y !== undefined) {
    startX = connection.temp_start_x
    startY = connection.temp_start_y
    endX = connection.temp_end_x
    endY = connection.temp_end_y
  }
  else {
    const fromNode = workflowStore.nodes.find(n => n.id === connection.from)
    const toNode = workflowStore.nodes.find(n => n.id === connection.to)

    if (!fromNode || !toNode) {
      return ''
    }

    const fromPortPos = getPortPosition(fromNode, 'output', connection.outputId)
    const toPortPos = getPortPosition(toNode, 'input')

    startX = fromPortPos.x
    startY = fromPortPos.y
    endX = toPortPos.x
    endY = toPortPos.y
  }

  const dx = endX - startX
  const dy = endY - startY

  let cp1x, cp1y, cp2x, cp2y

  cp1x = startX + Math.abs(dx) * 0.4
  cp1y = startY
  cp2x = endX - Math.abs(dx) * 0.4
  cp2y = endY

  if (dx < 0) {
    cp1x = startX + 50
    cp2x = endX - 50
    if (Math.abs(dy) > 50) {
      cp1y = startY + dy * 0.5
      cp2y = endY - dy * 0.5
    }
  }

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`
}

const {
  connectionState,
  startPanCanvas,
  handleNodeMousedown: handleNodeMousedownInteraction,
  handleStartConnection: handleStartConnectionInteraction,
  handleConnectionEnd,
} = useWorkflowInteractions({
  nodes: computed(() => workflowStore.nodes),
  connections: computed(() => workflowStore.connections),
  zoom: computed(() => workflowStore.zoom),
  panX: computed(() => workflowStore.panOffset.x),
  panY: computed(() => workflowStore.panOffset.y),
  canvasContainerRef: actualCanvasDomRef,
  deselectAll: workflowStore.deselectAll,
  selectNode: workflowStore.selectNode,
  addConnection: workflowStore.addConnection,
  updateNodePosition: workflowStore.updateNodePosition,
  getNodeDimensions: getNodeDimensions,
})

const showConnectionContextMenu = ref(false)
const connectionContextMenuX = ref(0)
const connectionContextMenuY = ref(0)
const connectionToDeleteViaContextMenu = ref<WorkflowConnection | null>(null)

const handleConnectionRightClick = (connection: WorkflowConnection, event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  workflowStore.selectConnection(connection)
  connectionToDeleteViaContextMenu.value = connection
  connectionContextMenuX.value = event.clientX
  connectionContextMenuY.value = event.clientY
  showConnectionContextMenu.value = true
}

const hideConnectionContextMenu = () => {
  showConnectionContextMenu.value = false
  connectionToDeleteViaContextMenu.value = null
}
// console.log('Workflow Designer initialized')
// console.log('Available workflows NewWorkflowDesigner:', availableWorkflows.value)
watch(selectedWorkflowId, async (newId) => {
  if (newId) {
    isLoading.value = true
    const workflowToLoad = availableWorkflows.value.find(wf => wf.id === newId)
    if (workflowToLoad) {
      workflowStore.setCurrentWorkflowFromApi(workflowToLoad)
    }
    else {
      workflowStore.clearWorkflowState()
    }
    isLoading.value = false
  }
  else {
    workflowStore.clearWorkflowState()
  }
}, { immediate: true })

onMounted(async () => {
  isLoading.value = true
  availableWorkflows.value = await workflowStore.fetchWorkflows(workflowTypeFromRoute)
  if (availableWorkflows.value.length > 0) {
    const initialWorkflow = availableWorkflows.value.find(wf => wf.is_active) || availableWorkflows.value[0]
    selectedWorkflowId.value = initialWorkflow.id
  }
  isLoading.value = false

  document.addEventListener('mouseup', handleGlobalMouseUp)
  document.addEventListener('touchend', handleGlobalMouseUp)
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleGlobalMouseUp)
  document.removeEventListener('touchend', handleGlobalMouseUp)
  document.removeEventListener('click', handleGlobalClick)
})

const handleGlobalMouseUp = (event: MouseEvent | TouchEvent) => {
  handleConnectionEnd(event)
}

const handleGlobalClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.drawflow-node') &&
      !target.closest('.workflow-connection-path') &&
      !target.closest('.property-panel') &&
      !target.closest('.connection-context-menu') &&
      !target.closest('.workflow-sidebar') &&
      !target.closest('.workflow-toolbar')) {
    workflowStore.deselectAll()
    hideConnectionContextMenu()
  }
}

const handleCanvasMousedown = (event: MouseEvent) => {
  workflowStore.deselectAll()
  startPanCanvas(event)
}

const updateZoom = (delta: number) => {
  let newZoom = workflowStore.zoom + delta
  if (newZoom < 0.1)
    newZoom = 0.1
  if (newZoom > 2)
    newZoom = 2
  workflowStore.setZoom(newZoom)
}

// Fungsi untuk menambahkan node (dipanggil dari sidebar atau drop)
const addNode = (nodeType: string, clientX?: number, clientY?: number) => {
  let x = 0
  let y = 0

  if (clientX !== undefined && clientY !== undefined && actualCanvasDomRef.value) {
    const canvasRect = actualCanvasDomRef.value.getBoundingClientRect()
    const mouseXRelativeToCanvasContainer = clientX - canvasRect.left
    const mouseYRelativeToCanvasContainer = clientY - canvasRect.top

    x = (mouseXRelativeToCanvasContainer / workflowStore.zoom) - workflowStore.panOffset.x - (getNodeDimensions({ type: nodeType } as WorkflowNode).width / 2)
    y = (mouseYRelativeToCanvasContainer / workflowStore.zoom) - workflowStore.panOffset.y - (getNodeDimensions({ type: nodeType } as WorkflowNode).height / 2)
  }
  else {
    x = (actualCanvasDomRef.value?.clientWidth / 2 / workflowStore.zoom) - workflowStore.panOffset.x - (180 / 2)
    y = (actualCanvasDomRef.value?.clientHeight / 2 / workflowStore.zoom) - workflowStore.panOffset.y - (70 / 2)
  }

  const newNode: WorkflowNode = {
    id: uuidv4(),
    node_id: `${nodeType}_${Date.now()}`,
    label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
    type: nodeType as any, // Ini akan diubah ke lowercase di bawah
    position_x: x,
    position_y: y,
    position: { x, y },
  }

  // Pastikan tipe node selalu lowercase saat disimpan
  newNode.type = newNode.type.toLowerCase() as any;

  if (newNode.type === 'decision' || newNode.type === 'approval') {
    newNode.outputs = ['Yes', 'No']
    newNode.transformedOutputs = [{ id: uuidv4(), label: 'Yes' }, { id: uuidv4(), label: 'No' }]
    newNode.role = 'manager'
  }
  else if (newNode.type === 'notification') {
    newNode.message = 'Default notification message.'
    newNode.role = 'staff'
  }
  else if (newNode.type === 'staff_submission') {
    newNode.role = 'staff'
  }

  workflowStore.addNode(newNode)
  workflowStore.selectNode(newNode.id)
};

const deleteSelected = () => {
  if (workflowStore.selectedNodeId) {
    workflowStore.removeNode(workflowStore.selectedNodeId);
  } else if (workflowStore.getSelectedConnection) {
    workflowStore.removeConnection(workflowStore.getSelectedConnection.id)
  }
};

const handleUpdateNode = (updatedNode: WorkflowNode) => {
  workflowStore.updateNode(updatedNode)
};

const handleUpdateConnection = (updatedConnection: WorkflowConnection) => {
  const index = workflowStore.connections.findIndex(c => c.id === updatedConnection.id)
  if (index !== -1) {
    workflowStore.connections[index] = updatedConnection
  }
}

const exportWorkflow = () => {
  const currentWorkflowData = availableWorkflows.value.find(wf => wf.id === selectedWorkflowId.value)
  if (!currentWorkflowData) {
    return
  }

  const nodesForExport = workflowStore.nodes.map(node => ({
    id: node.id,
    node_id: node.node_id,
    type: node.type,
    label: node.label,
    description: node.description,
    role: node.role,
    outputs: node.transformedOutputs ? node.transformedOutputs.map(output => output.label) : [],
    message: node.message,
    position_x: node.position?.x ?? node.position_x,
    position_y: node.position?.y ?? node.position_y,
  }))

  const connectionsForExport = workflowStore.connections.map(conn => ({
    id: conn.id,
    from_node: conn.from_node,
    to_node: conn.to_node,
    condition: conn.condition,
    outputId: conn.outputId || null,
  }))

  const exportData = {
    success: true,
    data: [{
      ...currentWorkflowData,
      nodes: nodesForExport,
      connections: connectionsForExport,
      created_at: currentWorkflowData.created_at,
      updated_at: currentWorkflowData.updated_at,
    }],
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentWorkflowData.workflow_type}_${currentWorkflowData.revision}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
}

// Fungsi yang dipanggil saat tombol "Save Workflow" di toolbar diklik
const openSaveModal = () => {
  // Inisialisasi nilai modal dengan data workflow saat ini jika ada
  const currentWorkflowData = availableWorkflows.value.find(wf => wf.id === selectedWorkflowId.value);
  if (currentWorkflowData) {
    saveModalIsActive.value = currentWorkflowData.is_active
    saveModalRevision.value = currentWorkflowData.revision
    saveModalDescription.value = currentWorkflowData.workflow_name
  }
  else {
    // Default values jika tidak ada workflow yang dipilih
    saveModalIsActive.value = false
    saveModalRevision.value = '1' // Default revision
    saveModalDescription.value = 'New Workflow'
  }
  showSaveModal.value = true;
}

const confirmExportWorkflow = async (data: { isActive: boolean; revision: string; description: string }) => {
  showSaveModal.value = false; // Close the modal

  const currentWorkflowData = availableWorkflows.value.find(wf => wf.id === selectedWorkflowId.value);
  
  // Prepare nodes for export, ensuring consistency with backend expectations
  const nodesForExport = workflowStore.nodes.map(node => ({
    id: node.id,
    node_id: node.node_id,
    type: node.type,
    label: node.label,
    description: node.description,
    role: node.role,
    // Map transformedOutputs back to a simple array of labels for the 'outputs' field
    outputs: node.transformedOutputs ? node.transformedOutputs.map(output => output.label) : [],
    message: node.message,
    position_x: node.position?.x ?? node.position_x,
    position_y: node.position?.y ?? node.position_y,
  }))

  // Prepare connections for export
  const connectionsForExport = workflowStore.connections.map(conn => ({
    id: conn.id,
    from_node: conn.from_node,
    to_node: conn.to_node,
    condition: conn.condition,
    outputId: conn.outputId || null, // Ensure outputId is included
  }))

  // Determine workflow ID to use (existing or new)
  const workflowIdToUse = currentWorkflowData?.id || uuidv4()
  // Payload for the API request (matches WorkflowDefinition structure)
  const payload: WorkflowDefinition = {
    id: workflowIdToUse,
    workflow_type: currentWorkflowData?.workflow_type || 'work_order', // Default to 'work_order' if not existing
    workflow_name: data.description, // Use description from modal as workflow_name
    revision: data.revision, // Use revision from modal
    is_active: data.isActive, // Use is_active from modal
    nodes: nodesForExport,
    connections: connectionsForExport,
    created_at: currentWorkflowData?.created_at || new Date().toISOString(), // Preserve created_at or set new
    updated_at: new Date().toISOString(), // Always update updated_at
  }

  try {
    // Call the saveWorkflowToApi action from the store
    const result = await workflowStore.saveWorkflowToApi(payload)
    console.log('Workflow saved successfully:', result)
    // TODO: Replace with a better UI notification (e.g., a toast message)
    alert('Workflow saved successfully!');

    // After successful save, refresh the list of workflows
    isLoading.value = true
    availableWorkflows.value = await workflowStore.fetchWorkflows()
    // Select the newly saved workflow or the active one if available
    const newlySavedWorkflow = availableWorkflows.value.find(wf => wf.id === payload.id)
    if (newlySavedWorkflow) {
      selectedWorkflowId.value = newlySavedWorkflow.id
      workflowStore.setCurrentWorkflowFromApi(newlySavedWorkflow)
    }
    else if (availableWorkflows.value.length > 0) {
      const initialWorkflow = availableWorkflows.value.find(wf => wf.is_active) || availableWorkflows.value[0]
      selectedWorkflowId.value = initialWorkflow.id
      workflowStore.setCurrentWorkflowFromApi(initialWorkflow)
    }
    isLoading.value = false
  }
  catch (error: any) {
    console.error('Error saving workflow:', error)
    // TODO: Replace with a better UI notification (e.g., a toast message)
    alert(`Error saving workflow: ${error.message}`)
  }
}
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50 font-inter">
    <WorkflowToolbar
      :available-workflows="availableWorkflows"
      :selected-workflow-id="selectedWorkflowId"
      :workflow-name="selectedWorkflowId ? availableWorkflows.find(wf => wf.id === selectedWorkflowId)?.workflow_name : 'No Workflow Selected'"
      :zoom="workflowStore.zoom"
      :nodes-count="workflowStore.nodes?.length || 0"
      :connections-count="workflowStore.connections?.length || 0"
      @update:selected-workflow-id="(id) => selectedWorkflowId = id"
      @zoom-in="updateZoom(0.1)"
      @zoom-out="updateZoom(-0.1)"
      @reset-zoom="workflowStore.setZoom(1)"
      @save="openSaveModal"
    />

    <div class="flex flex-1 overflow-hidden">
      <WorkflowSidebar
        :available-workflows="availableWorkflows"
        :selected-workflow-id="selectedWorkflowId"
        @select-workflow="(id) => selectedWorkflowId = id"
        @add-node="addNode"
        @export-workflow="exportWorkflow"
      />

      <WorkflowCanvas
        ref="workflowCanvasInstanceRef"
        :nodes="workflowStore.nodes"
        :connections="workflowStore.connections"
        :zoom="workflowStore.zoom"
        :pan-x="workflowStore.panOffset.x"
        :pan-y="workflowStore.panOffset.y"
        :selected-node-id="workflowStore.selectedNodeId"
        :selected-connection="workflowStore.getSelectedConnection"
        :connection-state="connectionState"
        :get-node-color="getNodeColor"
        :get-node-dimensions="getNodeDimensions"
        :get-connection-path="getConnectionPath"
        @node-mousedown="handleNodeMousedownInteraction"
        @node-dblclick="(node) => workflowStore.selectNode(node.id)"
        @canvas-mousedown="handleCanvasMousedown"
        @node-output-mousedown="handleStartConnectionInteraction"
        @connection-click="(conn) => workflowStore.selectConnection(conn)"
        @connection-dblclick="(conn) => workflowStore.removeConnection(conn.id)"
        @connection-contextmenu="handleConnectionRightClick"
        @mouseup="handleGlobalMouseUp"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
      />

      <WorkflowPropertyPanel
        :selected-node="workflowStore.selectedNode"
        :selected-connection="workflowStore.getSelectedConnection"
        @delete-selected="deleteSelected"
        @update-node="handleUpdateNode"
        @update-connection="handleUpdateConnection"
      />

      <WorkflowConnectionContextMenu
        :show="showConnectionContextMenu"
        :x="connectionContextMenuX"
        :y="connectionContextMenuY"
        :connection-to-delete="connectionToDeleteViaContextMenu"
        @delete-connection="(conn) => workflowStore.removeConnection(conn.id)"
        @hide-context-menu="hideConnectionContextMenu"
      />


      <WorkflowSaveModal
        :show="showSaveModal"
        :initial-is-active="saveModalIsActive"
        :initial-revision="saveModalRevision"
        :initial-description="saveModalDescription"
        @confirm-save="confirmExportWorkflow"
        @cancel="showSaveModal = false"
      />
    </div>
  </div>
</template>

<style scoped>
/* Anda bisa menambahkan gaya global di sini atau menggunakan file CSS terpisah */
</style>
