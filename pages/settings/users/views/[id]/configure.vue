<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { useUsers } from '@/composables/useUsers'

const route = useRoute()
const router = useRouter()

const userId = Number(route.params.id)
const { getById, update, remove, getPermissionsByRoleId } = useUsers()

const username = ref('')
const newPassword = ref('')
const confirmUsername = ref('')
const selectedRoleId = ref<number | null>(null)
const roles = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
  try {
    const user = await getById(userId)
    username.value = user.username
    selectedRoleId.value = user.role?.id || null
  } catch (err: any) {
    toast({ title: 'Gagal memuat data user', description: err.message, variant: 'destructive' })
  }

  // Ganti dengan API jika tersedia
  roles.value = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'User' },
  ]
})

async function updatePassword() {
  if (!newPassword.value) {
    return toast({ title: 'Password tidak boleh kosong', variant: 'destructive' })
  }

  try {
    await update(userId, { password: newPassword.value })
    toast({ title: 'Berhasil', description: 'Password berhasil diupdate' })
    newPassword.value = ''
  } catch (err: any) {
    toast({ title: 'Gagal update password', description: err.message, variant: 'destructive' })
  }
}

async function updateRole() {
  if (!selectedRoleId.value) {
    return toast({ title: 'Pilih role terlebih dahulu', variant: 'destructive' })
  }

  try {
    await update(userId, { role_id: selectedRoleId.value })
    toast({ title: 'Role diperbarui', description: `Role user telah diubah.` })

    const permissions = await getPermissionsByRoleId(selectedRoleId.value)
    console.log('Role Permissions:', permissions)
  } catch (err: any) {
    toast({ title: 'Gagal update role', description: err.message, variant: 'destructive' })
  }
}

async function deleteUser() {
  if (confirmUsername.value !== username.value) {
    return toast({
      title: 'Konfirmasi username tidak cocok',
      description: 'Silakan ketik username dengan benar',
      variant: 'destructive',
    })
  }

  try {
    await remove(userId)
    toast({
      title: 'User dihapus',
      description: `${username.value} berhasil dihapus.`,
      variant: 'destructive',
    })
    confirmUsername.value = ''
    router.push('/users') // Redirect setelah delete
  } catch (err: any) {
    toast({ title: 'Gagal menghapus user', description: err.message, variant: 'destructive' })
  }
}
</script>

<template>
  <div class="w-full space-y-4">
    <h2 class="text-2xl font-semibold">Pengaturan User</h2>
    <p class="text-muted-foreground text-sm">
      Atur ulang password, ubah role, atau hapus user.
    </p>

    <Card>
      <CardHeader>
        <CardTitle>Kelola User</CardTitle>
        <CardDescription>Formulir pengaturan untuk user terpilih</CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Username -->
        <div>
          <Label for="username" class="block mb-1">Username</Label>
          <Input id="username" v-model="username" disabled class="w-full" />
        </div>

        <!-- Password -->
        <div>
          <Label for="password" class="block mb-1">Password Baru</Label>
          <div class="flex gap-2">
            <Input
              id="password"
              v-model="newPassword"
              placeholder="Masukkan password baru"
              class="w-full"
              type="password"
            />
            <Button @click="updatePassword">Update</Button>
          </div>
        </div>

        <!-- Role -->
        <div>
          <Label for="role" class="block mb-1">Ganti Role</Label>
          <div class="flex gap-2">
            <Select v-model="selectedRoleId">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button @click="updateRole">Update</Button>
          </div>
        </div>

        <!-- Delete User -->
        <div>
          <Label class="text-sm font-medium mb-1 block">
            Hapus User <span class="text-muted-foreground">(konfirmasi username)</span>
          </Label>
          <div class="flex gap-2">
            <Input
              v-model="confirmUsername"
              placeholder="Ketik username untuk konfirmasi"
              class="w-full"
            />
            <Button variant="destructive" @click="deleteUser">Hapus</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
