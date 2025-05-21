import type { ColumnDef } from '@tanstack/vue-table'
import type { Branch } from '~/types/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export function columns({ onEdit }: { onEdit: (branch: Branch) => void }): ColumnDef<Branch>[] {
  return [
    {
      id: 'select',
      header: ({ table }) =>
        h(Checkbox, {
          checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
          'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
          ariaLabel: 'Select all',
          class: 'translate-y-0.5',
        }),
      cell: ({ row }) =>
        h(Checkbox, {
          checked: row.getIsSelected(),
          'onUpdate:checked': value => row.toggleSelected(!!value),
          ariaLabel: 'Select row',
          class: 'translate-y-0.5',
        }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'branchCode',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Branch Code' }),
      cell: ({ row }) => h('div', row.getValue('branchCode')),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
      cell: ({ row }) => h('div', row.getValue('name')),
    },
    {
      accessorKey: 'city',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'City' }),
      cell: ({ row }) => h('div', row.getValue('city')),
    },
    {
      accessorKey: 'province',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Province' }),
      cell: ({ row }) => h('div', row.getValue('province')),
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Phone' }),
      cell: ({ row }) => h('div', row.getValue('phone')),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Email' }),
      cell: ({ row }) => h('div', row.getValue('email')),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
      cell: ({ row }) => {
        const status = row.getValue<boolean>('status')
        return h(Badge, { variant: status ? 'default' : 'outline' }, () => (status ? 'Active' : 'Inactive'))
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      cell: ({ row }) =>
        h(DataTableRowActions, {
          row,
          onEdit: () => onEdit(row.original), // <--- important line
        }),
    },
  ]
}
