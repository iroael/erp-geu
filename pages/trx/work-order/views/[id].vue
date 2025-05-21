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
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Timeline from '@/components/work-order/components/Timeline.vue'


interface WorkOrder {
  id: number
  kode_wo: string
  tanggal_wo: string
  kode_supplier: string
  nama_supplier: string
  lokasi: string
  jenis_pekerjaan: string
  volume_estimasi: number
  status: string
  remark: string
}

const workOrders: WorkOrder[] = [
  {
    id: 1,
    kode_wo: "WO-0001",
    tanggal_wo: "2025-05-10",
    kode_supplier: "SUP-001",
    nama_supplier: "Warung Sederhana",
    lokasi: "Jl. Sudirman",
    jenis_pekerjaan: "Pengambilan",
    volume_estimasi: 50,
    status: "Draft",
    remark: "Admin"
  }
]

const route = useRoute()
const id = Number(route.params.id)

const originalWorkOrder = computed(() =>
  workOrders.find(wo => wo.id === id)
)

const workOrder = ref<WorkOrder | null>(null)

if (originalWorkOrder.value) {
  workOrder.value = { ...originalWorkOrder.value }
}

function saveChanges() {
  alert('Simpan perubahan')
}
function approve() {
  alert('Disetujui')
}
function reject() {
  alert('Ditolak')
}

interface SupplierItem {
  kode: string
  nama: string
  qty: number
  satuan: string
  harga: number
}

const dataSupplier: SupplierItem[] = [
  {
    kode: "SUP-001",
    nama: "PT. Sumber Makmur",
    qty: 10,
    satuan: "kg",
    harga: 20000,
  },
  {
    kode: "SUP-002",
    nama: "CV. Berkah Abadi",
    qty: 5,
    satuan: "liter",
    harga: 50000,
  },
]

const totalJumlah = computed(() =>
  dataSupplier.reduce((sum, item) => sum + item.qty * item.harga, 0)
)
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <h2 class="text-2xl font-bold">Work Order</h2>
    <div class="flex w-full gap-6 items-start">
      <!-- Left Column -->
      <div class="flex-1 space-y-4">
        <Tabs default-value="info" class="w-full">
          <TabsList class="flex w-full gap-2">
            <TabsTrigger value="info" class="flex-1">Info</TabsTrigger>
            <TabsTrigger value="supplier" class="flex-1">Data Supplier</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Info Umum</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <Label for="kode_wo">Kode WO</Label>
                  <Input id="kode_wo" v-model="workOrder!.kode_wo" />
                </div>
                <div>
                  <Label for="tanggal_wo">Tanggal WO</Label>
                  <Input type="date" id="tanggal_wo" v-model="workOrder!.tanggal_wo" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplier">
            <Card>
              <CardHeader>
                <CardTitle>Data Supplier</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
               <table class="w-full text-sm text-left border border-gray-200">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="p-2 border">Kode Supplier</th>
        <th class="p-2 border">Nama</th>
        <th class="p-2 border text-right">Qty</th>
        <th class="p-2 border">Satuan</th>
        <th class="p-2 border text-right">Harga</th>
        <th class="p-2 border text-right">Jumlah</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in dataSupplier" :key="i" class="border-t">
        <td class="p-2 border">{{ item.kode }}</td>
        <td class="p-2 border">{{ item.nama }}</td>
        <td class="p-2 border text-right">{{ item.qty }}</td>
        <td class="p-2 border">{{ item.satuan }}</td>
        <td class="p-2 border text-right">Rp {{ item.harga.toLocaleString() }}</td>
        <td class="p-2 border text-right">Rp {{ (item.qty * item.harga).toLocaleString() }}</td>
      </tr>
      <tr class="font-semibold bg-gray-50 border-t">
        <td colspan="5" class="p-2 text-right border">Total</td>
        <td class="p-2 text-right border">Rp {{ totalJumlah.toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
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
            <CardTitle>Commentar</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Tulis komentarmu..." />
          </CardContent>
        </Card>

        <Button class="w-full" @click="saveChanges">Submit</Button>

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
