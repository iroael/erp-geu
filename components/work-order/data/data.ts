import { Icon } from '#components'
import { h } from 'vue'

export const statusMap = {
  Draft: { label: 'Draft', variant: 'outline' },
  Submit: { label: 'Submit', variant: 'blue' },
  'Waiting Approve': { label: 'Waiting Approve', variant: 'warning' },
  Approved: { label: 'Approved', variant: 'success' },
}
export const statuses = [
  {
    value: 'draft',
    label: 'Draft',
    icon: h(Icon, { name: 'i-radix-icons-pencil-1' }),
  },
  {
    value: 'submit',
    label: 'Submit',
    icon: h(Icon, { name: 'i-radix-icons-upload' }),
  },
  {
    value: 'waiting_approve',
    label: 'Waiting Approve',
    icon: h(Icon, { name: 'i-radix-icons-hourglass' }),
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: h(Icon, { name: 'i-radix-icons-check-circled' }),
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: h(Icon, { name: 'i-radix-icons-cross-circled' }),
  },
]
