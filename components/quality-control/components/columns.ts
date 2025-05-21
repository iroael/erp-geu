import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import { qcStatuses } from '../data/data'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns: ColumnDef<QCHeader>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
      'class': 'translate-y-0.5',
    }),
    cell: ({ row }) => h(Checkbox, { 'checked': row.getIsSelected(), 'onUpdate:checked': value => row.toggleSelected(!!value), 'ariaLabel': 'Select row', 'class': 'translate-y-0.5' }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'qc_code',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'QC Code' }),
    cell: ({ row }) => h('div', { class: 'w-32' }, row.getValue('qc_code')),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'delivery_order.do_no',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Delivery Order No.' }),
    cell: ({ row }) => {
      const do_no = row.original.delivery_order.do_no
      const doId = row.original.delivery_order.delivery_order_id
      return h('div', {}, `${do_no}`)
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'qc_date',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'QC Date' }),
    cell: ({ row }) => h('div', { class: 'w-32' }, row.getValue('qc_date')),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'status_qc',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'QC Status' }),

    cell: ({ row }) => {
      const status = qcStatuses.find(
        status => status.value === row.getValue('status_qc'),
      )

      if (!status)
        return null

      return h('div', { class: 'flex w-[100px] items-center' }, [
        status.icon && h(status.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
        h('span', status.label),
      ])
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Note' }),
    cell: ({ row }) => h('div', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('note')),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
