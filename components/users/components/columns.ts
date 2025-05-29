import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '~/types/schema'
import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns = ({
  onEdit,
  onDeleteSuccess,
}: {
  onEdit: (data: User) => void
  onDeleteSuccess: () => void
}): ColumnDef<User>[] => [
  {
    id: 'user',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Nama Lengkap',
      }),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center space-x-4' }, [
        // Avatar image
        h(
          'div',
          {
            class: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted',
          },
          [
            h('img', {
              src: row.original.karyawan?.photoUrl || '/avatars/avatartion.png',
              alt: row.original.karyawan?.name || 'User avatar',
              class: 'h-full w-full object-cover',
            }),
          ]
        ),

        // Nama & Username
        h('div', { class: 'space-y-1' }, [
          h(
            'p',
            { class: 'text-sm font-medium leading-none' },
            row.original.karyawan?.name || '-'
          ),
          h(
            'p',
            { class: 'text-xs text-muted-foreground' },
            row.original.username
          ),
        ]),
      ]),
  },

  {
    accessorKey: 'role',
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: 'Role',
      }),
    cell: ({ row }) =>
      h('div', { class: 'capitalize text-sm' }, row.original.role.name || '-'),
  },

  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        onEditSuccess: () => onEdit(row.original),
        onDeleteSuccess: () => onDeleteSuccess(),
      }),
  },
]
