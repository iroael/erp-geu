

// components/branch/components/columns.ts
import type { ColumnDef } from '@tanstack/vue-table'
import type { Branch } from '~/types/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export function columns({
  onEdit,
  onDeleteSuccess,
  onEditSuccess, // <--- tambahkan ini
}: {
  onEdit: (branch: Branch) => void
  onDeleteSuccess: () => void
  onEditSuccess: (branch: Branch) => void // <--- tambahkan ini
}): ColumnDef<Branch>[] {
  return [
    {
      id: 'select',
      header: ({ table }) =>
        h(Checkbox, {
          checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
          'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
          ariaLabel: 'Select all',
          class: 'translate-y-0.5',
        }),
      cell: ({ row }) =>
        h(Checkbox, {
          checked: row.getIsSelected(),
          'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
          ariaLabel: 'Select row',
          class: 'translate-y-0.5',
        }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'branchCode',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Branch Code' }),
      cell: ({ row }) => {
        const code = row.getValue('branchCode') as string
        return h('div', { class: 'font-mono text-sm' }, code || '-')
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
      cell: ({ row }) => {
        const name = row.getValue('name') as string
        return h('div', { class: 'font-medium' }, name || '-')
      },
    },
    {
      accessorKey: 'city',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'City' }),
      cell: ({ row }) => {
        const city = row.getValue('city') as string
        return h('div', city || '-')
      },
    },
    {
      accessorKey: 'province',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Province' }),
      cell: ({ row }) => {
        const province = row.getValue('province') as string
        return h('div', province || '-')
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Phone' }),
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string
        return h('div', phone || '-')
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Email' }),
      cell: ({ row }) => {
        const email = row.getValue('email') as string
        return h('div', { class: 'text-blue-600' }, email || '-')
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
      cell: ({ row }) => {
        const status = row.getValue<boolean>('status')
        return h(
          Badge, 
          { 
            variant: status ? 'default' : 'secondary',
            class: status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }, 
          () => status ? 'Active' : 'Inactive'
        )
      },
      filterFn: (row, id, value) => {
        if (!Array.isArray(value)) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      header: () => h('div', { class: 'text-right' }, 'Actions'),
      cell: ({ row }) =>
        h(DataTableRowActions, {
          row,
          onEdit: () => onEdit(row.original),
          onDeleteSuccess,
          onEditSuccess: (branch: Branch) => onEditSuccess(branch), // <--- tambahkan ini
        }),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
