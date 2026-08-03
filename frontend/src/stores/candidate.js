import { defineStore } from 'pinia';
import api from '@/services/api';

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    candidates: [],
    candidateProfile: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCandidates() {
      this.loading = true;
      try {
        const response = await api.get('/candidate');
        this.candidates = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Gagal memuat kandidat.';
      } finally {
        this.loading = false;
      }
    },

    async fetchCandidateProfile() {
      this.loading = true;
      try {
        const response = await api.get('/candidate/profile');
        this.candidateProfile = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Gagal memuat profil calon.';
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(formData) {
      this.loading = true;
      try {
        const response = await api.put('/candidate/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchCandidateProfile();
        return response.data;
      } catch (err) {
        throw err.response?.data?.error || 'Gagal memperbarui profil.';
      } finally {
        this.loading = false;
      }
    },

    async createCandidate(formData) {
      this.loading = true;
      try {
        const response = await api.post('/candidate', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchCandidates();
        return response.data;
      } catch (err) {
        throw err.response?.data?.error || 'Gagal menambahkan kandidat.';
      } finally {
        this.loading = false;
      }
    },

    async updateCandidate(id, formData) {
      this.loading = true;
      try {
        const response = await api.put(`/candidate/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchCandidates();
        return response.data;
      } catch (err) {
        throw err.response?.data?.error || 'Gagal memperbarui kandidat.';
      } finally {
        this.loading = false;
      }
    },

    async deleteCandidate(id) {
      try {
        await api.delete(`/candidate/${id}`);
        await this.fetchCandidates();
      } catch (err) {
        throw err.response?.data?.error || 'Gagal menghapus kandidat.';
      }
    },
  },
});
