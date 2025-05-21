
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
  { value: 'Liter', label: 'Liter' },
  { value: 'Kg', label: 'Kilogram' },
  { value: 'Ton', label: 'Ton' },
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
    }),
  ).min(1, 'Minimal 1 supplier diperlukan'),
}))

const { handleSubmit, values, errors, setFieldValue } = useForm({
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
      },
    ],
  },
})

const onSubmit = handleSubmit((formValues) => {
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
  <div class="flex flex-wrap items-end justify-between gap-2">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        Work Order
      </h2>
      <p class="text-muted-foreground">
        Create a new Work Order for suppliers.
      </p>
    </div>
  </div>
  <div class="flex flex-col gap-4">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Create Work Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="woCode">Kode WO</Label>
              <Input
                id="woCode"
                v-model="values.woCode"
                placeholder="Masukkan kode WO"
              />
              <p v-if="errors.woCode" class="text-sm text-red-500">{{ errors.woCode }}</p>
            </div>

            <div class="space-y-2">
              <Label for="woDate">Tanggal WO</Label>
              <Input
                id="woDate"
                v-model="values.woDate" 
                type="date"
              />
              <p v-if="errors.woDate" class="text-sm text-red-500">
                {{ errors.woDate }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="branch">Cabang</Label>
              <Input
                id="branch"
                v-model="values.branch" 
                placeholder="Cabang Jakarta"
              />
            </div>
          </div>

          <!-- Tabel Input Data Supplier -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="text-lg font-small">Data Supplier</div>
              <Button type="button" variant="outline" size="sm" @click="addNewItem">
                Tambah Supplier
              </Button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-base">
                <thead>
                  <tr class="bg-muted">
                    <th class="p-2 text-left font-small text-base">Kode Supplier</th>
                    <th class="p-2 text-left font-small text-base">Nama Supplier</th>
                    <th class="p-2 text-left font-small text-base">Qty</th>
                    <th class="p-2 text-left font-small text-base">Satuan</th>
                    <th class="p-2 text-left font-small text-base">Harga</th>
                    <th class="p-2 text-left font-small text-base">Jumlah</th>
                    <th class="p-2 text-left font-small text-base">Remark</th>
                    <th class="p-2 text-left font-small text-base">Aksi</th>
                  </tr>
                </thead>
                <tbody class="text-base">
                  <tr v-for="(item, index) in values.items" :key="index" class="border-b">
                    <td class="p-2">
                      <Select 
                        :value="item.supplierId" 
                        @update:modelValue="(val) => { 
                          setFieldValue(`items[${index}].supplierId`, val);
                          updateSupplierName(index, val);
                        }"
                      >
                        <SelectTrigger class="w-full text-base">
                          <SelectValue placeholder="Pilih supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="option in supplierOptions" :key="option.id" :value="option.id" class="text-base">
                            {{ option.id }} - {{ option.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p v-if="errors[`items[${index}].supplierId`]" class="text-sm text-red-500">
                        {{ errors[`items[${index}].supplierId`] }}
                      </p>
                    </td>
                    <td class="p-2">
                      <Input 
                        :value="item.supplierName"
                        readonly
                        class="bg-muted text-base"
                      />
                    </td>
                    <td class="p-2">
                      <Input 
                        type="number"
                        :value="item.qty"
                        @update:modelValue="(val) => setFieldValue(`items[${index}].qty`, Number(val))"
                        min="0"
                        class="text-base"
                      />
                      <p v-if="errors[`items[${index}].qty`]" class="text-sm text-red-500">
                        {{ errors[`items[${index}].qty`] }}
                      </p>
                    </td>
                    <td class="p-2">
                      <Select 
                        :value="item.unit" 
                        @update:modelValue="(val) => setFieldValue(`items[${index}].unit`, val)"
                      >
                        <SelectTrigger class="w-full text-base">
                          <SelectValue placeholder="Satuan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="option in unitOptions" :key="option.value" :value="option.value" class="text-base">
                            {{ option.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p v-if="errors[`items[${index}].unit`]" class="text-sm text-red-500">
                        {{ errors[`items[${index}].unit`] }}
                      </p>
                    </td>
                    <td class="p-2">
                      <Input 
                        type="number"
                        :value="item.price"
                        @update:modelValue="(val) => setFieldValue(`items[${index}].price`, Number(val))"
                        min="0"
                        class="text-base"
                      />
                      <p v-if="errors[`items[${index}].price`]" class="text-sm text-red-500">
                        {{ errors[`items[${index}].price`] }}
                      </p>
                    </td>
                    <td class="p-2">
                      <div class="font-small text-base">
                        {{ calculateSubtotal(item.qty, item.price).toLocaleString('id-ID') }}
                      </div>
                    </td>
                    <td class="p-2">
                      <Input 
                        :value="item.remark"
                        @update:modelValue="(val) => setFieldValue(`items[${index}].remark`, val)"
                        placeholder="Catatan"
                        class="text-base"
                      />
                    </td>
                    <td class="p-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        @click="removeItem(index)"
                        :disabled="values.items.length <= 1"
                        class="text-base"
                      >
                        <span class="sr-only">Hapus</span>
                        ×
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="notes">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              v-model="values.notes"
              rows="3"
              placeholder="Contoh: Penjemputan siang hari"
              class="text-base"
            />
          </div>

          <div class="flex justify-end gap-2">
            <Button type="submit" variant="secondary" class="text-base">
              Save as Draft
            </Button>
            <Button type="submit" class="text-base">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>