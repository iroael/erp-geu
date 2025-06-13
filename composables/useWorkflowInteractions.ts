// composables/useWorkflowInteractions.ts
import type { Ref } from 'vue'
import type { WorkflowConnection, WorkflowNode } from '~/stores/workflow'
import { v4 as uuidv4 } from 'uuid'
import { computed, reactive } from 'vue'
import { useWorkflowStore } from '~/stores/workflow'

interface ClientCoordinates {
  clientX: number
  clientY: number
  button: number
}

const getEventClientCoordinates = (event: ClientCoordinates): ClientCoordinates => {
  return event
}

interface UseWorkflowInteractionsOptions {
  nodes: Ref<WorkflowNode[]>
  connections: Ref<WorkflowConnection[]>
  zoom: Ref<number>
  panX: Ref<number>
  panY: Ref<number>
  canvasContainerRef: Ref<HTMLElement | null>
  deselectAll: () => void
  selectNode: (nodeId: string) => void
  addConnection: (connection: WorkflowConnection) => void
  updateNodePosition: (nodeId: string, newX: number, newY: number) => void
  getNodeDimensions: (node: WorkflowNode) => { width: number; height: number }
}

export function useWorkflowInteractions(options: UseWorkflowInteractionsOptions) {
  const {
    nodes,
    connections,
    zoom,
    panX,
    panY,
    canvasContainerRef,
    deselectAll,
    selectNode,
    addConnection,
    updateNodePosition,
    getNodeDimensions,
  } = options

  const workflowStore = useWorkflowStore();

  // --- State untuk Pan Canvas ---
  const panState = reactive({
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    initialPanX: 0,
    initialPanY: 0,
  })

  // --- State untuk Drag Node ---
  const dragState = reactive({
    isDragging: false,
    dragNode: null as WorkflowNode | null,
    mouseNodeOffsetX: 0,
    mouseNodeOffsetY: 0,
  })

  // --- State untuk Menggambar Koneksi ---
  const connectionState = reactive({
    isConnecting: false,
    startNode: null as WorkflowNode | null,
    startPortX: 0,
    startPortY: 0,
    endX: 0,
    endY: 0,
  })

  // --- Helper untuk Konversi Koordinat ---
  const screenToLogical = (clientX: number, clientY: number) => {
    const canvasElement = canvasContainerRef.value
    if (!canvasElement) {
      // console.log('screenToLogical: canvasElement is null')
      return { x: 0, y: 0 }
    }

    const canvasRect = canvasElement.getBoundingClientRect()
    const mouseXRelativeToCanvasContainer = clientX - canvasRect.left
    const mouseYRelativeToCanvasContainer = clientY - canvasRect.top

    const logicalX = (mouseXRelativeToCanvasContainer / zoom.value) - panX.value
    const logicalY = (mouseYRelativeToCanvasContainer / zoom.value) - panY.value

    // console.log(`screenToLogical: Client (${clientX}, ${clientY}) -> Logical (${logicalX}, ${logicalY})`)
    return { x: logicalX, y: logicalY }
  }

  // --- Pan Canvas Logic ---
  const startPanCanvas = (event: MouseEvent) => {
    const coords = { clientX: event.clientX, clientY: event.clientY, button: event.button }

    if (coords.button !== 0 || connectionState.isConnecting) {
      // console.log('startPanCanvas: Not panning (button not 0 or connecting)')
      return
    }

    deselectAll()

    panState.isPanning = true
    panState.panStartX = coords.clientX
    panState.panStartY = coords.clientY
    panState.initialPanX = panX.value
    panState.initialPanY = panY.value
    // console.log('startPanCanvas: Panning started')

    document.addEventListener('mousemove', handlePan)
    document.addEventListener('mouseup', stopPan)
    document.addEventListener('touchmove', handlePan, { passive: false })
    document.addEventListener('touchend', stopPan)
  }

  const handlePan = (event: MouseEvent | TouchEvent) => {
    if (!panState.isPanning) return;

    if (event instanceof TouchEvent) {
      event.preventDefault();
    }

    const coords = {
        clientX: event instanceof MouseEvent ? event.clientX : (event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0),
        clientY: event instanceof MouseEvent ? event.clientY : (event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0),
        button: event instanceof MouseEvent ? event.button : 0
    };
    const dx = (coords.clientX - panState.panStartX) / zoom.value;
    const dy = (coords.clientY - panState.panStartY) / zoom.value;

    workflowStore.setPanOffset({ x: panState.initialPanX + dx, y: panState.initialPanY + dy });
    console.log(`handlePan: Pan offset updated to X:${workflowStore.panOffset.x}, Y:${workflowStore.panOffset.y}`);
  }

  const stopPan = () => {
    panState.isPanning = false;
    document.removeEventListener('mousemove', handlePan);
    document.removeEventListener('mouseup', stopPan);
    document.removeEventListener('touchmove', handlePan);
    document.removeEventListener('touchend', stopPan);
    console.log('stopPan: Panning stopped');
  }

  // --- Node Drag Logic ---
  const handleNodeMousedown = (node: WorkflowNode, event: ClientCoordinates) => {
    const coords = getEventClientCoordinates(event)

    if (coords.button !== 0 || connectionState.isConnecting) {
      // console.log('handleNodeMousedown: Not dragging node (button not 0 or connecting)');
      return
    }

    deselectAll()
    selectNode(node.id)

    dragState.isDragging = true
    dragState.dragNode = node

    const nodePosX = node.position?.x ?? node.position_x
    const nodePosY = node.position?.y ?? node.position_y

    const clickLogical = screenToLogical(coords.clientX, coords.clientY)

    dragState.mouseNodeOffsetX = clickLogical.x - nodePosX
    dragState.mouseNodeOffsetY = clickLogical.y - nodePosY
    // console.log(`handleNodeMousedown: Node ${node.id} drag started. Offset X:${dragState.mouseNodeOffsetX}, Y:${dragState.mouseNodeOffsetY}`);

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleNodeMouseup)
    document.addEventListener('touchmove', handleDrag, { passive: false })
    document.addEventListener('touchend', handleNodeMouseup)
  }

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging && !connectionState.isConnecting)
      return

    if (event instanceof TouchEvent) {
      event.preventDefault()
    }

    const coords = {
      clientX: event instanceof MouseEvent ? event.clientX : (event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0),
      clientY: event instanceof MouseEvent ? event.clientY : (event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0),
      button: event instanceof MouseEvent ? event.button : 0,
    }
    const currentLogical = screenToLogical(coords.clientX, coords.clientY);

    if (dragState.isDragging && dragState.dragNode) {
      const newX = currentLogical.x - dragState.mouseNodeOffsetX
      const newY = currentLogical.y - dragState.mouseNodeOffsetY

      updateNodePosition(dragState.dragNode.id, newX, newY)
      // console.log(`handleDrag: Node ${dragState.dragNode.id} moved to X:${newX}, Y:${newY}`); // Too verbose for continuous logging
    }

    if (connectionState.isConnecting) {
      connectionState.endX = currentLogical.x
      connectionState.endY = currentLogical.y
      // console.log(`handleDrag: Connection end updated to X:${connectionState.endX}, Y:${connectionState.endY}`); // Too verbose
    }
  }

  const handleNodeMouseup = () => {
    if (dragState.isDragging) {
      dragState.isDragging = false;
      dragState.dragNode = null;
      dragState.mouseNodeOffsetX = 0;
      dragState.mouseNodeOffsetY = 0;
      console.log('handleNodeMouseup: Node dragging stopped');
    }
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', handleNodeMouseup)
    document.removeEventListener('touchmove', handleDrag)
    document.removeEventListener('touchend', handleNodeMouseup)
  }

  // --- Connection Drawing Logic ---
  const handleStartConnection = (node: WorkflowNode, event: ClientCoordinates) => {
    const coords = getEventClientCoordinates(event)

    if (coords.button !== 0) {
      // console.log('handleStartConnection: Not starting connection (button not 0)')
      return
    }

    deselectAll()
    connectionState.isConnecting = true
    connectionState.startNode = node

    const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node)

    const nodePosX = node.position?.x ?? node.position_x
    const nodePosY = node.position?.y ?? node.position_y

    // Hitung posisi port output (kanan tengah node)
    const startPortLogicalX = nodePosX + nodeWidth + 2
    const startPortLogicalY = nodePosY + nodeHeight / 2

    connectionState.startPortX = startPortLogicalX
    connectionState.startPortY = startPortLogicalY

    // Pindahkan inisialisasi currentMouseLogical ke sini
    const currentMouseLogical = screenToLogical(coords.clientX, coords.clientY)
    connectionState.endX = currentMouseLogical.x // Gunakan currentMouseLogical
    connectionState.endY = currentMouseLogical.y // Gunakan currentMouseLogical
    console.log(`handleStartConnection: Connection drawing started from node ${node.id} at (${startPortLogicalX}, ${startPortLogicalY})`)

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleConnectionEnd);
    document.addEventListener('touchmove', handleDrag, { passive: false })
    document.addEventListener('touchend', handleConnectionEnd);
  }

  const handleConnectionEnd = (event: MouseEvent | TouchEvent) => {
    if (!connectionState.isConnecting) {
      console.log('handleConnectionEnd: Not in connecting state.')
      return
    }

    if (event instanceof TouchEvent) {
      event.preventDefault()
    }

    const coords = {
      clientX: event instanceof MouseEvent ? event.clientX : (event.changedTouches[0]?.clientX || 0),
      clientY: event instanceof MouseEvent ? event.clientY : (event.changedTouches[0]?.clientY || 0),
      button: event instanceof MouseEvent ? event.button : 0,
    };
    const dropLogical = screenToLogical(coords.clientX, coords.clientY);
    console.log(`handleConnectionEnd: Connection dropped at logical (${dropLogical.x}, ${dropLogical.y})`);

    const targetNode = nodes.value.find(node => {
      const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node);

      const nodePosX = node.position?.x ?? node.position_x;
      const nodePosY = node.position?.y ?? node.position_y;

      // Hitung posisi port input (kiri tengah node)
      const inputPortLogicalX = nodePosX - 2;
      const inputPortLogicalY = nodePosY + nodeHeight / 2;

      // Meningkatkan hitRadius untuk deteksi drop yang lebih mudah
      const hitRadius = 80; // Diperbesar dari 25

      const distance = Math.sqrt(
          Math.pow(dropLogical.x - inputPortLogicalX, 2) +
          Math.pow(dropLogical.y - inputPortLogicalY, 2)
      );
      console.log(`handleConnectionEnd: Checking node ${node.id}. Input port (${inputPortLogicalX}, ${inputPortLogicalY}). Distance: ${distance.toFixed(2)}`);

      return distance <= hitRadius;
    })

    if (connectionState.startNode && targetNode && connectionState.startNode.id !== targetNode.id) {
      console.log(`handleConnectionEnd: Potential connection from ${connectionState.startNode.id} to ${targetNode.id}`);
      const existingConnection = connections.value.find(
        (conn) => conn.from === connectionState.startNode?.id && conn.to === targetNode.id
      );

      if (!existingConnection) {
        const newConnection: WorkflowConnection = {
          id: uuidv4(),
          from: connectionState.startNode.id,
          to: targetNode.id,
          from_node: connectionState.startNode.node_id,
          to_node: targetNode.node_id,
          condition: null,
        };
        addConnection(newConnection);
        console.log(`handleConnectionEnd: New connection created: ${newConnection.id}`);
      } else {
        console.log('handleConnectionEnd: Connection already exists between these nodes.');
      }
    } else if (connectionState.startNode && targetNode && connectionState.startNode.id === targetNode.id) {
      console.log('handleConnectionEnd: Cannot connect node to itself.');
    } else {
      console.log('handleConnectionEnd: No valid target node found for connection.');
    }

    resetConnectionState();
  }

  const resetConnectionState = () => {
    connectionState.isConnecting = false;
    connectionState.startNode = null;
    connectionState.startPortX = 0;
    connectionState.startPortY = 0;
    connectionState.endX = 0;
    connectionState.endY = 0;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleConnectionEnd);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleConnectionEnd);
    console.log('resetConnectionState: Connection state reset.');
  }

  return {
    panState,
    dragState,
    connectionState,
    startPanCanvas,
    handleNodeMousedown,
    handleStartConnection,
    handleConnectionEnd,
  }
}
