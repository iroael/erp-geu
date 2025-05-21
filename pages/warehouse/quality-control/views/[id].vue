<script setup lang="ts">
import { ref } from 'vue'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NuxtLink } from '#components'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

const activeTab = ref('info')
const expandedRow = ref<string | null>(null)

const toggleRow = (poNo: string) => {
  expandedRow.value = expandedRow.value === poNo ? null : poNo
}

// QC Info + QC Parameter
const qcData = {
  qcNumber: 'QC-20250519-001',
  qcDate: '2025-05-19',
  deliveryOrder: { number: 'DO-20250519-001', link: '/delivery-order/DO-20250519-001' },
  vehicle: 'B 1234 XYZ (Tank Truck 10 KL)',
  driver: 'Suryanto',
  warehouse: 'Gudang Cikupa',
  status: 'Passed',
  qcBy: 'Budi Santoso'
}

const qcParameters = [
  {
    po_no: 'PO/2025/05/001',
    supplier: 'Warung Padang Jaya',
    parameter: 'Warna: Kuning Gelap, Bau: Netral, pH: 6.5'
  },
  {
    po_no: 'PO/2025/05/002',
    supplier: 'RM Sederhana',
    parameter: 'Warna: Coklat Muda, Bau: Sedikit Asam, pH: 5.9'
  }
]

const qcParameterDetails = {
  'PO/2025/05/001': [
    { name: 'Kadar Air', unit: '%', result: 12.5 },
    { name: 'Warna', unit: 'Skala', result: 3 },
    { name: 'Bau', unit: '-', result: 0 }
  ],
  'PO/2025/05/002': [
    { name: 'Kadar Air', unit: '%', result: 13.2 },
    { name: 'Warna', unit: 'Skala', result: 2 },
    { name: 'Bau', unit: '-', result: 0 }
  ]
}

const parameterReference = [
  {
    id: 1,
    name: 'Kadar Air',
    unit: '%',
    min_value: 10,
    max_value: 14,
    description: 'Standar kadar air'
  },
  {
    id: 2,
    name: 'Warna',
    unit: 'Skala',
    min_value: 1,
    max_value: 5,
    description: '1 = Sangat Gelap, 5 = Cerah'
  },
  {
    id: 3,
    name: 'Bau',
    unit: '-',
    min_value: 0,
    max_value: 0,
    description: '0 = Tidak ada bau'
  }
]

const relations = [
  {
    qc_no: 'QC-20250519-001',
    do_no: 'DO-20250519-001',
    po_no: 'PO/2025/05/001',
    wo_no: 'WO/2025/04/011'
  },
  {
    qc_no: 'QC-20250519-001',
    do_no: 'DO-20250519-001',
    po_no: 'PO/2025/05/002',
    wo_no: 'WO/2025/04/012'
  }
]
const getStatus = (poNo: string) => {
  const results = qcParameterDetails[poNo]
  return results.every(result => {
    const ref = parameterReference.find(p => p.name === result.name)
    if (!ref) return false
    return result.result >= ref.min_value && result.result <= ref.max_value
  }) ? 'Passed' : 'Failed'
}

</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Detail QC</h1>

    <Tabs v-model="activeTab">
      <TabsList class="mb-4">
        <TabsTrigger value="info">Info QC</TabsTrigger>
        <TabsTrigger value="relation">Relation</TabsTrigger>
      </TabsList>

      <!-- INFO QC TAB -->
      <TabsContent value="info">
        <!-- Informasi QC -->
        <Card class="mb-6">
          <CardHeader><CardTitle>Informasi QC</CardTitle></CardHeader>
          <CardContent>
            <table class="w-full text-sm border border-gray-200">
              <tbody>
                <tr class="border-b"><td class="p-2 font-medium w-1/3">QC Number</td><td class="p-2">{{ qcData.qcNumber }}</td></tr>
                <tr class="border-b"><td class="p-2 font-medium">QC Date</td><td class="p-2">{{ qcData.qcDate }}</td></tr>
                <tr class="border-b">
                  <td class="p-2 font-medium">Delivery Order</td>
                  <td class="p-2">
                    <NuxtLink :to="qcData.deliveryOrder.link" class="text-blue-600 underline">
                      {{ qcData.deliveryOrder.number }}
                    </NuxtLink>
                  </td>
                </tr>
                <tr class="border-b"><td class="p-2 font-medium">Vehicle</td><td class="p-2">{{ qcData.vehicle }}</td></tr>
                <tr class="border-b"><td class="p-2 font-medium">Driver</td><td class="p-2">{{ qcData.driver }}</td></tr>
                <tr class="border-b"><td class="p-2 font-medium">Destination Warehouse</td><td class="p-2">{{ qcData.warehouse }}</td></tr>
                <tr class="border-b"><td class="p-2 font-medium">Status</td><td class="p-2"><Badge variant="success">{{ qcData.status }}</Badge></td></tr>
                <tr><td class="p-2 font-medium">QC By</td><td class="p-2">{{ qcData.qcBy }}</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <!-- QC PARAMETER -->
        <Card class="mb-6">
          <CardHeader><CardTitle>Detail</CardTitle></CardHeader>
          <CardContent>
            <table class="w-full text-sm border border-gray-200 mt-2">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 border w-6"></th>
                  <th class="p-2 border">PO Number</th>
                  <th class="p-2 border">Supplier</th>
                  <th class="p-2 border">QC Parameter</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in qcParameters" :key="item.po_no">
                  <tr
                    class="border-t cursor-pointer hover:bg-gray-50"
                    @click="toggleRow(item.po_no)"
                  >
                    <td class="p-2 border text-center">
                      <component :is="expandedRow === item.po_no ? ChevronDown : ChevronRight" class="w-4 h-4 inline-block" />
                    </td>
                    <td class="p-2 border">{{ item.po_no }}</td>
                    <td class="p-2 border">{{ item.supplier }}</td>
                    <td class="p-2 border">
                      <Badge :variant="getStatus(item.po_no) === 'Passed' ? 'success' : 'destructive'">
                        {{ getStatus(item.po_no) }}
                      </Badge>
                    </td>
                  </tr>

                  <!-- CHILD DETAIL ROW -->
                  <tr v-if="expandedRow === item.po_no" class="bg-gray-50">
                    <td colspan="4" class="p-4 border">
                      <p class="font-semibold mb-2">Detail Hasil Pengujian:</p>
                      <table class="w-full text-sm border">
                        <thead class="bg-gray-100">
                          <tr>
                            <th class="p-2 border">Parameter</th>
                            <th class="p-2 border">Unit</th>
                            <th class="p-2 border">Hasil</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="param in qcParameterDetails[item.po_no]" :key="param.name">
                            <td class="p-2 border">{{ param.name }}</td>
                            <td class="p-2 border">{{ param.unit }}</td>
                            <td class="p-2 border">{{ param.result }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- RELATION TAB -->
      <TabsContent value="relation">
        <Card>
          <CardHeader><CardTitle>Relation Data</CardTitle></CardHeader>
          <CardContent>
            <table class="w-full text-sm border border-gray-200 mt-2">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 border">QC No</th>
                  <th class="p-2 border">Delivery Order</th>
                  <th class="p-2 border">PO Number</th>
                  <th class="p-2 border">Work Order</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rel in relations" :key="rel.po_no" class="border-t">
                  <td class="p-2 border">{{ rel.qc_no }}</td>
                  <td class="p-2 border">{{ rel.do_no }}</td>
                  <td class="p-2 border">{{ rel.po_no }}</td>
                  <td class="p-2 border">{{ rel.wo_no }}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
