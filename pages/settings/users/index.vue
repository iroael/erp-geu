<script setup lang="ts">
import type { User } from '~/types/schema'
import { columns as rawColumns } from '@/components/users/components/columns'
import DataTable from '@/components/users/components/DataTable.vue'
import { useUsers } from '@/composables/useUsers'
import NumberFlow from '@number-flow/vue'
import { ref, watch, onMounted } from 'vue'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-vue-next'

// ✅ Jadikan CSR
definePageMeta({
  ssr: false
})

// Dummy data untuk kartu statistik
const dataCard = ref({
  totalRevenue: 45231.89,
  totalRevenueDesc: 0.201,
  subscriptions: 2350,
  subscriptionsDesc: 1.805,
  sales: 12234,
  salesDesc: 0.45,
  activeNow: 573,
  activeNowDesc: 201,
})

// State
const {
  fetch,
  users,
  total,
  error: storeError,
  isLoading: storeLoading,
} = useUsers()

const pageIndex = ref(0)
const pageSize = ref(10)
const showEditModal = ref(false)
const selectedUser = ref<User | null>(null)

// ✅ Panggil fetchData saat pertama kali halaman dimuat
const fetchData = async () => {
  try {
    await fetch(pageIndex.value * pageSize.value, pageSize.value)
  } catch (err: any) {
    console.error('Error fetching users:', err)
  }
}
onMounted(fetchData)

// ✅ Refetch data saat pageIndex atau pageSize berubah
watch([pageIndex, pageSize], fetchData)

const handleEdit = (user: User) => {
  selectedUser.value = user
  showEditModal.value = true
}

const handleEditSuccess = async () => {
  showEditModal.value = false
  selectedUser.value = null
  await fetchData()
}

const columns = rawColumns({ onEdit: handleEdit, onDeleteSuccess: fetchData })
</script>


<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">Users</h2>
      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
        <Button>Download</Button>
      </div>
    </div>

    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <!-- Metrics Cards -->
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8">
       
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.totalRevenue" :format="{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }" />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow :value="dataCard.totalRevenueDesc" prefix="+" :format="{ style: 'percent', minimumFractionDigits: 1 }" /> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.subscriptions" prefix="+" />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow :value="dataCard.subscriptionsDesc" prefix="+" :format="{ style: 'percent', minimumFractionDigits: 1 }" /> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">Sales</CardTitle>
            <CreditCard class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.sales" prefix="+" />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow :value="dataCard.salesDesc" prefix="+" :format="{ style: 'percent', minimumFractionDigits: 1 }" /> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">Active Now</CardTitle>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.activeNow" prefix="+" />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow :value="dataCard.activeNowDesc" prefix="+" /> since last hour
            </p>
          </CardContent>
        </Card>

        <!-- Repeat for Subscriptions, Sales, ActiveNow... -->
      </div>

      <!-- Users Table -->
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-4">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent class="pl-2">
            <div v-if="storeError" class="text-red-500">{{ storeError }}</div>

            <div v-if="storeLoading" class="space-y-2">
            <div v-for="i in 10" :key="i" class="animate-pulse flex items-center space-x-4 rounded border p-4 shadow-sm bg-white">
              <div class="h-10 w-10 bg-muted rounded-full"></div>
              <div class="flex-1 space-y-2 py-1">
                <div class="h-4 bg-muted rounded w-3/4"></div>
                <div class="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>

            <DataTable
              v-if="!storeLoading && users.length"
              :data="users"
              :columns="columns"
              :total-rows="total"
              :page-index="pageIndex"
              :page-size="pageSize"
              @update:page-index="pageIndex = $event"
              @update:page-size="pageSize = $event"
              @refresh="fetchData"
            />

          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
