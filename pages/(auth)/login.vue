<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <LayoutAuth reverse>
    <div class="grid mx-auto max-w-sm gap-6">
      <div class="grid gap-2 text-center">
        <!-- Tambahkan logo di sini -->
        <img
          src="https://greenenergiutama.co.id/wp-content/uploads/elementor/thumbs/GEU-LOGO-qbpep8ubmrecn1be23b5gyjjskvfjeis8yk0z4uznk.png"
          alt="Logo"
          class="mx-auto h-16 w-auto"
        />
        
        <h1 class="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p class="text-balance text-sm text-muted-foreground">
          Login with your Account
        </p>
      </div>
      <AuthSignIn />
    </div>
  </LayoutAuth>
</template>