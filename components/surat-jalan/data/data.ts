import { Icon } from '#components'
import { h } from 'vue'

export const statusMap = {
  draft: { label: 'Draft', variant: 'outline' },
  submit: { label: 'Submit', variant: 'blue' },
  waiting_approve: { label: 'Waiting Approve', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  received: { label: 'Received', variant: 'default' },
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
  {
    value: 'received',
    label: 'Received',
    icon: h(Icon, { name: 'i-radix-icons-archive' }),
  },
]
