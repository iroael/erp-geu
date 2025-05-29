import type { ColumnDef } from '@tanstack/vue-table'
import type { Permission } from '~/types/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns = ({
  onEdit,
  onDeleteSuccess,
}: {
  onEdit: (permission: Permission) => void
  onDeleteSuccess: () => void
}): ColumnDef<Permission>[] => [
  {
    accessorKey: 'module_code',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Module' }),
    cell: ({ row }) => h('div', row.getValue('module_code')),
  },
  {
    accessorKey: 'can_create',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Create' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: !!row.original.can_create,
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    accessorKey: 'can_read',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Read' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: Boolean(row.getValue('can_read')),
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    accessorKey: 'can_update',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Update' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: Boolean(row.getValue('can_update')),
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    accessorKey: 'can_delete',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Delete' }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: Boolean(row.getValue('can_delete')),
        disabled: true,
        class: 'pointer-events-none',
      }),
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        onEditSuccess: () => onEdit(row.original),
        onDeleteSuccess,
      }),
  },
]
