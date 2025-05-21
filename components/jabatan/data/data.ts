import { Icon } from '#components'
import { h } from 'vue'

export const jabatanStatuses = [
  {
    value: true,
    label: 'Active',
    icon: h(Icon, { name: 'i-radix-icons-check-circled', class: 'text-green-500' }),
  },
  {
    value: false,
    label: 'Inactive',
    icon: h(Icon, { name: 'i-radix-icons-cross-circled', class: 'text-red-500' }),
  },
]
