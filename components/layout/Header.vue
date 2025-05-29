<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import SidebarTrigger from '@/components/layout/SidebarTrigger.vue'
// import BaseBreadcrumbCustom from '@/components/ui/BaseBreadcrumbCustom.vue'
// import { Separator } from '@/components/ui/separator'

const route = useRoute()

function setLinks() {
  if (route.fullPath === '/') {
    return [{ title: 'Home', href: '/' }]
  }

  const segments = route.fullPath.split('/').filter(item => item !== '')

  const breadcrumbs = segments.map((item, index) => {
    const str = item.replace(/-/g, ' ')
    const title = str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    return {
      title,
      href: `/${segments.slice(0, index + 1).join('/')}`,
    }
  })

  return [{ title: 'Home', href: '/' }, ...breadcrumbs]
}

const links = ref<{ title: string; href: string }[]>(setLinks())

watch(() => route.fullPath, (val) => {
  if (val) {
    links.value = setLinks()
  }
})
</script>

<template>
  <header class="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2 md:px-6">
    <!-- Left section: Sidebar + Breadcrumb -->
    <div class="flex items-center gap-4">
      <SidebarTrigger />
      <Separator orientation="vertical" class="h-4" />
      <BaseBreadcrumbCustom :links="links" />
    </div>

    <!-- Right section: You can pass anything here through <slot> -->
    <div class="flex items-center gap-3">
      <slot>
        <!-- Default slot fallback content -->
        <!-- GitHub Icon -->
        <button class="text-muted-foreground hover:text-foreground">
          <i class="i-lucide-github w-5 h-5" />
        </button>

        <!-- Search -->
        <div class="relative hidden md:block">
          <span class="absolute left-2 top-1.5 text-muted-foreground">
            <i class="i-lucide-search w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            class="pl-8 pr-8 py-1.5 border rounded-md text-sm bg-white dark:bg-neutral-800"
          />
          <kbd class="absolute right-2 top-1.5 text-xs text-muted-foreground">⌘K</kbd>
        </div>

        <!-- Avatar -->
        <div class="w-8 h-8 rounded-full bg-neutral-500 text-white flex items-center justify-center text-sm font-bold">
          T
        </div>

        <!-- Theme Selector -->
        <div class="flex items-center gap-1">
          <button class="w-6 h-6 rounded-full bg-black" title="Theme Toggle"></button>
          <select class="text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-800">
            <option>Green</option>
            <option>Blue</option>
            <option>Dark</option>
          </select>
        </div>

        <!-- <AppSettings /> -->
      </slot>
    </div>
  </header>
</template>
