<script setup lang="ts">
interface Props {
  table: any
  totalRows: number
}

const props = withDefaults(defineProps<Props>(), {
  totalRows: 0,
})

const pageIndex = computed(() => props.table.getState().pagination.pageIndex)
const pageSize = computed(() => props.table.getState().pagination.pageSize || 10)
const pageCount = computed(() => Math.max(1, props.table.getPageCount()))

const startRow = computed(() => pageIndex.value * pageSize.value + 1)
const endRow = computed(() => {
  const end = (pageIndex.value + 1) * pageSize.value
  return end > props.totalRows ? props.totalRows : end
})

function handlePageChange(newPageIndex: number) {
  if (newPageIndex >= 0 && newPageIndex < pageCount.value) {
    props.table.setPageIndex(newPageIndex)
  }
}

function handlePageSizeChange(newPageSize: number) {
  props.table.setPageSize(Number(newPageSize))
}
</script>

<template>
  <div class="flex items-center justify-between px-2 py-2">
    <div class="text-sm text-muted-foreground">
      Showing {{ startRow }}–{{ endRow }} of {{ totalRows }} rows
    </div>

    <div class="flex items-center space-x-4">
      <!-- Page Size Selector -->
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select :model-value="String(pageSize)" @update:model-value="handlePageSizeChange">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="String(pageSize)" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="size in [10, 20, 30, 50, 100]" :key="size" :value="String(size)">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Numbered Pagination -->
      <div class="flex items-center space-x-1">
        <Button variant="outline" class="h-8 w-8 p-0" :disabled="pageIndex === 0" @click="handlePageChange(0)">
          <Icon name="i-radix-icons-double-arrow-left" class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="h-8 w-8 p-0" :disabled="pageIndex === 0" @click="handlePageChange(pageIndex - 1)">
          <Icon name="i-radix-icons-chevron-left" class="h-4 w-4" />
        </Button>

        <!-- Numbered Buttons -->
        <Button
          v-for="i in pageCount"
          :key="i"
          variant="outline"
          class="h-8 min-w-[32px] px-2 text-sm"
          :class="{
            'bg-primary text-primary-foreground': i - 1 === pageIndex,
            'text-muted-foreground': i - 1 !== pageIndex
          }"
          @click="handlePageChange(i - 1)"
        >
          {{ i }}
        </Button>

        <Button variant="outline" class="h-8 w-8 p-0" :disabled="pageIndex + 1 >= pageCount" @click="handlePageChange(pageIndex + 1)">
          <Icon name="i-radix-icons-chevron-right" class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="h-8 w-8 p-0" :disabled="pageIndex + 1 >= pageCount" @click="handlePageChange(pageCount - 1)">
          <Icon name="i-radix-icons-double-arrow-right" class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
