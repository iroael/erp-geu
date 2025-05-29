import type { ColumnDef } from '@tanstack/vue-table'
import type { RoleWithPermission } from '~/types/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns = ({
  onEdit,
  onDeleteSuccess,
}: {
  onEdit: (data: RoleWithPermission) => void
  onDeleteSuccess: () => void
}): ColumnDef<RoleWithPermission>[] => [
  {
    accessorKey: 'role.name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Role' }),
    cell: ({ row }) => h('div', row.original.role.name),
  },
  {
    accessorKey: 'permission.module_code',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Module' }),
    cell: ({ row }) => h('div', row.original.permission.module_code),
  },
  {
    accessorKey: 'permission.can_create',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Create' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.original.permission.can_create,
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    accessorKey: 'permission.can_read',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Read' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.original.permission.can_read,
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    accessorKey: 'permission.can_update',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Update' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.original.permission.can_update,
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    accessorKey: 'permission.can_delete',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Delete' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.original.permission.can_delete,
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        onEditSuccess: () => onEdit(row.original),
        onDeleteSuccess: () => onDeleteSuccess(),
      }),
  },
]
