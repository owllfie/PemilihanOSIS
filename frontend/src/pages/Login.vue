<template>
  <div class="bg-white border border-[#d8e2ee] rounded-3xl p-8 shadow-sm">
    <div class="text-center mb-8">
      <div class="w-16 h-16 rounded-2xl bg-[#0b1f3a] mx-auto flex items-center justify-center mb-4">
        <span class="font-black text-3xl text-white">O</span>
      </div>
      <h2 class="text-2xl font-black text-[#0b1f3a] tracking-tight">Sistem Pemilihan OSIS</h2>
      <p class="text-xs text-[#52677d] mt-1">Silakan masuk menggunakan akun terdaftar Anda</p>
    </div>

    <div v-if="error" class="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
      ⚠️ {{ error }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-[#334e68] uppercase tracking-wider mb-1.5">Username</label>
        <input
          v-model="username"
          type="text"
          required
          placeholder="Masukkan username..."
          class="w-full px-4 py-3 rounded-xl bg-white border border-[#d8e2ee] text-[#0b1f3a] text-sm focus:outline-none focus:border-[#123a66] focus:ring-1 focus:ring-[#123a66] transition-all duration-200"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-[#334e68] uppercase tracking-wider mb-1.5">Password</label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="Masukkan password..."
          class="w-full px-4 py-3 rounded-xl bg-white border border-[#d8e2ee] text-[#0b1f3a] text-sm focus:outline-none focus:border-[#123a66] focus:ring-1 focus:ring-[#123a66] transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#0b1f3a] hover:opacity-95 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-[#0b1f3a]/10 cursor-pointer mt-2"
      >
        <span v-if="loading">Memproses...</span>
        <span v-else>Masuk ke Sistem</span>
      </button>
    </form>

    <!-- Preset Role Logins for testing convenience -->
    <div class="mt-8 pt-6 border-t border-[#d8e2ee] text-center">
      <p class="text-xs font-bold text-[#52677d] uppercase tracking-wider mb-3">Akun Demo (Klik untuk Isi):</p>
      <div class="flex flex-wrap gap-1.5 justify-center">
        <button @click="quickFill('admin', 'password123')" class="px-2.5 py-1 text-[11px] rounded-lg bg-[#f8fafc] hover:bg-[#e8eef6] text-[#123a66] border border-[#d8e2ee] cursor-pointer">Admin</button>
        <button @click="quickFill('budi_ketua', 'password123')" class="px-2.5 py-1 text-[11px] rounded-lg bg-[#f8fafc] hover:bg-[#e8eef6] text-[#1f5c99] border border-[#d8e2ee] cursor-pointer">Calon Ketua</button>
        <button @click="quickFill('eko_siswa', 'password123')" class="px-2.5 py-1 text-[11px] rounded-lg bg-[#f8fafc] hover:bg-[#e8eef6] text-[#286140] border border-[#d8e2ee] cursor-pointer">Siswa</button>
        <button @click="quickFill('pembina', 'password123')" class="px-2.5 py-1 text-[11px] rounded-lg bg-[#f8fafc] hover:bg-[#e8eef6] text-[#8a5a00] border border-[#d8e2ee] cursor-pointer">Pembina</button>
        <button @click="quickFill('kepsek', 'password123')" class="px-2.5 py-1 text-[11px] rounded-lg bg-[#f8fafc] hover:bg-[#e8eef6] text-[#4b3b7a] border border-[#d8e2ee] cursor-pointer">Kepala Sekolah</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const quickFill = (u, p) => {
  username.value = u;
  password.value = p;
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login(username.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Login gagal. Cek username dan password Anda.';
  } finally {
    loading.value = false;
  }
};
</script>
