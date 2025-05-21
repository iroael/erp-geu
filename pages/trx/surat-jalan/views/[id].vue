<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Timeline from '@/components/work-order/components/Timeline.vue'

interface POItem {
  id: number
  po_no: string
  supplier_name: string
  volume: number
  price_per_liter: number
  status: string
}

interface Driver {
  id: number
  name: string
  phone: string
  license_number: string
}

interface Armada {
  id: number
  type: string
  plate_number: string
  capacity: number
}

interface DeliveryOrder {
  id: number
  do_no: string
  tanggal_kirim: string
  driver: Driver
  armada: Armada
  status: string
  catatan: string
  created_at: string
  updated_at: string
  po_id: POItem[]
}

const deliveryOrders: DeliveryOrder[] = [
  {
    id: 1,
    do_no: "DO/2025/05/0201",
    tanggal_kirim: "2025-05-20",
    driver: {
      id: 1,
      name: "Budi Santoso",
      phone: "081234567890",
      license_number: "SIM12345678"
    },
    armada: {
      id: 1,
      type: "Truk Engkel",
      plate_number: "B 1234 CD",
      capacity: 5000
    },
    status: "Draft",
    catatan: "Pengiriman sesuai jadwal",
    created_at: "2025-05-19T08:30:00Z",
    updated_at: "2025-05-19T08:30:00Z",
    po_id: [
      {
        id: 101,
        po_no: "PO/2025/05/001",
        supplier_name: "Warung Padang Jaya",
        volume: 120,
        price_per_liter: 5000,
        status: "Approved"
      },
      {
        id: 102,
        po_no: "PO/2025/05/002",
        supplier_name: "Rumah Makan Sederhana",
        volume: 100,
        price_per_liter: 4800,
        status: "Approved"
      }
    ]
  }
]

const route = useRoute()
const id = Number(route.params.id)

const originalDO = computed(() =>
  deliveryOrders.find(doItem => doItem.id === id)
)

const deliveryOrder = ref<DeliveryOrder | null>(null)

if (originalDO.value) {
  deliveryOrder.value = { ...originalDO.value }
}

const totalVolume = computed(() =>
  deliveryOrder.value?.po_id.reduce((sum, po) => sum + po.volume, 0) ?? 0
)

const totalHarga = computed(() =>
  deliveryOrder.value?.po_id.reduce((sum, po) => sum + po.volume * po.price_per_liter, 0) ?? 0
)

function approve() {
  alert('Disetujui')
}
function reject() {
  alert('Ditolak')
}
function submit() {
  alert('Data disimpan')
}
</script>
<template>
  <div class="flex flex-col gap-4 w-full">
    <h2 class="text-2xl font-bold">Delivery Order</h2>
    <div class="flex w-full gap-6 items-start">
      <!-- Left Column -->
      <div class="flex-1 space-y-4">
        <Tabs default-value="info" class="w-full">
          <TabsList class="flex w-full gap-2">
            <TabsTrigger value="info" class="flex-1">Info</TabsTrigger>
            <TabsTrigger value="po" class="flex-1">Data PO</TabsTrigger>
            <TabsTrigger value="logistik" class="flex-1">Driver & Armada</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Info Umum</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div><strong>Nomor DO:</strong> {{ deliveryOrder?.do_no }}</div>
                <div><strong>Tanggal Kirim:</strong> {{ deliveryOrder?.tanggal_kirim }}</div>
                <div><strong>Status:</strong> {{ deliveryOrder?.status }}</div>
                <div><strong>Catatan:</strong> {{ deliveryOrder?.catatan }}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="po">
            <Card>
              <CardHeader>
                <CardTitle>Data PO</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <table class="w-full text-sm text-left border border-gray-200">
                  <thead class="bg-gray-100 text-gray-700">
                    <tr>
                      <th class="p-2 border">PO No</th>
                      <th class="p-2 border">Supplier</th>
                      <th class="p-2 border text-right">Volume</th>
                      <th class="p-2 border text-right">Harga/Liter</th>
                      <th class="p-2 border text-right">Jumlah</th>
                      <th class="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="po in deliveryOrder?.po_id" :key="po.id">
                      <td class="p-2 border">{{ po.po_no }}</td>
                      <td class="p-2 border">{{ po.supplier_name }}</td>
                      <td class="p-2 border text-right">{{ po.volume }}</td>
                      <td class="p-2 border text-right">Rp {{ po.price_per_liter.toLocaleString() }}</td>
                      <td class="p-2 border text-right">Rp {{ (po.volume * po.price_per_liter).toLocaleString() }}</td>
                      <td class="p-2 border">{{ po.status }}</td>
                    </tr>
                    <tr class="bg-gray-50 font-semibold">
                      <td colspan="4" class="p-2 text-right border">Total</td>
                      <td class="p-2 text-right border">Rp {{ totalHarga.toLocaleString() }}</td>
                      <td class="p-2 border"></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logistik">
            <Card>
              <CardHeader>
                <CardTitle>Info Driver & Armada</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div><strong>Nama Driver:</strong> {{ deliveryOrder?.driver.name }}</div>
                <div><strong>No. Telepon:</strong> {{ deliveryOrder?.driver.phone }}</div>
                <div><strong>No. SIM:</strong> {{ deliveryOrder?.driver.license_number }}</div>
                <hr />
                <div><strong>Jenis Armada:</strong> {{ deliveryOrder?.armada.type }}</div>
                <div><strong>No. Polisi:</strong> {{ deliveryOrder?.armada.plate_number }}</div>
                <div><strong>Kapasitas:</strong> {{ deliveryOrder?.armada.capacity }} kg</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Right Column -->
      <div class="w-[500px] space-y-4">
        <div class="flex gap-2 justify-between">
          <Button variant="destructive" class="w-full" @click="reject">Reject</Button>
          <Button class="w-full" @click="approve">Approve</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Komentar</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Tulis komentarmu..." />
          </CardContent>
        </Card>

        <Button class="w-full" @click="submit">Submit</Button>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
