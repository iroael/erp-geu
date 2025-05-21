import type { ColumnDef } from '@tanstack/vue-table'
import type { WorkOrder } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import { statusMap } from '../data/data'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns: ColumnDef<WorkOrder>[] = [
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
    accessorKey: 'kode_wo',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Kode WO' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('kode_wo')),
  },
  {
    accessorKey: 'tanggal_wo',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Tanggal WO' }),
    cell: ({ row }) => h('div', {}, row.getValue('tanggal_wo')),
  },
  {
    accessorKey: 'kode_supplier',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Kode Supplier' }),
    cell: ({ row }) => h('div', {}, row.getValue('kode_supplier')),
  },
  {
    accessorKey: 'nama_supplier',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Nama Supplier' }),
    cell: ({ row }) => h('div', {}, row.getValue('nama_supplier')),
  },
  {
    accessorKey: 'lokasi',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Lokasi' }),
    cell: ({ row }) => h('div', {}, row.getValue('lokasi')),
  },
  {
    accessorKey: 'jenis_pekerjaan',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Jenis Pekerjaan' }),
    cell: ({ row }) => h('div', {}, row.getValue('jenis_pekerjaan')),
  },
  {
    accessorKey: 'volume_estimasi',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Volume Estimasi (L)' }),
    cell: ({ row }) => h('div', {}, `${row.getValue('volume_estimasi')} L`),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.getValue('status')
      console.log('row:', row)
      console.log('status:', status)
      console.log('statusMap:', statusMap)
      if (typeof status !== 'string' || !statusMap[status]) {
        return h('div', {}, status)
      }
      const { label, variant } = statusMap[status]
      return h(Badge, { variant }, () => label)
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'remark',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Remark' }),
    cell: ({ row }) => h('div', {}, row.getValue('remark')),
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
