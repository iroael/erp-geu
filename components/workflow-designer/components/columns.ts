import type { ColumnDef } from '@tanstack/vue-table'
import type { Workflow } from '~/types/schema'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns = ({
  onView,
}: {
  onView: (data: Workflow) => void
}): ColumnDef<Workflow>[] => [
  {
    accessorKey: 'workflow_type',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Workflow Type',
      }),
    cell: ({ row }) =>
      h('div', { class: 'capitalize text-sm font-medium' }, row.original.workflow_type),
  },
  {
    accessorKey: 'workflow_name',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Name Workflow',
      }),
    cell: ({ row }) =>
      h('div', { class: 'text-sm' }, row.original.workflow_name),
  },
  {
    accessorKey: 'revision',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Revision',
      }),
    cell: ({ row }) =>
      h('div', { class: 'text-sm' }, row.original.revision),
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Active',
      }),
    cell: ({ row }) =>
      h(
        'span',
        {
          class: row.original.is_active
            ? 'text-green-600 font-semibold'
            : 'text-gray-400',
        },
        row.original.is_active ? 'Aktif' : 'Tidak'
      ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Created At',
      }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs text-muted-foreground' },
        new Date(row.original.created_at).toLocaleString()
      ),
  },
  {
    id: 'view',
    header: 'Actions',
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
      }),
  },
]
