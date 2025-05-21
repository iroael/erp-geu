<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const supplierOptions = [
  { id: 'supplier1', name: 'PT. Minyak Jaya' },
  { id: 'supplier2', name: 'UD. Jelantah Bersih' },
]

const unitOptions = [
  'Liter',
  'Kg',
  'Ton',
]

const formSchema = toTypedSchema(z.object({
  woCode: z.string().min(1, 'Kode WO wajib diisi'),
  woDate: z.string().min(1, 'Tanggal wajib diisi'),
  branch: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      supplierId: z.string().min(1, 'Pilih supplier'),
      supplierName: z.string().optional(),
      qty: z.number().min(1, 'Qty minimal 1'),
      unit: z.string().min(1, 'Satuan wajib diisi'),
      price: z.number().min(0, 'Harga minimal 0'),
      remark: z.string().optional(),
    })
  ).min(1, 'Minimal 1 supplier diperlukan'),
}))

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    woCode: '',
    woDate: '',
    branch: '',
    notes: '',
    items: [
      {
        supplierId: '',
        supplierName: '',
        qty: 0,
        unit: '',
        price: 0,
        remark: '',
      }
    ]
  },
})

const onSubmit = handleSubmit((formValues) => {
  console.log('Form submitted:', JSON.stringify(formValues, null, 2))
  toast.success('Work Order Submitted', {
    description: `Data berhasil disimpan dengan ${formValues.items.length} supplier`,
    duration: 3000,
  })
})

function updateSupplierName(index, id) {
  const selected = supplierOptions.find(opt => opt.id === id)
  setFieldValue(`items[${index}].supplierName`, selected?.name || '')
}

function calculateSubtotal(qty, price) {
  if (isNaN(qty) || isNaN(price)) return 0
  return qty * price
}

function addNewItem() {
  const newItems = [...values.items, {
    supplierId: '',
    supplierName: '',
    qty: 0,
    unit: '',
    price: 0,
    remark: '',
  }]
  setFieldValue('items', newItems)
}

function removeItem(index) {
  if (values.items.length <= 1) return
  const newItems = values.items.filter((_, i) => i !== index)
  setFieldValue('items', newItems)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="w-full border rounded-lg shadow-sm">
      <div class="p-4 border-b">
        <h2 class="text-lg font-medium">Create Work Order</h2>
      </div>
      <div class="p-4">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Kode WO</label>
              <input 
                v-model="values.woCode"
                type="text"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Masukkan kode WO"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tanggal WO</label>
              <input 
                v-model="values.woDate" 
                type="date" 
                class="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Cabang</label>
              <input 
                v-model="values.branch" 
                type="text" 
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Cabang Jakarta"
              />
            </div>
          </div>

          <!-- Tabel Input Data Supplier -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="text-lg font-medium">Data Supplier</div>
              <button 
                type="button" 
                class="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                @click="addNewItem"
              >
                Tambah Supplier
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="p-2 text-left">Kode Supplier</th>
                    <th class="p-2 text-left">Nama Supplier</th>
                    <th class="p-2 text-left">Qty</th>
                    <th class="p-2 text-left">Satuan</th>
                    <th class="p-2 text-left">Harga</th>
                    <th class="p-2 text-left">Jumlah</th>
                    <th class="p-2 text-left">Remark</th>
                    <th class="p-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in values.items" :key="index" class="border-b">
                    <td class="p-2">
                      <select
                        v-model="values.items[index].supplierId"
                        class="w-full px-2 py-1 border rounded-md"
                        @change="updateSupplierName(index, values.items[index].supplierId)"
                      >
                        <option value="" disabled>Pilih supplier</option>
                        <option v-for="option in supplierOptions" :key="option.id" :value="option.id">
                          {{ option.id }} - {{ option.name }}
                        </option>
                      </select>
                    </td>
                    <td class="p-2">
                      <input
                        v-model="values.items[index].supplierName"
                        type="text"
                        class="w-full px-2 py-1 border rounded-md bg-gray-50"
                        readonly
                      />
                    </td>
                    <td class="p-2">
                      <input
                        v-model.number="values.items[index].qty"
                        type="number"
                        class="w-full px-2 py-1 border rounded-md"
                        min="0"
                      />
                    </td>
                    <td class="p-2">
                      <select
                        v-model="values.items[index].unit"
                        class="w-full px-2 py-1 border rounded-md"
                      >
                        <option value="" disabled>Pilih satuan</option>
                        <option v-for="unit in unitOptions" :key="unit" :value="unit">
                          {{ unit }}
                        </option>
                        <option value="custom">Lainnya</option>
                      </select>
                    </td>
                    <td class="p-2">
                      <input
                        v-model.number="values.items[index].price"
                        type="number"
                        class="w-full px-2 py-1 border rounded-md"
                        min="0"
                      />
                    </td>
                    <td class="p-2">
                      <div class="font-medium">
                        {{ calculateSubtotal(values.items[index].qty, values.items[index].price).toLocaleString('id-ID') }}
                      </div>
                    </td>
                    <td class="p-2">
                      <input
                        v-model="values.items[index].remark"
                        type="text"
                        class="w-full px-2 py-1 border rounded-md"
                        placeholder="Catatan"
                      />
                    </td>
                    <td class="p-2">
                      <button
                        type="button"
                        class="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                        @click="removeItem(index)"
                        :disabled="values.items.length <= 1"
                      >
                        <span class="sr-only">Hapus</span>
                        ×
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Catatan Tambahan</label>
            <textarea
              v-model="values.notes"
              rows="3"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Contoh: Penjemputan siang hari"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Submit Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>