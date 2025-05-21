import type { ColumnDef } from '@tanstack/vue-table'
import type { Jabatan } from '~/types/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns = ({
  onEdit,
  onDeleteSuccess,
}: {
  onEdit: (jabatan: Jabatan) => void
  onDeleteSuccess: () => void
}): ColumnDef<Jabatan>[] => [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
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
    accessorKey: 'jabatanCode',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Jabatan Code' }),
    cell: ({ row }) => h('div', row.getValue('jabatanCode')),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) => h('div', row.getValue('name')),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Description' }),
    cell: ({ row }) => h('div', row.getValue('description')),
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
        onEditSuccess: () => onEdit(row.original),
        onDeleteSuccess,
      }),
  },
]
