// stores/workflow.ts
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { toRaw } from 'vue'
import type { Workflow, WorkflowsResponse} from '~/types/schema'

// Definisi Interface untuk Node dan Connection (disesuaikan dengan respons API)
export interface WorkflowNode {
  id: string; // ID unik dari API
  node_id: string; // ID node yang digunakan dalam koneksi (dari API)
  label: string;
  type: 'start' | 'end' | 'decision' | 'notification' | 'task' | 'staff_submission' | 'approval';
  description?: string;
  role?: string;
  outputs?: string[]; // Dari API: array of strings seperti ["Setuju", "Tolak"]
  message?: string;
  position_x: number; // Dari API
  position_y: number; // Dari API
  // Properti internal yang akan kita gunakan setelah transformasi
  position?: { x: number; y: number }; // Ditambahkan setelah transformasi dari position_x/y
  transformedOutputs?: { id: string; label: string }[]; // Ditambahkan setelah transformasi dari outputs
}

export interface WorkflowConnection {
  id: string; // ID unik dari API
  from_node: string; // node_id dari node sumber (dari API)
  to_node: string;   // node_id dari node tujuan (dari API)
  condition: string | null;
  outputId?: string; // Menambahkan properti outputId untuk melacak output mana yang digunakan
  // Properti internal yang akan kita gunakan setelah transformasi
  from?: string; // ID node frontend (setelah find dari node_id)
  to?: string;   // ID node frontend (setelah find dari node_id)
  temp_start_x?: number; // Digunakan untuk koneksi sementara (saat sedang digambar)
  temp_start_y?: number; // Digunakan untuk koneksi sementara
  temp_end_x?: number;   // Digunakan untuk koneksi sementara
  temp_end_y?: number;   // Digunakan untuk koneksi sementara
}

// Definisi Interface untuk WorkflowDefinition (disesuaikan dengan respons API)
export interface WorkflowDefinition {
  id: string;
  workflow_type: string;
  workflow_name: string;
  revision: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

interface State {
  workflow: Workflow[]
  total: number
  isLoading: boolean
  error: string | null
}

// Definisi Pinia Store
export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    nodes: [] as WorkflowNode[], // Nodes dalam format internal (dengan .position)
    connections: [] as WorkflowConnection[], // Connections dalam format internal (dengan .from, .to)
    selectedNodeId: null as string | null,
    selectedConnection: null as WorkflowConnection | null, // Pastikan tipe ini konsisten
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    isSaving: false, // State untuk indikator loading saat menyimpan
    saveError: null as string | null, // State untuk error saat menyimpan
    workflow: [],
    total: 0,
    isLoading: false,
    error: null,
  }),
  getters: {
    selectedNode(state): WorkflowNode | null {
      return state.selectedNodeId ? state.nodes.find(node => node.id === state.selectedNodeId) || null : null
    },
    getSelectedConnection(state): WorkflowConnection | null {
      return state.selectedConnection
    },
    currentNodes(state): WorkflowNode[] {
      return state.nodes
    },
    currentConnections(state): WorkflowConnection[] {
      return state.connections
    },
  },
  actions: {
    setNodes(nodes: WorkflowNode[]) {
      this.nodes = nodes
    },
    setConnections(connections: WorkflowConnection[]) {
      this.connections = connections
    },
    addNode(node: WorkflowNode) {
      this.nodes.push(node)
    },
    updateNodePosition(nodeId: string, newX: number, newY: number) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (node && node.position) {
        node.position.x = newX
        node.position.y = newY
      }
    },
    updateNode(updatedNode: WorkflowNode) {
      const index = this.nodes.findIndex(n => n.id === updatedNode.id)
      if (index !== -1) {
        Object.assign(this.nodes[index], updatedNode)
      }
    },
    removeNode(nodeId: string) {
      this.nodes = this.nodes.filter(node => node.id !== nodeId)
      this.connections = this.connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId)
      this.deselectAll()
    },
    addConnection(connection: WorkflowConnection) {
      this.connections.push(connection)
    },
    removeConnection(connectionId: string) {
      this.connections = this.connections.filter(conn => conn.id !== connectionId)
      this.deselectAll()
    },
    selectNode(nodeId: string | null) {
      this.selectedNodeId = nodeId
      this.selectedConnection = null
    },
    selectConnection(connection: WorkflowConnection | null) {
      this.$patch((state) => {
        state.selectedNodeId = null
        state.selectedConnection = connection ? { ...toRaw(connection) } : null
      })
    },
    deselectAll() {
      this.$patch((state) => {
        state.selectedNodeId = null
        state.selectedConnection = null
      })
    },
    setZoom(newZoom: number) {
      this.zoom = newZoom
    },
    setPanOffset({ x, y }: { x: number, y: number }) {
      this.panOffset.x = x
      this.panOffset.y = y
    },
    clearWorkflowState() {
      this.nodes = []
      this.connections = []
      this.selectedNodeId = null
      this.selectedConnection = null
      this.zoom = 1
      this.panOffset = { x: 0, y: 0 }
    },

    async fetchWowrkflowDatatables(start = 0, length = 10) {
      const config = useRuntimeConfig()
      const BASE_URL = `${config.public.API_BASE_URL}/workflows`
      this.isLoading = true
      try {
        const res = await fetch(`${BASE_URL}?start=${start}&length=${length}`, {
          headers: {
            'accept': '*/*',
            // Authorization: `${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch workflow')

        const data: WorkflowsResponse = await res.json()

        console.log('Fetched data workflow =>', data.data)

        this.workflow = data.data
        this.total = data.recordsTotal
      }
      catch (err: any) {
        this.error = err.message ?? 'Unknown error'
      }
      finally {
        this.isLoading = false
      }
    },

    async fetchWorkflows(WorkflowType: string): Promise<WorkflowDefinition[]> {
      try {
        // const response = await fetch(`http://localhost:5001/api/v1/workflows/revisions/work_order`, {
        const response = await fetch(`http://localhost:5001/api/v1/workflows/revisions/${WorkflowType}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        // console.log('API WorkflowType:', WorkflowType)
        // console.log('result response:', result)
        if (result.success && Array.isArray(result.data)) {
          return result.data as WorkflowDefinition[]
        }
        else {
          console.error('API response format is incorrect.', result)
          return []
        }
      }
      catch (error) {
        console.error('Error fetching workflows:', error)
        return []
      }
    },

    setCurrentWorkflowFromApi(workflowData: WorkflowDefinition) {
      const transformedNodes: WorkflowNode[] = workflowData.nodes.map(node => ({
        ...node,
        position: { x: node.position_x, y: node.position_y },
        // Pastikan node.type selalu lowercase saat transformasi
        type: node.type.toLowerCase() as any,
        transformedOutputs: node.outputs ? node.outputs.map(outputLabel => ({ id: uuidv4(), label: outputLabel })) : [],
      }))

      const transformedConnections: WorkflowConnection[] = workflowData.connections.map(conn => {
        const fromNode = transformedNodes.find(n => n.node_id === conn.from_node)
        const toNode = transformedNodes.find(n => n.node_id === conn.to_node)
        // Mencari outputId yang sesuai dengan kondisi koneksi
        let matchedOutputId: string | undefined
        if (fromNode && fromNode.transformedOutputs && conn.condition) {
          const output = fromNode.transformedOutputs.find(o => o.label === conn.condition)
          if (output) {
            matchedOutputId = output.id
          }
        }

        return {
          ...conn,
          from: fromNode ? fromNode.id : '',
          to: toNode ? toNode.id : '',
          outputId: matchedOutputId,
        }
      })

      this.setNodes(transformedNodes)
      this.setConnections(transformedConnections)
      this.deselectAll()
      this.setZoom(1)
      this.setPanOffset({ x: 0, y: 0 })
    },

    async saveWorkflowToApi(payload: WorkflowDefinition): Promise<any> {
      this.isSaving = true
      this.saveError = null
      try {
        // const httpMethod = payload.id && payload.id !== '' ? 'PUT' : 'POST' // Use PUT if ID exists
        const apiUrl = `http://localhost:5001/api/v1/workflows`
        // const apiUrl = `http://localhost:5001/api/v1/workflows${httpMethod === 'PUT' ? `/${payload.id}` : ''}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to save workflow: ${errorData.message || response.statusText}`)
        }

        const result = await response.json()
        return result // Return the result for the calling component
      }
      catch (error: any) {
        this.saveError = error.message
        console.error('Error saving workflow:', error)
        throw error // Re-throw the error so the calling component can handle it
      }
      finally {
        this.isSaving = false
      }
    },
  },
})
