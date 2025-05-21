import { Icon } from '#components'
import { h } from 'vue'

export const qcStatuses = [
  {
    value: 'Partial',
    label: 'Partial',
    icon: h(Icon, { name: 'i-radix-icons-question-mark-circled' }),
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: h(Icon, { name: 'i-radix-icons-check-circled' }),
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    icon: h(Icon, { name: 'i-radix-icons-cross-circled' }),
  },
]
