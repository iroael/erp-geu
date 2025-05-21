import type { ColumnDef } from '@tanstack/vue-table'
import type { Warehouse } from '~/types/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export function columns({ onEdit }: { onEdit: (warehouse: Warehouse) => void }): ColumnDef<Warehouse>[] {
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
      accessorKey: 'address',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Address' }),
      cell: ({ row }) => h('div', row.getValue('address')),
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
