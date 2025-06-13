// useWorkflowInteractions.ts
import { reactive, computed } from 'vue';
import type { Ref } from 'vue';
import type { WorkflowConnectionCoba, WorkflowNodeCoba } from '@/stores/WorkfloStore'; // Pastikan path benar
import { useCobaWorkflowStore } from '@/stores/WorkfloStore'; // Impor Pinia store
import { v4 as uuidv4 } from 'uuid'; // Pastikan Anda menginstal uuid

// Helper untuk mendapatkan koordinat client dari MouseEvent atau TouchEvent
interface ClientCoordinates {
  clientX: number;
  clientY: number;
  button: number; // Mouse button (0 for left, 1 for middle, 2 for right)
}

const getEventClientCoordinates = (event: ClientCoordinates): ClientCoordinates => {
  // Dengan perubahan di WorkflowCanvas.vue, event yang masuk ke sini seharusnya
  // sudah berupa objek sederhana dengan properti clientX, clientY, dan button
  console.log('DEBUG: getEventClientCoordinates - Received ClientCoordinates:', event);
  return event; // Langsung kembalikan karena sudah dalam format yang benar
}

interface UseCobaWorkflowInteractionsOptions {
  nodes: Ref<WorkflowNodeCoba[]>;
  connections: Ref<WorkflowConnectionCoba[]>;
  zoom: Ref<number>;
  panX: Ref<number>;
  panY: Ref<number>;
  canvasContainerRef: Ref<HTMLElement | null>;
  deselectAll: () => void;
  selectNode: (nodeId: string) => void;
  addConnection: (connection: WorkflowConnectionCoba) => void;
  updateNodePosition: (nodeId: string, newX: number, newY: number) => void;
  getNodeDimensions: (node: WorkflowNodeCoba) => { width: number; height: number };
}

export function useCobaWorkflowInteractions(options: UseCobaWorkflowInteractionsOptions) {
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

  const panState = reactive({
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    initialPanX: 0,
    initialPanY: 0,
  })

  const dragState = reactive({
    isDragging: false,
    dragNode: null as WorkflowNode | null,
    mouseNodeOffsetX: 0,
    mouseNodeOffsetY: 0,
  })

  const connectionState = reactive({
    isConnecting: false,
    startNode: null as WorkflowNode | null,
    startPortX: 0,
    startPortY: 0,
    endX: 0,
    endY: 0,
  })

  const screenToLogical = (clientX: number, clientY: number) => {
    const canvasElement = canvasContainerRef.value;
    if (!canvasElement) {
      // Tambahkan log yang lebih jelas untuk debugging
      console.error('ERROR: Canvas container ref not available for coordinate conversion. Returning 0,0. This might happen before canvas is fully mounted.');
      return { x: 0, y: 0 }; // Kembalikan nilai default yang aman
    }

    const canvasRect = canvasElement.getBoundingClientRect();
    console.log('DEBUG: screenToLogical - Canvas Rect (left, top, width, height):', canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);

    const mouseXRelativeToCanvasContainer = clientX - canvasRect.left;
    const mouseYRelativeToCanvasContainer = clientY - canvasRect.top;

    const logicalX = (mouseXRelativeToCanvasContainer / zoom.value) - panX.value;
    const logicalY = (mouseYRelativeToCanvasContainer / zoom.value) - panY.value;

    console.log(`DEBUG: screenToLogical (Client: ${clientX.toFixed(2)},${clientY.toFixed(2)}) -> Mouse Relative to Canvas: ${mouseXRelativeToCanvasContainer.toFixed(2)},${mouseYRelativeToCanvasContainer.toFixed(2)} -> Logical: ${logicalX.toFixed(2)},${logicalY.toFixed(2)}`);
    return { x: logicalX, y: logicalY };
  }
  

  const startPanCanvas = (event: MouseEvent) => {
    // Untuk pan, kita masih menerima MouseEvent langsung dari WorkflowCanvas.
    // Jadi ambil langsung properti dari MouseEvent.
    const coords = { clientX: event.clientX, clientY: event.clientY, button: event.button };
    console.log('useWorkflowInteractions: startPanCanvas triggered. ClientX:', coords.clientX, 'ClientY:', coords.clientY, 'Button:', coords.button);

    if (coords.button !== 0 || connectionState.isConnecting) {
      console.warn('useWorkflowInteractions: Pan prevented due to wrong button or connecting state.', {
        button: coords.button,
        isConnecting: connectionState.isConnecting
      });
      return;
    }

    deselectAll();

    panState.isPanning = true;
    panState.panStartX = coords.clientX;
    panState.panStartY = coords.clientY;
    panState.initialPanX = panX.value;
    panState.initialPanY = panY.value;

    document.addEventListener('mousemove', handlePan);
    document.addEventListener('mouseup', stopPan);
    document.addEventListener('touchmove', handlePan, { passive: false });
    document.addEventListener('touchend', stopPan);
    console.log('useWorkflowInteractions: Canvas pan started.');
  }

  const handlePan = (event: MouseEvent | TouchEvent) => {
    if (!panState.isPanning) return;

    if (event instanceof TouchEvent) {
      event.preventDefault();
    }

    // Untuk handlePan, kita masih menerima MouseEvent atau TouchEvent dari document
    // Jadi ambil langsung properti dari event
    const coords = {
        clientX: event instanceof MouseEvent ? event.clientX : (event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0),
        clientY: event instanceof MouseEvent ? event.clientY : (event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0),
        button: event instanceof MouseEvent ? event.button : 0
    };
    const dx = (coords.clientX - panState.panStartX) / zoom.value;
    const dy = (coords.clientY - panState.panStartY) / zoom.value;

    workflowStore.setPanOffset({ x: panState.initialPanX + dx, y: panState.initialPanY + dy });
  }

  const stopPan = () => {
    panState.isPanning = false;
    document.removeEventListener('mousemove', handlePan);
    document.removeEventListener('mouseup', stopPan);
    document.removeEventListener('touchmove', handlePan);
    document.removeEventListener('touchend', stopPan);
    console.log('useWorkflowInteractions: Canvas pan stopped.');
  }

  const handleNodeMousedown = (node: WorkflowNodeCoba, event: ClientCoordinates) => {
    const coords = getEventClientCoordinates(event); // Sekarang ini hanya akan mengembalikan objek yang sudah valid
    console.log('DEBUG: handleNodeMousedown - Node ID:', node.id);
    console.log('DEBUG: handleNodeMousedown - ClientX/Y (from getEventClientCoordinates):', coords.clientX, coords.clientY);

    if (coords.button !== 0 || connectionState.isConnecting) {
      console.warn('useWorkflowInteractions: Drag prevented due to wrong button, or connecting state.', {
        button: coords.button,
        isConnecting: connectionState.isConnecting
      });
      return;
    }

    deselectAll();
    selectNode(node.id);

    dragState.isDragging = true;
    dragState.dragNode = node;

    const clickLogical = screenToLogical(coords.clientX, coords.clientY);

    // Hitung offset mouse dari posisi kiri atas node
    dragState.mouseNodeOffsetX = clickLogical.x - node.position.x;
    dragState.mouseNodeOffsetY = clickLogical.y - node.position.y;

    console.log('--- MOUSE DOWN DEBUG (Node Drag) ---');
    console.log('Node ID:', node.id);
    console.log('Node Position (Logical):', node.position.x.toFixed(2), node.position.y.toFixed(2));
    console.log('ClientX/Y (Viewport) received by handleNodeMousedown:', coords.clientX.toFixed(2), coords.clientY.toFixed(2));
    console.log('Zoom:', zoom.value);
    console.log('PanX/Y:', panX.value.toFixed(2), panY.value.toFixed(2));
    console.log('Click Pos In Canvas (Logical):', clickLogical.x.toFixed(2), clickLogical.y.toFixed(2));
    console.log('Mouse Offset from Node (Logical):', dragState.mouseNodeOffsetX.toFixed(2), dragState.mouseNodeOffsetY.toFixed(2));

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleNodeMouseup);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleNodeMouseup);
    console.log('useWorkflowInteractions: Node drag started.');
  }

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging && !connectionState.isConnecting) return;

    if (event instanceof TouchEvent) {
      event.preventDefault();
    }

    // Untuk handleDrag, kita masih menerima MouseEvent atau TouchEvent dari document
    // Jadi ambil langsung properti dari event
    const coords = {
        clientX: event instanceof MouseEvent ? event.clientX : (event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0),
        clientY: event instanceof MouseEvent ? event.clientY : (event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0),
        button: event instanceof MouseEvent ? event.button : 0
    };
    const currentLogical = screenToLogical(coords.clientX, coords.clientY);

    if (dragState.isDragging && dragState.dragNode) {
      const newX = currentLogical.x - dragState.mouseNodeOffsetX;
      const newY = currentLogical.y - dragState.mouseNodeOffsetY;

      updateNodePosition(dragState.dragNode.id, newX, newY);
    }

    if (connectionState.isConnecting) {
      connectionState.endX = currentLogical.x;
      connectionState.endY = currentLogical.y;
    }
  }

  const handleNodeMouseup = () => {
    if (dragState.isDragging) {
      console.log('useWorkflowInteractions: Node drag stopped.');
      dragState.isDragging = false;
      dragState.dragNode = null;
      dragState.mouseNodeOffsetX = 0;
      dragState.mouseNodeOffsetY = 0;
    }
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleNodeMouseup);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleNodeMouseup);
  }

  const handleStartConnection = (node: WorkflowNodeCoba, event: ClientCoordinates) => {
    const coords = getEventClientCoordinates(event); // Sekarang ini hanya akan mengembalikan objek yang sudah valid
    console.log('useWorkflowInteractions: handleStartConnection triggered.', {
      nodeId: node.id,
      clientX: coords.clientX,
      clientY: coords.clientY,
      button: coords.button
    });

    if (coords.button !== 0) {
      console.warn('useWorkflowInteractions: Connection start prevented due to wrong button.');
      return;
    }

    deselectAll();
    connectionState.isConnecting = true;
    connectionState.startNode = node;

    const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node);

    // Hitung posisi port output (kanan tengah node)
    const startPortLogicalX = node.position.x + nodeWidth + 2; // +2 untuk jarak dari tepi node
    const startPortLogicalY = node.position.y + nodeHeight / 2;

    connectionState.startPortX = startPortLogicalX;
    connectionState.startPortY = startPortLogicalY;

    const currentMouseLogical = screenToLogical(coords.clientX, coords.clientY);
    connectionState.endX = currentMouseLogical.x;
    connectionState.endY = currentMouseLogical.y;

    console.log('Connection started from Node:', node.id, 'Port Logical:', connectionState.startPortX.toFixed(2), connectionState.startPortY.toFixed(2));
    console.log('Connection initial End Logical:', connectionState.endX.toFixed(2), connectionState.endY.toFixed(2));

    document.addEventListener('mousemove', handleDrag); // Menggunakan handleDrag untuk menggambar koneksi sementara
    document.addEventListener('mouseup', handleConnectionEnd);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleConnectionEnd);
  }

  const handleConnectionEnd = (event: MouseEvent | TouchEvent) => {
    if (!connectionState.isConnecting) return;

    if (event instanceof TouchEvent) {
      event.preventDefault();
    }

    // Untuk handleConnectionEnd, kita masih menerima MouseEvent atau TouchEvent dari document
    // Jadi ambil langsung properti dari event
    const coords = {
        clientX: event instanceof MouseEvent ? event.clientX : (event.changedTouches[0]?.clientX || 0),
        clientY: event instanceof MouseEvent ? event.clientY : (event.changedTouches[0]?.clientY || 0),
        button: event instanceof MouseEvent ? event.button : 0
    };
    const dropLogical = screenToLogical(coords.clientX, coords.clientY);

    console.log('useWorkflowInteractions: handleConnectionEnd triggered. Drop Logical X,Y:', dropLogical.x.toFixed(2), dropLogical.y.toFixed(2));

    const targetNode = nodes.value.find(node => {
      const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node);

      // Hitung posisi port input (kiri tengah node)
      const inputPortLogicalX = node.position.x - 2; // -2 untuk jarak dari tepi node
      const inputPortLogicalY = node.position.y + nodeHeight / 2;

      const hitRadius = 25; // Radius area deteksi drop koneksi

      const distance = Math.sqrt(
          Math.pow(dropLogical.x - inputPortLogicalX, 2) +
          Math.pow(dropLogical.y - inputPortLogicalY, 2)
      );

      return distance <= hitRadius;
    })

    if (connectionState.startNode && targetNode && connectionState.startNode.id !== targetNode.id) {
      const existingConnection = connections.value.find(
        (conn) => conn.from === connectionState.startNode?.id && conn.to === targetNode.id
      );

      if (!existingConnection) {
        const newConnection: WorkflowConnectionCoba = {
          id: uuidv4(),
          from: connectionState.startNode.id,
          to: targetNode.id,
          from_node: connectionState.startNode.node_id,
          to_node: targetNode.node_id,
          condition: null,
        };
        addConnection(newConnection);
        console.log('useWorkflowInteractions: New connection created:', newConnection);
      } else {
        console.warn('useWorkflowInteractions: Connection already exists between these nodes.');
      }
    } else if (connectionState.startNode && targetNode && connectionState.startNode.id === targetNode.id) {
        console.warn('useWorkflowInteractions: Cannot connect a node to itself.');
    } else {
      console.log('useWorkflowInteractions: Connection dropped on empty canvas or no valid target node.');
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
    console.log('useWorkflowInteractions: Connection drawing state reset.');
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