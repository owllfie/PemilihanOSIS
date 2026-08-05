<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-[#0b1f3a]">Kelola Data Siswa Pemilih</h2>
        <p class="text-xs text-[#52677d] mt-1">Daftar siswa yang memiliki hak akses & hak pilih pada sistem</p>
      </div>

      <button
        v-if="authStore.isAdmin"
        @click="showModal = true"
        class="px-4 py-2.5 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white font-bold text-xs shadow-sm cursor-pointer"
      >
        + Tambah Data Siswa
      </button>
    </div>

    <!-- Student List Table -->
    <div class="bg-white border border-[#d8e2ee] rounded-3xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-[#334e68]">
          <thead class="bg-white text-[#52677d] uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th class="px-6 py-4">NIS</th>
              <th class="px-6 py-4">Nama Siswa</th>
              <th class="px-6 py-4">Username</th>
              <th class="px-6 py-4">Kelas & Rombel</th>
              <th class="px-6 py-4">Jurusan</th>
              <th class="px-6 py-4">Status</th>
              <th v-if="authStore.isAdmin" class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#d8e2ee]">
            <tr v-for="s in studentStore.students" :key="s.siswa_id" class="hover:bg-[#eef3f8] dark:hover:bg-[#1e293b] transition-colors">
              <td class="px-6 py-4 font-mono font-bold text-[#164574]">{{ s.nis }}</td>
              <td class="px-6 py-4 font-bold text-[#0b1f3a]">{{ s.user?.nama }}</td>
              <td class="px-6 py-4 text-[#52677d]">{{ s.user?.username }}</td>
              <td class="px-6 py-4">{{ s.kelas }} ({{ s.rombel }})</td>
              <td class="px-6 py-4">{{ s.jurusan || '-' }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  :class="s.user?.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                >
                  {{ s.user?.status }}
                </span>
              </td>
              <td v-if="authStore.isAdmin" class="px-6 py-4 text-right space-x-2">
                <button @click="editStudent(s)" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-black text-[11px] font-semibold cursor-pointer">Edit</button>
                <button @click="deleteStudent(s.siswa_id)" class="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-black text-[11px] font-semibold cursor-pointer">Hapus</button>
              </td>
            </tr>
            <tr v-if="studentStore.students.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-[#6b7f95]">Belum ada data siswa.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal :show="showModal" :title="isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'" @close="closeModal">
      <form @submit.prevent="saveStudent" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Nama Lengkap</label>
          <input v-model="form.nama" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Username Login</label>
          <input v-model="form.username" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Password {{ isEdit ? '(Opsional)' : '' }}</label>
          <input v-model="form.password" type="password" :required="!isEdit" class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">NIS</label>
          <input v-model="form.nis" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Kelas</label>
            <input v-model="form.kelas" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" placeholder="Contoh: XI" />
          </div>
          <div>
            <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Rombel</label>
            <input v-model="form.rombel" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" placeholder="Contoh: XI-IPA-1" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Jurusan</label>
          <input v-model="form.jurusan" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" placeholder="IPA / IPS / Dll" />
        </div>

        <div class="pt-4 flex justify-end space-x-3">
          <button type="button" @click="closeModal" class="px-4 py-2 rounded-xl bg-[#f8fafc] text-[#334e68] text-xs font-bold cursor-pointer">Batal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-[#0b1f3a] text-white text-xs font-bold cursor-pointer">Simpan Siswa</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useStudentStore } from '@/stores/student';
import Modal from '@/components/Modal.vue';

const authStore = useAuthStore();
const studentStore = useStudentStore();

const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  nama: '',
  username: '',
  password: '',
  nis: '',
  kelas: '',
  rombel: '',
  jurusan: '',
});

const editStudent = (s) => {
  isEdit.value = true;
  editId.value = s.siswa_id;
  form.value = {
    nama: s.user?.nama || '',
    username: s.user?.username || '',
    password: '',
    nis: s.nis,
    kelas: s.kelas,
    rombel: s.rombel,
    jurusan: s.jurusan || '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEdit.value = false;
  editId.value = null;
  form.value = { nama: '', username: '', password: '', nis: '', kelas: '', rombel: '', jurusan: '' };
};

const saveStudent = async () => {
  try {
    if (isEdit.value) {
      await studentStore.updateStudent(editId.value, form.value);
    } else {
      await studentStore.createStudent(form.value);
    }
    closeModal();
  } catch (err) {
    alert(err || 'Gagal menyimpan siswa.');
  }
};

const deleteStudent = async (id) => {
  if (confirm('Yakin ingin menghapus data siswa ini?')) {
    try {
      await studentStore.deleteStudent(id);
    } catch (err) {
      alert(err || 'Gagal menghapus siswa.');
    }
  }
};

onMounted(() => {
  studentStore.fetchStudents();
});
</script>
