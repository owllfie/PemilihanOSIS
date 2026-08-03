<template>
  <header class="bg-white border-b border-[#d8e2ee] sticky top-0 z-30 px-4 py-3 sm:px-6 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-lg bg-[#0b1f3a] flex items-center justify-center">
        <span class="font-black text-xl text-white tracking-wider">O</span>
      </div>
      <div>
        <h1 class="text-lg font-black text-[#0b1f3a] leading-none">
          E-Voting OSIS
        </h1>
        <p class="text-xs text-[#52677d] mt-0.5 hidden sm:block">Sistem Pemilihan Ketua & Anggota OSIS</p>
      </div>
    </div>

    <div class="flex items-center space-x-3">
      <div class="text-right hidden md:block">
        <div class="text-sm font-semibold text-[#102a44]">{{ authStore.nama }}</div>
        <span class="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#123a66]/10 text-[#164574] border border-[#c8d8ea]">
          {{ formatRole(authStore.role) }}
        </span>
      </div>

      <button
        @click="handleLogout"
        class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all duration-200 cursor-pointer"
      >
        <span>Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const formatRole = (role) => {
  const map = {
    superadmin: 'Super Admin',
    admin: 'Admin OSIS',
    siswa: 'Siswa / Pemilih',
    calon_ketua: 'Calon Ketua',
    calon_anggota: 'Calon Anggota',
    pembina: 'Pembina OSIS',
    kepala_sekolah: 'Kepala Sekolah',
  };
  return map[role] || role;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
