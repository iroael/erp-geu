<script setup lang="ts">
defineProps<{
  reverse?: boolean
}>()
</script>

<template>
  <div
    class="relative flex items-center justify-center px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }"
  >
    <div class="relative hidden h-full flex-1 flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
      <!-- Ganti dengan path gambar PNG kamu -->
      <img
        src="https://greenenergiutama.co.id/wp-content/uploads/2023/09/SLider-DPan.jpg"
        alt="Background"
        class="absolute inset-0 h-full w-full object-cover z-0"
      />

      <!-- Overlay konten -->
      <div class="relative z-20 flex items-center text-lg font-medium">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-6 w-6">
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg> -->
        Green Energi Utama
      </div>

      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;This library has saved me countless hours of work and
            helped me deliver stunning designs to my clients faster than
            ever before.&rdquo;
          </p>
          <footer class="text-sm">
            Sofia Davis
          </footer>
        </blockquote>
      </div>
    </div>

    <div class="mx-auto flex-1 lg:p-8">
      <slot />
    </div>
  </div>
</template>
<style scoped>

</style>