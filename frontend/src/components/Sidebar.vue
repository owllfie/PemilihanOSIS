<template>
  <!-- ── Mobile Drawer (Teleported to body) ─────────────────────── -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="uiStore.sidebarOpen" class="fixed inset-0 z-[100] lg:hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="uiStore.closeSidebar()"></div>

        <aside class="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white dark:bg-[#0b1f3a] border-r border-[#d8e2ee] dark:border-[#1a365d] flex flex-col p-5 z-10 shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <router-link
              to="/dashboard"
              @click="uiStore.closeSidebar()"
              class="flex items-center gap-3"
            >
            </router-link>
            <button
              @click="uiStore.closeSidebar()"
              class="w-9 h-9 rounded-xl border border-[#d8e2ee] dark:border-[#1a365d] flex items-center justify-center text-[#0b1f3a] dark:text-white hover:bg-[#f8fafc] dark:hover:bg-[#1a365d] transition-colors cursor-pointer"
              aria-label="Tutup menu"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Nav -->
          <nav class="flex-1 space-y-1 overflow-y-auto">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              v-show="item.visible"
              @click="uiStore.closeSidebar()"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
              :class="linkClass(item)"
            >
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              <span class="whitespace-nowrap">{{ item.label }}</span>
            </router-link>
          </nav>

          <!-- User / Logout -->
          <div class="border-t border-[#d8e2ee] dark:border-[#1a365d] pt-4 mt-4">
            <button
              @click="handleLogout"
              class="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-[#f8fafc] dark:hover:bg-[#1a365d] transition-colors cursor-pointer"
            >
              <span class="w-9 h-9 rounded-full bg-[#123a66]/10 dark:bg-[#1a365d] flex items-center justify-center shrink-0">
                <UserRound class="w-4.5 h-4.5 text-[#164574] dark:text-blue-400" />
              </span>
              <span class="flex flex-col items-start overflow-hidden">
                <span class="text-xs font-semibold text-[#102a44] dark:text-gray-200 truncate max-w-[160px]">{{ authStore.nama || 'Pengguna' }}</span>
                <span class="text-[10px] text-[#52677d] dark:text-gray-400 truncate max-w-[160px]">{{ formatRole(authStore.role) }}</span>
              </span>
              <LogOut class="w-4 h-4 text-rose-500 ml-auto shrink-0" />
            </button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <!-- ── Desktop Sidebar (hover-collapsible) ───────────────────── -->
  <aside
    class="hidden lg:flex flex-col bg-white dark:bg-[#0b1f3a] border-r border-[#d8e2ee] dark:border-[#1a365d] shrink-0 min-h-[calc(100vh-61px)] p-4 transition-[width] duration-300 ease-in-out overflow-hidden"
    :class="collapsed ? 'w-[76px]' : 'w-[264px]'"
    @mouseenter="collapsed = false"
    @mouseleave="collapsed = true"
  >
    <!-- Nav -->
    <nav class="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        v-show="item.visible"
        class="flex items-center rounded-xl font-medium text-sm transition-all duration-200"
        :class="[linkClass(item), collapsed ? 'justify-center gap-0 py-2.5' : 'justify-start gap-3 px-3 py-2.5']"
        :title="collapsed ? item.label : undefined"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span
          class="overflow-hidden whitespace-nowrap transition-all duration-300"
          :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-[180px] opacity-100'"
        >
          {{ item.label }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import {
  LayoutDashboard,
  Users,
  Vote,
  BarChart3,
  ClipboardList,
  GraduationCap,
  ShieldCheck,
  LogOut,
  X,
  UserRound,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const collapsed = ref(false);

const navItems = computed(() => [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, visible: true },
  {
    label: 'Daftar Kandidat',
    path: '/candidate',
    icon: Users,
    visible: true,
  },
  {
    label: 'Pemungutan Suara',
    path: '/vote',
    icon: Vote,
    visible: ['siswa', 'calon_ketua', 'calon_anggota'].includes(authStore.role),
  },
  {
    label: 'Hasil & Statistik',
    path: '/result',
    icon: BarChart3,
    visible: true,
  },
  {
    label: 'Pendaftaran OSIS',
    path: '/registration',
    icon: ClipboardList,
    visible: ['siswa', 'calon_ketua', 'calon_anggota', 'pembina', 'admin', 'superadmin', 'kepala_sekolah'].includes(authStore.role),
  },
  {
    label: 'Data Siswa',
    path: '/student',
    icon: GraduationCap,
    visible: ['admin', 'superadmin', 'pembina', 'kepala_sekolah'].includes(authStore.role),
  },
  {
    label: 'Kelola Pengguna',
    path: '/users',
    icon: ShieldCheck,
    visible: ['admin', 'superadmin'].includes(authStore.role),
  },
]);

const linkClass = (item) => ({
  'bg-[#0b1f3a] dark:bg-white dark:text-[#0b1f3a] text-white shadow-sm font-semibold':
    item.path === activePath.value,
  'text-[#52677d] dark:text-gray-400 hover:text-[#102a44] dark:hover:text-white hover:bg-[#f8fafc] dark:hover:bg-[#1a365d]':
    item.path !== activePath.value,
});

const activePath = computed(() => router.currentRoute.value.path);

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
  uiStore.closeSidebar();
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Mobile drawer: fade backdrop + slide-in panel */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active aside,
.drawer-leave-active aside {
  transition: transform 0.3s ease;
}
.drawer-enter-from aside,
.drawer-leave-to aside {
  transform: translateX(-100%);
}
</style>
