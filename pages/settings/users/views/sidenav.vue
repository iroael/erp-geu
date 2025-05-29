<script setup lang="ts">
import { Lock, Shield, User } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

if (!userId) {
  console.warn('User ID not found in route.')
}
</script>

<template>
  <div class="pb-16 space-y-6">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">
        Settings
      </h2>
      <p class="text-muted-foreground">
        Manage your account settings and set e-mail preferences.
      </p>
    </div>

    <Separator class="my-6" />

    <div class="flex flex-col lg:flex-row space-y-6 lg:space-x-12 lg:space-y-0">
      <!-- Sidebar -->
      <div class="w-full overflow-x-auto pb-2 lg:w-1/6 lg:pb-0">
        <nav class="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
          <NuxtLink
            v-for="item in [
              { title: 'Profile', href: 'profile', icon: User },
              { title: 'Role', href: 'role', icon: Shield },
              { title: 'Configure', href: 'configure', icon: Lock },
            ]"
            :key="item.href"
            :to="`/settings/users/views/${userId}/${item.href}`"
            class="block px-3 py-2 rounded hover:bg-muted flex items-center space-x-2"
            :class="{ 'bg-muted font-semibold': route.path.includes(item.href) }"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
