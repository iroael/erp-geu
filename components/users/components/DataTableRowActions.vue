<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { User } from '~/types/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface DataTableRowActionsProps {
  row: Row<User>
}

const props = defineProps<DataTableRowActionsProps>()
const dataUser = computed(() => props.row.original)

const router = useRouter()

const handleView = () => {
  if (!dataUser.value?.id) return
  router.push(`/settings/users/views/${dataUser.value.id}/profile`)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleView">
        View
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
