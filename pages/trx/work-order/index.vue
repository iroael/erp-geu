<script setup lang="ts">
import { columns } from '@/components/work-order/components/columns'
import DataTable from '@/components/work-order/components/DataTable.vue'
import workorder from '@/components/work-order/data/wo-data.json'
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Work Orders
        </h2>
        <p class="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
    </div>
    <DataTable :data="workorder.data" :columns="columns" />
  </div>
</template>

<style scoped>

</style>
