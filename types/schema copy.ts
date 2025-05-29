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

export const roleSchema = z.object({
  id: z.number(),
  name: z.string().min(1), // e.g., "Admin", "Manager"
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

/**
 * Permission Schema
 */
export const permissionSchema = z.object({
  id: z.number(),
  module_code: z.string().min(1), // e.g., "karyawan", "supplier"
  can_create: z.boolean().default(false),
  can_read: z.boolean().default(true),
  can_update: z.boolean().default(false),
  can_delete: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

/**
 * Role-Permission Mapping Schema
 */
export const rolePermissionSchema = z.object({
  id: z.number(),
  role_id: z.number(),
  permission_id: z.number(),
  created_at: z.string().datetime().optional(),
})

export type Branch = z.infer<typeof branchSchema>
export type Jabatan = z.infer<typeof jabatanSchema>
export type Warehouse = z.infer<typeof warehouseSchema>
export const RoleArraySchema = z.array(roleSchema)
export type Role = z.infer<typeof roleSchema>
export const PermissionArraySchema = z.array(permissionSchema)
export type Permission = z.infer<typeof permissionSchema>
export const RolePermissionArraySchema = z.array(rolePermissionSchema)
export type RolePermission = z.infer<typeof rolePermissionSchema>
