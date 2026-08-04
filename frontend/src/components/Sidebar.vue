<template>
  <aside class="w-64 bg-white dark:bg-[#0b1f3a] border-r border-[#d8e2ee] dark:border-[#1a365d] hidden lg:block shrink-0 p-4 min-h-[calc(100vh-61px)] transition-colors duration-300">
    <nav class="space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        v-show="item.visible"
        class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
        :class="[
          $route.path === item.path
            ? 'bg-[#0b1f3a] dark:bg-white dark:text-[#0b1f3a] text-white shadow-sm font-semibold'
            : 'text-[#52677d] dark:text-gray-400 hover:text-[#102a44] dark:hover:text-white hover:bg-[#f8fafc] dark:hover:bg-[#1a365d]'
        ]"
      >
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const navItems = computed(() => [
  {
    label: 'Dashboard',
    path: '/dashboard',
    visible: true,
  },
  {
    label: 'Daftar Kandidat',
    path: '/candidate',
    visible: true,
  },
  {
    label: 'Pemungutan Suara (Vote)',
    path: '/vote',
    visible: ['siswa', 'calon_ketua', 'calon_anggota'].includes(authStore.role),
  },
  {
    label: 'Hasil & Statistik Voting',
    path: '/result',
    visible: true,
  },
  {
    label: 'Pendaftaran Anggota OSIS',
    path: '/registration',
    visible: ['siswa', 'calon_ketua', 'calon_anggota', 'pembina', 'admin', 'superadmin', 'kepala_sekolah'].includes(authStore.role),
  },
  {
    label: 'Data Siswa',
    path: '/student',
    visible: ['admin', 'superadmin', 'pembina', 'kepala_sekolah'].includes(authStore.role),
  },
  {
    label: 'Kelola Pengguna',
    path: '/users',
    visible: ['admin', 'superadmin'].includes(authStore.role),
  },
  {
    label: 'Demo Chart',
    path: '/chart-demo',
    visible: true,
  },
]);
</script>
