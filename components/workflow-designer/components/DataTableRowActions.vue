<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Workflow } from '~/types/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface DataTableRowActionsProps {
  row: Row<Workflow>
}

const props = defineProps<DataTableRowActionsProps>()
const dataWorkflow = computed(() => props.row.original)

const router = useRouter()

const handleView = () => {
  if (!dataWorkflow.value?.workflow_type)
    return
  // router.push(`/settings/workflow/views/${dataWorkflow.value.workflow_type}`)
  router.push({
    path: `/settings/workflow/views/${dataWorkflow.value.workflow_type}`,
    query: { workflow_id: dataWorkflow.value.id },
  })
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
