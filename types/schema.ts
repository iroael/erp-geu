import { z } from 'zod'

export const jabatanSchema = z.object({
  id: z.number(),
  jabatanCode: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const branchSchema = z.object({
  id: z.number(),
  branchCode: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  phone: z.string(),
  email: z.string(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const warehouseSchema = z.object({
  id: z.number(), // jika belum ada ID saat create
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  phone: z.string(),
  branch_id: z.number(),
  status: z.boolean(),
  createdAt: z.string().optional(), // opsional saat create
  updatedAt: z.string().optional(),
})

export type Branch = z.infer<typeof branchSchema>
export type Jabatan = z.infer<typeof jabatanSchema>
export type Warehouse = z.infer<typeof warehouseSchema>
