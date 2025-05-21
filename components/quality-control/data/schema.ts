import { z } from 'zod'

export const qcHeaderSchema = z.object({
  id: z.string(),
  qc_code: z.string(),
  delivery_order_id: z.number(),
  delivery_order: z.object({
    do_no: z.string(),
    tanggal_kirim: z.string(), // format ISO date
    gudang_tujuan_id: z.number(),
  }),
  gudang_id: z.number(),
  qc_by: z.number(),
  qc_date: z.string(), // ISO format date
  status_qc: z.enum(['Partial', 'Completed', 'Rejected']),
  note: z.string(),
})

export const qcHeaderListSchema = z.object({
  data: z.array(qcHeaderSchema),
})

export type QCHeader = z.infer<typeof qcHeaderSchema>
export type QCHeaderList = z.infer<typeof qcHeaderListSchema>
