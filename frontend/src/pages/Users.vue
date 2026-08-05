<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-[#0b1f3a]">Kelola Akun Pengguna (Users)</h2>
        <p class="text-xs text-[#52677d] mt-1">Pengelolaan seluruh role pengguna sistem E-Voting OSIS</p>
      </div>

      <button
        @click="showModal = true"
        class="px-4 py-2.5 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white font-bold text-xs shadow-sm cursor-pointer"
      >
        + Tambah User Baru
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-[#d8e2ee] rounded-3xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-[#334e68]">
          <thead class="bg-white text-[#52677d] uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nama Lengkap</th>
              <th class="px-6 py-4">Username</th>
              <th class="px-6 py-4">Role / Hak Akses</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#d8e2ee]">
            <tr v-for="u in users" :key="u.user_id" class="hover:bg-[#eef3f8] dark:hover:bg-[#1e293b] transition-colors">
              <td class="px-6 py-4 font-mono font-bold text-[#6b7f95]">#{{ u.user_id }}</td>
              <td class="px-6 py-4 font-bold text-[#0b1f3a]">{{ u.nama }}</td>
              <td class="px-6 py-4 font-mono text-[#52677d]">{{ u.username }}</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#123a66]/10 text-[#164574] border border-[#c8d8ea]">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  :class="u.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                >
                  {{ u.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button @click="editUser(u)" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold cursor-pointer">Edit</button>
                <button @click="deleteUser(u.user_id)" class="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold cursor-pointer">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <Modal :show="showModal" :title="isEdit ? 'Edit User' : 'Tambah User Baru'" @close="closeModal">
      <form @submit.prevent="saveUser" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Nama Lengkap</label>
          <input v-model="form.nama" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Username Login</label>
          <input v-model="form.username" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Password {{ isEdit ? '(Kosongkan jika tidak diganti)' : '' }}</label>
          <input v-model="form.password" type="password" :required="!isEdit" class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Role / Hak Akses</label>
          <select v-model="form.role" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm">
            <option value="admin">Admin</option>
            <option value="siswa">Siswa</option>
            <option value="calon_ketua">Calon Ketua</option>
            <option value="calon_anggota">Calon Anggota OSIS</option>
            <option value="pembina">Pembina OSIS</option>
            <option value="kepala_sekolah">Kepala Sekolah</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Status Akun</label>
          <select v-model="form.status" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non-Aktif</option>
          </select>
        </div>

        <div class="pt-4 flex justify-end space-x-3">
          <button type="button" @click="closeModal" class="px-4 py-2 rounded-xl bg-[#f8fafc] text-[#334e68] text-xs font-bold cursor-pointer">Batal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-[#0b1f3a] text-white text-xs font-bold cursor-pointer">Simpan User</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Modal from '@/components/Modal.vue';
import api from '@/services/api';

const users = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  nama: '',
  username: '',
  password: '',
  role: 'siswa',
  status: 'aktif',
});

const loadUsers = async () => {
  try {
    const res = await api.get('/users');
    users.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const editUser = (u) => {
  isEdit.value = true;
  editId.value = u.user_id;
  form.value = {
    nama: u.nama,
    username: u.username,
    password: '',
    role: u.role,
    status: u.status,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEdit.value = false;
  editId.value = null;
  form.value = { nama: '', username: '', password: '', role: 'siswa', status: 'aktif' };
};

const saveUser = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/users/${editId.value}`, form.value);
    } else {
      await api.post('/users', form.value);
    }
    await loadUsers();
    closeModal();
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal menyimpan user.');
  }
};

const deleteUser = async (id) => {
  if (confirm('Yakin ingin menghapus user ini?')) {
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menghapus user.');
    }
  }
};

onMounted(() => {
  loadUsers();
});
</script>
