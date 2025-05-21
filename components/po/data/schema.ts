import { z } from 'zod'

const statusEnum = z.enum([
  'draft',
  'submit',
  'waiting approve',
  'approved',
  'received',
])

export const purchaseOrderSchema = z.object({
  id: z.number(),
  po_no: z.string(),
  wo_supplier_id: z.number(),

  work_order: z.object({
    wo_id: z.number(),
    wo_no: z.string(),
  }),

  supplier: z.object({
    supplier_id: z.number(),
    supplier_name: z.string(),
  }),

  tanggal: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),

  volume_liter: z.number().nonnegative(),
  price_per_liter: z.number().nonnegative(),
  total_amount: z.number().nonnegative(),

  status: z
    .string()
    .transform(val => val.toLowerCase())
    .pipe(statusEnum),

  catatan: z.string().optional().default(''),
})

export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>
