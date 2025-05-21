import type { ColumnDef } from '@tanstack/vue-table'
import type { PurchaseOrder } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import { statusMap } from '../data/data'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
        class: 'translate-y-0.5',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': value => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
        class: 'translate-y-0.5',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'po_no',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Purchase Number' }),
    cell: ({ row }) => h('div', {}, row.getValue('po_no')),
  },
  {
    accessorKey: 'tanggal',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Create At' }),
    cell: ({ row }) => h('div', {}, row.getValue('tanggal')),
  },
  {
    accessorKey: 'work_order.wo_no',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Kode WO' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.work_order.wo_no),
  },
  {
    accessorKey: 'supplier.supplier_name',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Nama Supplier' }),
    cell: ({ row }) => {
      const supplierName = row.original.supplier.supplier_name
      const supplierId = row.original.supplier.supplier_id

      return h('div', { class: 'flex space-x-2 items-center' }, [
        h(Badge, { variant: 'info' }, () => `#${supplierId}`),
        h('span', { class: 'max-w-[300px] truncate font-medium' }, supplierName),
      ])
    },
  },
  {
    accessorKey: 'volume_liter',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Volume (L)' }),
    cell: ({ row }) => h('div', {}, `${row.getValue('volume_liter')} L`),
  },
  {
    accessorKey: 'price_per_liter',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Harga/Liter (Rp)' }),
    cell: ({ row }) => h('div', {}, `Rp ${row.getValue('price_per_liter').toLocaleString()}`),
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Total (Rp)' }),
    cell: ({ row }) => h('div', {}, `Rp ${row.getValue('total_amount').toLocaleString()}`),
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
