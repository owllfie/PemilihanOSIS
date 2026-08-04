<template>
  <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] rounded-3xl p-8 shadow-sm">
    <div class="text-center mb-8 flex flex-col items-center">
      <!-- Logo Placeholder -->
      <div class="w-16 h-16 rounded-2xl bg-[#0b1f3a] dark:bg-white text-white dark:text-[#0b1f3a] flex items-center justify-center mb-4 shadow-md shrink-0">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-black text-[#0b1f3a] dark:text-white tracking-tight">Sistem Pemilihan OSIS</h2>
      <p class="text-xs text-[#52677d] dark:text-gray-400 mt-1">Silakan masukkan username dan password</p>
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
