<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useUsers } from '@/composables/useUsers'
import { CalendarDate } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { toDate } from 'radix-vue/date'
import { h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as z from 'zod'

const route = useRoute()
const userId = Number(route.params.id)
const { getById } = useUsers()

const dateValue = ref()
const startDate = ref()
const endDate = ref()
const placeholder = ref()

const formValues = ref({
  nik: '',
  no_ktp: '',
  employee_code: '',
  name: '',
  gender: '',
  date_of_birth: '',
  email: '',
  phone: '',
  address: '',
  marital_status: '',
  start_date: '',
  end_date: '',
  status_karyawan: '',
})

const schema = toTypedSchema(z.object({
  nik: z.string().min(1, 'NIK wajib diisi'),
  no_ktp: z.string().min(1, 'No KTP wajib diisi'),
  employee_code: z.string().min(1, 'Employee No wajib diisi'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  gender: z.string(),
  date_of_birth: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  marital_status: z.string(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status_karyawan: z.string(),
}))

onMounted(async () => {
  const user = await getById(userId)
  if (user?.karyawan) {
    const k = user.karyawan
    formValues.value = {
      nik: k.nik || '',
      no_ktp: k.no_ktp || '',
      employee_code: k.employee_code || '',
      name: k.name || '',
      gender: k.gender || '',
      date_of_birth: k.date_of_birth || '',
      email: k.email || '',
      phone: k.phone || '',
      address: k.address || '',
      marital_status: k.marital_status || '',
      start_date: k.start_date || '',
      end_date: k.end_date || '',
      status_karyawan: k.status_karyawan || '',
    }

    if (k.date_of_birth) {
      const d = new Date(k.date_of_birth)
      dateValue.value = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
    }

    if (k.start_date) {
      const s = new Date(k.start_date)
      startDate.value = new CalendarDate(s.getFullYear(), s.getMonth() + 1, s.getDate())
    }

    if (k.end_date) {
      const e = new Date(k.end_date)
      endDate.value = new CalendarDate(e.getFullYear(), e.getMonth() + 1, e.getDate())
    }
  }
})

function onSubmit(values: any) {
  toast({
    title: 'Data Terkirim!',
    description: h('pre', { class: 'mt-2 bg-slate-950 p-4 rounded text-white' }, JSON.stringify(values, null, 2)),
  })
}
</script>
<template>
  <div>
    <h3 class="text-lg font-semibold mb-1">Profil Karyawan</h3>
    <p class="text-sm text-muted-foreground mb-4">Lengkapi data profil karyawan</p>
    <Separator />

    <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ setFieldValue }" class="space-y-6 mt-6">

      <!-- Card 1: Identitas -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Informasi Identitas</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="nik" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.nik" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="no_ktp" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>No KTP</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.no_ktp" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="employee_code" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Employee No</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.employee_code" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.name" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Card 2: Informasi Pribadi -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Informasi Pribadi</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="gender" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.gender" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="date_of_birth" v-slot="{ field }">
            <FormItem>
              <FormLabel>Tanggal Lahir</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="outline" class="w-full text-left">
                      <span>{{ dateValue ? dateValue.toString() : 'Pilih tanggal' }}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="p-0">
                    <Calendar
                      v-model="dateValue"
                      calendar-label="Tanggal Lahir"
                      @update:model-value="(v: any) => {
                        dateValue = v
                        setFieldValue('date_of_birth', toDate(v).toISOString())
                      }"
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.email" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="phone" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Telepon</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.phone" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Card 3: Alamat dan Status -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Alamat dan Status</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="address" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.address" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="marital_status" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Status Pernikahan</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.marital_status" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Card 4: Riwayat Kerja -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Riwayat Kerja</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="start_date" v-slot="{ field }">
            <FormItem>
              <FormLabel>Tanggal Mulai</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="outline" class="w-full text-left">
                      <span>{{ startDate ? startDate.toString() : 'Pilih tanggal' }}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="p-0">
                    <Calendar
                      v-model="startDate"
                      calendar-label="Tanggal Mulai"
                      @update:model-value="(v: any) => {
                        startDate.value = v
                        setFieldValue('start_date', toDate(v).toISOString())
                      }"
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="end_date" v-slot="{ field }">
            <FormItem>
              <FormLabel>Tanggal Selesai</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="outline" class="w-full text-left">
                      <span>{{ endDate ? endDate.toString() : 'Pilih tanggal' }}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="p-0">
                    <Calendar
                      v-model="endDate"
                      calendar-label="Tanggal Selesai"
                      @update:model-value="(v: any) => {
                        endDate.value = v
                        setFieldValue('end_date', toDate(v).toISOString())
                      }"
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="status_karyawan" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Status Karyawan</FormLabel>
              <FormControl><Input v-bind="componentField" :value="formValues.status_karyawan" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Submit -->
      <div class="flex justify-end">
        <Button type="submit">Simpan Data</Button>
      </div>
    </Form>
  </div>
</template>
