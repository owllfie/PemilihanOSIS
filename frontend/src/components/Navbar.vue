<template>
  <header class="bg-white dark:bg-[#0b1f3a] border-b border-[#d8e2ee] dark:border-[#1a365d] sticky top-0 z-30 px-4 py-3 sm:px-6 flex items-center justify-between transition-colors duration-300">
    <div class="flex items-center space-x-3">
      <!-- Mobile Sidebar Toggle -->
      <button
        @click="uiStore.toggleSidebar()"
        class="lg:hidden w-9 h-9 rounded-xl border border-[#d8e2ee] dark:border-[#1a365d] flex items-center justify-center text-[#0b1f3a] dark:text-white hover:bg-[#f8fafc] dark:hover:bg-[#1a365d] transition-colors cursor-pointer shrink-0"
        aria-label="Buka menu navigasi"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Logo Placeholder -->
      <div>
        <h1 class="text-lg font-black text-[#0b1f3a] dark:text-white leading-none">
          E-Voting OSIS
        </h1>
        <p class="text-xs text-[#52677d] dark:text-gray-400 mt-0.5 hidden sm:block">Sistem Pemilihan Ketua & Anggota OSIS</p>
      </div>
    </div>

    <div class="flex items-center space-x-4">

      <!-- Profile Dropdown Container -->
      <div class="relative" ref="dropdownRef">
        <!-- Trigger Button / Profile Area -->
        <button 
          @click="toggleDropdown" 
          class="flex items-center space-x-2 group cursor-pointer focus:outline-none"
        >
          <div class="text-right hidden md:block">
            <div class="text-sm font-semibold text-[#102a44] dark:text-gray-200 group-hover:text-[#0b1f3a] dark:group-hover:text-white transition-colors">{{ authStore.nama }}</div>
            <div class="text-[10px] text-[#52677d] dark:text-gray-400 leading-none mt-0.5">{{ formatRole(authStore.role) }}</div>
          </div>
          <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#1a365d] flex items-center justify-center overflow-hidden border border-gray-300 dark:border-[#1a365d] group-hover:border-indigo-500 transition-all duration-200 shadow-sm">
            <svg class="w-6 h-6 text-gray-400 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="isOpen" 
            class="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] shadow-lg py-1 z-50"
          >
            <!-- Info user khusus tampilan mobile/kecil -->
            <div class="px-4 py-2 border-b border-gray-100 dark:border-[#1a365d] md:hidden">
              <div class="text-xs font-semibold text-[#102a44] dark:text-gray-200 truncate">{{ authStore.nama }}</div>
              <div class="text-[10px] text-[#52677d] dark:text-gray-400 mt-0.5">{{ formatRole(authStore.role) }}</div>
            </div>

            <!-- Link Profil Saya -->
            <router-link 
              to="/profile" 
              @click="isOpen = false"
              class="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a365d] transition-colors"
            >
              <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profil Saya</span>
            </router-link>

            <!-- Tombol Logout di dalam Dropdown -->
            <button
              @click="handleLogout"
              class="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
            >
              <svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const isOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Menutup dropdown otomatis jika pengguna mengklik area di luar dropdown
const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

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
  isOpen.value = false;
  authStore.logout();
  router.push('/login');
};
</script>