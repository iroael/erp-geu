
<script setup lang="ts">
import { Mail, MapPin, Archive } from 'lucide-vue-next'

const timeline = [
  {
    date: 'Today',
    title: 'Pending Approval',
    description: 'This request requires your approval.',
    icon: Archive,
  },
  {
    date: 'May 19, 2018',
    title: 'Approval Requested',
    description: 'John Lloyd has requested your approval.',
    icon: Mail,
  },
  {
    date: '2018',
    title: 'Request Created',
    description: 'Request created by Kim May.',
    icon: MapPin,
  },
]
</script>

<template>
  <div class="relative">
    <!-- Vertical Line -->
    <div class="absolute top-0 left-5 bottom-0 w-0.5 bg-gray-200 z-0"></div>

    <div
      v-for="(item, index) in timeline"
      :key="index"
      class="relative flex items-start space-x-4 mb-6 z-10"
    >
      <!-- Icon -->
      <div class="flex flex-col items-center relative z-10">
        <div class="bg-blue-600 text-white rounded-full p-2">
          <component :is="item.icon" class="w-4 h-4" />
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-1">
        <p class="text-xs text-muted-foreground">{{ item.date }}</p>
        <p class="font-semibold text-sm">{{ item.title }}</p>
        <p class="text-sm text-gray-500">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

