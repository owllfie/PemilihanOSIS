import { defineStore } from 'pinia';
import api from '@/services/api';

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStudents() {
      this.loading = true;
      try {
        const response = await api.get('/students');
        this.students = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Gagal memuat data siswa.';
      } finally {
        this.loading = false;
      }
    },

    async createStudent(studentData) {
      try {
        const response = await api.post('/students', studentData);
        await this.fetchStudents();
        return response.data;
      } catch (err) {
        throw err.response?.data?.error || 'Gagal menambahkan siswa.';
      }
    },

    async updateStudent(id, studentData) {
      try {
        const response = await api.put(`/students/${id}`, studentData);
        await this.fetchStudents();
        return response.data;
      } catch (err) {
        throw err.response?.data?.error || 'Gagal memperbarui siswa.';
      }
    },

    async deleteStudent(id) {
      try {
        await api.delete(`/students/${id}`);
        await this.fetchStudents();
      } catch (err) {
        throw err.response?.data?.error || 'Gagal menghapus siswa.';
      }
    },
  },
});
