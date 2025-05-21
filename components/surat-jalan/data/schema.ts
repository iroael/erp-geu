import { z } from 'zod'

// Enum status Delivery Order
const statusEnumDO = z.enum([
  'draft',
  'submitted',
  'approved',
  'rejected',
  'delivered',
])

// Skema Purchase Order (PO) dalam array po_id
const purchaseOrderSchema = z.object({
  id: z.number(),
  po_no: z.string(),
  supplier_id: z.number(),
  supplier_name: z.string(),
  tanggal_po: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid PO date',
  }),
  volume: z.number(),
  price_per_liter: z.number(),
  status: z.string(), // Bisa ditambahkan enum jika diperlukan
})

// Skema Driver
const driverSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  license_number: z.string(),
})

// Skema Armada
const armadaSchema = z.object({
  id: z.number(),
  type: z.string(),
  plate_number: z.string(),
  capacity: z.number(),
})

// Skema Delivery Order
export const deliveryOrderSchema = z.object({
  id: z.number(),
  do_no: z.string().min(1),
  tanggal_kirim: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid delivery date',
  }),
  driver: driverSchema,
  armada: armadaSchema,
  gudang_tujuan_id: z.number(),
  status: z.string().transform(val => val.toLowerCase()).pipe(statusEnumDO),
  catatan: z.string(),
  created_at: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid created_at date',
  }),
  updated_at: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid updated_at date',
  }),
  po_id: z.array(purchaseOrderSchema),
})

export type DeliveryOrder = z.infer<typeof deliveryOrderSchema>
