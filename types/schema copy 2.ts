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
 * Role with Permission (READ)
 */
export const roleWithPermissionSchema = z.object({
  id: z.number(), // mapping ID
  createdAt: z.string().datetime(),
  role: roleSchema,
  permission: permissionSchema,
})

/**
 * Create RolePermission (POST)
 */
export const createRolePermissionSchema = z.object({
  role_id: z.number(),
  permission_id: z.number(),
})

/**
 * Update RolePermission (PUT/PATCH)
 */
export const updateRolePermissionSchema = z.object({
  id: z.number(),
  can_create: z.boolean(),
  can_read: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
})

/**
 * Delete RolePermission (DELETE)
 */
export const deleteRolePermissionSchema = z.object({
  id: z.number(),
})

/**
 * API Response (List)
 */
export const rolePermissionApiResponseSchema = z.object({
  recordsTotal: z.number(),
  recordsFiltered: z.number(),
  data: z.array(roleWithPermissionSchema),
})

export type Branch = z.infer<typeof branchSchema>
export type Jabatan = z.infer<typeof jabatanSchema>
export type Warehouse = z.infer<typeof warehouseSchema>
export const RoleArraySchema = z.array(roleSchema)
export type Role = z.infer<typeof roleSchema>
export const PermissionArraySchema = z.array(permissionSchema)
export type Permission = z.infer<typeof permissionSchema>
export type RoleWithPermission = z.infer<typeof roleWithPermissionSchema>
export const roleWithPermissionArraySchema = z.array(roleWithPermissionSchema)
export type CreateRolePermission = z.infer<typeof createRolePermissionSchema>
export type UpdateRolePermission = z.infer<typeof updateRolePermissionSchema>
export type DeleteRolePermission = z.infer<typeof deleteRolePermissionSchema>
export type RolePermissionApiResponse = z.infer<typeof rolePermissionApiResponseSchema>