<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
import type { DeliveryOrder } from '../data/schema'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps {
  column: Column<DeliveryOrder, any>
  title: string
}

const props = defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div
    v-if="props.column.getCanSort()"
    :class="cn('flex items-center space-x-2', $attrs.class ?? '')"
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          class="h-8 -ml-3 data-[state=open]:bg-accent"
        >
          <span>{{ props.title }}</span>
          <Icon
            v-if="props.column.getIsSorted() === 'desc'"
            name="i-radix-icons-arrow-down"
            class="ml-2 h-4 w-4"
          />
          <Icon
            v-else-if="props.column.getIsSorted() === 'asc'"
            name="i-radix-icons-arrow-up"
            class="ml-2 h-4 w-4"
          />
          <Icon
            v-else
            name="i-radix-icons-caret-sort"
            class="ml-2 h-4 w-4"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="props.column.toggleSorting(false)">
          <Icon name="i-radix-icons-arrow-up" class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem @click="props.column.toggleSorting(true)">
          <Icon name="i-radix-icons-arrow-down" class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="props.column.toggleVisibility(false)">
          <Icon name="i-radix-icons-eye-none" class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div v-else :class="$attrs.class">
    {{ props.title }}
  </div>
</template>
