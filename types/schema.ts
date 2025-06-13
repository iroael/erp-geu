import { z } from 'zod'

/* ============================
 * MASTER SCHEMAS
 * ============================
 */

// Branch
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
export type Branch = z.infer<typeof branchSchema>

// Jabatan
export const jabatanSchema = z.object({
  id: z.number(),
  jabatanCode: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Jabatan = z.infer<typeof jabatanSchema>

// Warehouse
export const warehouseSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  phone: z.string(),
  branch_id: z.number(),
  status: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type Warehouse = z.infer<typeof warehouseSchema>

/* ============================
 * ROLE & PERMISSION SCHEMAS
 * ============================
 */

// Role
export const roleSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.boolean(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})
export type Role = z.infer<typeof roleSchema>

// Permission
export const permissionSchema = z.object({
  id: z.number(),
  module_code: z.string().min(1),
  can_create: z.boolean().default(false),
  can_read: z.boolean().default(true),
  can_update: z.boolean().default(false),
  can_delete: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})
export type Permission = z.infer<typeof permissionSchema>
export const PermissionArraySchema = z.array(permissionSchema)

// Role with Permission (READ)
export const roleWithPermissionSchema = z.object({
  id: z.number(),
  createdAt: z.string().datetime(),
  role: roleSchema,
  permission: permissionSchema,
})
export type RoleWithPermission = z.infer<typeof roleWithPermissionSchema>
export const roleWithPermissionArraySchema = z.array(roleWithPermissionSchema)

// RolePermission CRUD actions
export const createRolePermissionSchema = z.object({
  role_id: z.number(),
  permission_id: z.number(),
})
export type CreateRolePermission = z.infer<typeof createRolePermissionSchema>

export const updateRolePermissionSchema = z.object({
  id: z.number(),
  can_create: z.boolean(),
  can_read: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
})
export type UpdateRolePermission = z.infer<typeof updateRolePermissionSchema>

export const deleteRolePermissionSchema = z.object({
  id: z.number(),
})
export type DeleteRolePermission = z.infer<typeof deleteRolePermissionSchema>

export const rolePermissionApiResponseSchema = z.object({
  recordsTotal: z.number(),
  recordsFiltered: z.number(),
  data: z.array(roleWithPermissionSchema),
})
export type RolePermissionApiResponse = z.infer<typeof rolePermissionApiResponseSchema>

/* ============================
 * KARYAWAN & USER SCHEMAS
 * ============================
 */

// Karyawan
export const karyawanSchema = z.object({
  id: z.number(),
  employee_code: z.string(),
  name: z.string(),
  nik: z.string(),
  no_ktp: z.string(),
  place_of_birth: z.string(),
  date_of_birth: z.string(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  marital_status: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  status_karyawan: z.string(),
  jabatan_id: z.number(),
  branch_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Karyawan = z.infer<typeof karyawanSchema>

// User
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  karyawan: karyawanSchema,
  role: roleSchema,
})
export type User = z.infer<typeof userSchema>

// User API Response (Datatable-style)
export const userApiResponseSchema = z.object({
  recordsTotal: z.number(),
  recordsFiltered: z.number(),
  data: z.array(userSchema),
})
export type UserApiResponse = z.infer<typeof userApiResponseSchema>

// Optional: Create / Update User
export const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  karyawan_id: z.number(),
  role_id: z.number(),
  is_active: z.boolean(),
})
export type CreateUser = z.infer<typeof createUserSchema>

export const workflowSchema = z.object({
  id: z.string().uuid(),
  workflow_type: z.string(),
  workflow_name: z.string(),
  revision: z.string(),
  is_active: z.boolean(),
  created_at: z.string(), // ISO timestamp string
  updated_at: z.string(),
})

export const workflowsResponseSchema = z.object({
  recordsTotal: z.number(),
  recordsFiltered: z.number(),
  data: z.array(workflowSchema),
})

export type Workflow = z.infer<typeof workflowSchema>
export type WorkflowsResponse = z.infer<typeof workflowsResponseSchema>