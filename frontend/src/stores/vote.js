import { defineStore } from 'pinia';
import api from '@/services/api';

export const useVoteStore = defineStore('vote', {
  state: () => ({
    hasVoted: false,
    voteDetails: null,
    activePeriod: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchVoteStatus() {
      this.loading = true;
      try {
        const response = await api.get('/vote/status');
        this.hasVoted = response.data.voted;
        this.voteDetails = response.data.vote_details;
        this.activePeriod = response.data.periode_aktif;
      } catch (err) {
        this.error = err.response?.data?.error || 'Gagal memuat status voting.';
      } finally {
        this.loading = false;
      }
    },

    async submitVote(calonId) {
      this.loading = true;
      try {
        const response = await api.post('/vote', { calon_id: calonId });
        await this.fetchVoteStatus();
        return response.data;
      } catch (err) {
        throw err.response?.data?.error || 'Gagal melakukan voting.';
      } finally {
        this.loading = false;
      }
    },
  },
});
