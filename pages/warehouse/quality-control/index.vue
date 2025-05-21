<script setup lang="ts">
import { columns } from '@/components/quality-control/components/columns'
import DataTable from '@/components/quality-control/components/DataTable.vue'
import qualitycontrol from '@/components/quality-control/data/quality-control.json'
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Quality Control Reports
        </h2>
        <p class="text-muted-foreground">
          Here&apos;s a list of the quality control checks for your recent delivery orders.
        </p>
      </div>
    </div>
    <DataTable :data="qualitycontrol.data" :columns="columns" />
  </div>
</template>

<style scoped>

</style>
