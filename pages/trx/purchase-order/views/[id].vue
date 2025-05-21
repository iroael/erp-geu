<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from '@/components/ui/tabs'
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Timeline from '@/components/work-order/components/Timeline.vue'

// PO Interface
interface PurchaseOrder {
  id: number
  kode_po: string
  tanggal_po: string
  nama_supplier: string
  lokasi: string
  status: string
  remark: string
}

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    kode_po: 'PO-0001',
    tanggal_po: '2025-05-19',
    nama_supplier: 'PT. Sumber Makmur',
    lokasi: 'Jl. Sukajadi',
    status: 'Draft',
    remark: 'Urgent',
  },
]

const route = useRoute()
const id = Number(route.params.id)
const originalPurchaseOrder = computed(() =>
  purchaseOrders.find(po => po.id === id),
)
const purchaseOrder = ref<PurchaseOrder | null>(null)
if (originalPurchaseOrder.value) {
  purchaseOrder.value = { ...originalPurchaseOrder.value }
}

// PO Item Details
interface ItemDetail {
  kode: string
  nama: string
  qty: number
  satuan: string
  harga: number
}

const itemDetails: ItemDetail[] = [
  { kode: "ITEM-001", nama: "Minyak Jelantah", qty: 100, satuan: "liter", harga: 5000 },
  { kode: "ITEM-002", nama: "Drum Bekas", qty: 2, satuan: "buah", harga: 75000 }
]

const totalJumlah = computed(() =>
  itemDetails.reduce((sum, item) => sum + item.qty * item.harga, 0)
)

// Relasi ke WO
interface RelatedWorkOrder {
  kode_wo: string
  tanggal_wo: string
  kode_supplier: string
  nama_supplier: string
  lokasi: string
  jenis_pekerjaan: string
  volume_estimasi: number
  status: string
  remark: string
  created_by: string
  created_at: string
}

const relatedWorkOrder: RelatedWorkOrder = {
  kode_wo: 'WO-0025',
  tanggal_wo: '2025-05-18',
  kode_supplier: 'SUP-001',
  nama_supplier: 'Warung Sederhana',
  lokasi: 'Jl. Sudirman',
  jenis_pekerjaan: 'Pengambilan',
  volume_estimasi: 60,
  status: 'Approved',
  remark: 'Manager',
  created_by: 'Admin',
  created_at: '2025-05-17',
}

function saveChanges() {
  alert('Perubahan disimpan')
}
function approve() {
  alert('PO disetujui')
}
function reject() {
  alert('PO ditolak')
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <h2 class="text-2xl font-bold">Detail Purchase Order</h2>
    <div class="flex w-full gap-6 items-start">
      <!-- Left -->
      <div class="flex-1 space-y-4">
        <Tabs default-value="info" class="w-full">
          <TabsList class="flex w-full gap-2">
            <TabsTrigger value="info" class="flex-1">Info</TabsTrigger>
            <TabsTrigger value="items" class="flex-1">Detail Barang</TabsTrigger>
            <TabsTrigger value="relation" class="flex-1">Relation</TabsTrigger>
          </TabsList>

          <!-- Info Tab -->
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Umum</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <Label for="kode_po">Kode PO</Label>
                  <Input id="kode_po" v-model="purchaseOrder!.kode_po" />
                </div>
                <div>
                  <Label for="tanggal_po">Tanggal PO</Label>
                  <Input type="date" id="tanggal_po" v-model="purchaseOrder!.tanggal_po" />
                </div>
                <div>
                  <Label for="nama_supplier">Supplier</Label>
                  <Input id="nama_supplier" v-model="purchaseOrder!.nama_supplier" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Items Tab -->
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Detail Barang</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <table class="w-full text-sm text-left border border-gray-200">
                  <thead class="bg-gray-100 text-gray-700">
                    <tr>
                      <th class="p-2 border">Kode</th>
                      <th class="p-2 border">Nama</th>
                      <th class="p-2 border text-right">Qty</th>
                      <th class="p-2 border">Satuan</th>
                      <th class="p-2 border text-right">Harga</th>
                      <th class="p-2 border text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in itemDetails" :key="i" class="border-t">
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

          <!-- Relation Tab -->
          <TabsContent value="relation">
            <Card>
              <CardHeader>
                <CardTitle>Work Order Terkait</CardTitle>
              </CardHeader>
              <CardContent class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kode WO</Label>
                    <p>{{ relatedWorkOrder.kode_wo }}</p>
                  </div>
                  <div>
                    <Label>Tanggal WO</Label>
                    <p>{{ relatedWorkOrder.tanggal_wo }}</p>
                  </div>
                  <div>
                    <Label>Volume Estimasi</Label>
                    <p>{{ relatedWorkOrder.volume_estimasi }} liter</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p>{{ relatedWorkOrder.status }}</p>
                  </div>
                  <div>
                    <Label>Remark</Label>
                    <p>{{ relatedWorkOrder.remark }}</p>
                  </div>
                  <div>
                    <Label>Created By</Label>
                    <p>{{ relatedWorkOrder.created_by }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Right Sidebar -->
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
            <Textarea placeholder="Tulis komentar..." />
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
