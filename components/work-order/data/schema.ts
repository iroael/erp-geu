import { z } from 'zod'

const statusEnum = z.enum(['draft', 'submit', 'waiting_approve', 'approved'])

export const workOrderSchema = z.object({
  id: z.number(),
  kode_wo: z.string(),
  tanggal_wo: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  kode_supplier: z.string(),
  nama_supplier: z.string(),
  lokasi: z.string(),
  jenis_pekerjaan: z.string(),
  volume_estimasi: z.number().nonnegative(),

  status: z.string()
    .transform(str => str.toLowerCase())
    .pipe(statusEnum),
  remark: z.string(),
})

export type WorkOrder = z.infer<typeof workOrderSchema>
