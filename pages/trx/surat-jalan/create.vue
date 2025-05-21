<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const driverOptions = [
  { id: '12', name: 'Ujang' },
  { id: '13', name: 'Budi' },
]

const armadaOptions = [
  { id: 'D1234XY', name: 'D 1234 XY' },
  { id: 'F5678ZT', name: 'F 5678 ZT' },
]

const gudangOptions = [
  { id: 'bdg', name: 'Gudang Bandung' },
  { id: 'jkt', name: 'Gudang Jakarta' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'delivered', label: 'Delivered' },
]

const formSchema = toTypedSchema(z.object({
  tanggalKirim: z.string().min(1, 'Tanggal kirim wajib diisi'),
  driverId: z.string().min(1, 'Driver wajib dipilih'),
  armadaId: z.string().min(1, 'Armada wajib dipilih'),
  gudangTujuan: z.string().min(1, 'Gudang tujuan wajib dipilih'),
  status: z.string().min(1, 'Status wajib dipilih'),
  catatanUmum: z.string().optional(),
  poList: z.array(z.object({
    noPO: z.string().min(1, 'No PO wajib diisi'),
    supplier: z.string().min(1, 'Supplier wajib diisi'),
    volumePO: z.number().min(0, 'Volume PO minimal 0'),
    volumeAktual: z.number().min(0, 'Volume aktual minimal 0'),
  })).min(1, 'Minimal 1 PO diperlukan'),
}))

const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    tanggalKirim: '2025-05-20',
    driverId: '12',
    armadaId: 'D1234XY',
    gudangTujuan: 'bdg',
    status: 'draft',
    catatanUmum: '',
    poList: [
      { noPO: 'PO/2025/05/021', supplier: 'Warung Sederhana', volumePO: 120, volumeAktual: 118.5 },
      { noPO: 'PO/2025/05/022', supplier: 'RM Padang Beringin', volumePO: 100, volumeAktual: 99.8 },
    ],
  },
})

const onSubmit = handleSubmit((formValues) => {
  toast.success('Surat Jalan berhasil disimpan', {
    description: `Tanggal Kirim: ${formValues.tanggalKirim} | Jumlah PO: ${formValues.poList.length}`,
    duration: 3000,
  })
})

function addNewPO() {
  const newPOs = [...values.poList, { noPO: '', supplier: '', volumePO: 0, volumeAktual: 0 }]
  setFieldValue('poList', newPOs)
}

function removePO(index) {
  if (values.poList.length <= 1) return
  const newPOs = values.poList.filter((_, i) => i !== index)
  setFieldValue('poList', newPOs)
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">🚚 Surat Jalan (Delivery Order)</h1>
    <form @submit.prevent="onSubmit" class="space-y-6 bg-white p-6 rounded shadow">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="tanggalKirim" class="block font-medium mb-1">Tanggal Kirim</label>
          <input
            id="tanggalKirim"
            type="date"
            v-model="values.tanggalKirim"
            class="w-full border rounded px-3 py-2"
          />
          <p v-if="errors.tanggalKirim" class="text-sm text-red-600">{{ errors.tanggalKirim }}</p>
        </div>

        <div>
          <label for="driverId" class="block font-medium mb-1">Driver</label>
          <select
            id="driverId"
            v-model="values.driverId"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">-- Pilih Driver --</option>
            <option v-for="driver in driverOptions" :key="driver.id" :value="driver.id">
              {{ driver.name }} (ID:{{ driver.id }})
            </option>
          </select>
          <p v-if="errors.driverId" class="text-sm text-red-600">{{ errors.driverId }}</p>
        </div>

        <div>
          <label for="armadaId" class="block font-medium mb-1">Armada</label>
          <select
            id="armadaId"
            v-model="values.armadaId"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">-- Pilih Armada --</option>
            <option v-for="armada in armadaOptions" :key="armada.id" :value="armada.id">
              {{ armada.name }}
            </option>
          </select>
          <p v-if="errors.armadaId" class="text-sm text-red-600">{{ errors.armadaId }}</p>
        </div>

        <div>
          <label for="gudangTujuan" class="block font-medium mb-1">Gudang Tujuan</label>
          <select
            id="gudangTujuan"
            v-model="values.gudangTujuan"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">-- Pilih Gudang --</option>
            <option v-for="gudang in gudangOptions" :key="gudang.id" :value="gudang.id">
              {{ gudang.name }}
            </option>
          </select>
          <p v-if="errors.gudangTujuan" class="text-sm text-red-600">{{ errors.gudangTujuan }}</p>
        </div>

        <div>
          <label for="status" class="block font-medium mb-1">Status</label>
          <select
            id="status"
            v-model="values.status"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">-- Pilih Status --</option>
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
          <p v-if="errors.status" class="text-sm text-red-600">{{ errors.status }}</p>
        </div>
      </div>

      <div>
        <label for="catatanUmum" class="block font-medium mb-1">Catatan Umum</label>
        <textarea
          id="catatanUmum"
          rows="3"
          v-model="values.catatanUmum"
          class="w-full border rounded px-3 py-2"
          placeholder="Tulis catatan tambahan"
        ></textarea>
      </div>

      <!-- Tabel PO -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-semibold text-lg">Daftar PO</h2>
          <button type="button" @click="addNewPO" class="text-blue-600 hover:underline">
            + Tambah PO
          </button>
        </div>
        <div class="overflow-x-auto border rounded">
          <table class="w-full table-auto border-collapse text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border px-3 py-2 text-left w-1/6">No PO</th>
                <th class="border px-3 py-2 text-left w-1/4">Supplier</th>
                <th class="border px-3 py-2 text-right w-1/6">Volume PO (L)</th>
                <th class="border px-3 py-2 text-right w-1/6">Volume Aktual (L)</th>
                <th class="border px-3 py-2 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(po, idx) in values.poList" :key="idx" class="hover:bg-gray-50">
                <td class="border px-3 py-1">
                  <input
                    type="text"
                    v-model="po.noPO"
                    class="w-full border rounded px-2 py-1"
                    placeholder="No PO"
                  />
                </td>
                <td class="border px-3 py-1">
                  <input
                    type="text"
                    v-model="po.supplier"
                    class="w-full border rounded px-2 py-1"
                    placeholder="Nama Supplier"
                  />
                </td>
                <td class="border px-3 py-1 text-right">
                  <input
                    type="number"
                    min="0"
                    v-model.number="po.volumePO"
                    class="w-full border rounded px-2 py-1 text-right"
                  />
                </td>
                <td class="border px-3 py-1 text-right">
                  <input
                    type="number"
                    min="0"
                    v-model.number="po.volumeAktual"
                    class="w-full border rounded px-2 py-1 text-right"
                  />
                </td>
                <td class="border px-3 py-1 text-center">
                  <button
                    type="button"
                    @click="removePO(idx)"
                    :disabled="values.poList.length <= 1"
                    class="text-red-600 hover:underline disabled:text-gray-400"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <button
          type="submit"
          class="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
          @click.prevent="setFieldValue('status', 'draft'); onSubmit()"
        >
          💾 Simpan Draft
        </button>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
          @click.prevent="setFieldValue('status', 'submitted'); onSubmit()"
        >
          📤 Submit
        </button>
        <button
          type="button"
          class="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
          @click.prevent="window.print()"
        >
          🖨️ Cetak DO
        </button>
        <button
          type="button"
          class="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
          @click.prevent="window.location.reload()"
        >
          ❌ Batalkan
        </button>
      </div>
    </form>
  </div>
</template>
