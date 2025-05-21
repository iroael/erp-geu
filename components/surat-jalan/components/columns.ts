import type { ColumnDef } from '@tanstack/vue-table'
import type { DeliveryOrder, PO, Driver, Armada } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import { statusMap } from '../data/data'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns: ColumnDef<DeliveryOrder>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
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
    accessorKey: 'do_no',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Delivery Order No' }),
    cell: ({ row }) => h('div', {}, row.getValue('do_no')),
  },
  {
    accessorKey: 'tanggal_kirim',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Tanggal Kirim' }),
    cell: ({ row }) => h('div', {}, row.getValue('tanggal_kirim')),
  },
  {
    id: 'driver',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Driver' }),
    cell: ({ row }) => {
      const driver: Driver = row.original.driver
      return h('div', {}, `${driver.name} (${driver.phone})`)
    },
  },
  {
    id: 'armada',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Armada' }),
    cell: ({ row }) => {
      const armada: Armada = row.original.armada
      return h('div', {}, `${armada.type} - ${armada.plate_number}`)
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.getValue('status')?.toLowerCase()
      if (typeof status !== 'string' || !statusMap[status]) {
        return h('div', {}, status)
      }
      const { label, variant } = statusMap[status]
      return h(Badge, { variant }, () => label)
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'catatan',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Catatan' }),
    cell: ({ row }) => h('div', {}, row.getValue('catatan')),
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
