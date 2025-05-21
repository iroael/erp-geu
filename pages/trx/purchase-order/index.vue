<script setup lang="ts">
import { columns } from '@/components/po/components/columns'
import DataTable from '@/components/po/components/DataTable.vue'
import purchaseorder from '@/components/po/data/po-data.json'
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Purchase Orders
        </h2>
        <p class="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
    </div>
    <DataTable :data="purchaseorder.data" :columns="columns" />
  </div>
</template>

<style scoped>

</style>
