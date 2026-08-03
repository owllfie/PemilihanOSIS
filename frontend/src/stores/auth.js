import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role || '',
    nama: (state) => state.user?.nama || '',
    isAdmin: (state) => ['superadmin', 'admin'].includes(state.user?.role),
    isSiswa: (state) => ['siswa', 'calon_ketua', 'calon_anggota'].includes(state.user?.role),
    isPembina: (state) => state.user?.role === 'pembina',
    isKepalaSekolah: (state) => state.user?.role === 'kepala_sekolah',
    isCalonKetua: (state) => state.user?.role === 'calon_ketua',
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { username, password });
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
      } catch (err) {
        this.error = err.response?.data?.error || 'Gagal melakukan login.';
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      if (!this.token) return;
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (err) {
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});
