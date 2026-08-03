<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-[#0b1f3a]">Daftar Pasangan Calon Ketua & Wakil OSIS</h2>
        <p class="text-xs text-[#52677d] mt-1">Kandidat resmi Pemilihan Ketua & Wakil OSIS</p>
      </div>

      <button
        v-if="authStore.isAdmin"
        @click="showCreateModal = true"
        class="px-4 py-2.5 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white font-bold text-xs shadow-sm cursor-pointer"
      >
        + Tambah Paslon Baru
      </button>
    </div>

    <!-- Candidate Cards Grid -->
    <div v-if="candidateStore.loading" class="text-center py-12 text-[#52677d]">
      Memuat daftar paslon...
    </div>

    <div v-else-if="candidateStore.candidates.length === 0" class="bg-white border border-[#d8e2ee] rounded-2xl p-8 text-center text-[#52677d]">
      Belum ada pasangan calon yang terdaftar.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="c in candidateStore.candidates" :key="c.calon_id" class="relative group">
        <CandidateCard :candidate="c" :can-vote="false" />

        <!-- Admin Control Buttons -->
        <div v-if="authStore.isAdmin" class="mt-3 flex items-center space-x-2 justify-end">
          <button
            @click="editCandidate(c)"
            class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold cursor-pointer"
          >
            Edit Paslon
          </button>
          <button
            @click="deleteCandidate(c.calon_id)"
            class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Candidate Modal for Admin -->
    <Modal :show="showCreateModal" :title="isEdit ? 'Edit Pasangan Calon' : 'Tambah Pasangan Calon Baru'" @close="closeModal">
      <form @submit.prevent="saveCandidate" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Nomor Urut</label>
          <input v-model="form.nomor_urut" type="number" min="1" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Ketua (Siswa)</label>
          <select v-model="form.ketua_id" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm">
            <option value="" disabled>Pilih Siswa Ketua...</option>
            <option v-for="s in students" :key="s.siswa_id" :value="s.siswa_id">
              {{ s.user?.nama }} ({{ s.nis }} - {{ s.kelas }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Wakil (Siswa)</label>
          <select v-model="form.wakil_id" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm">
            <option value="" disabled>Pilih Siswa Wakil...</option>
            <option v-for="s in students" :key="s.siswa_id" :value="s.siswa_id">
              {{ s.user?.nama }} ({{ s.nis }} - {{ s.kelas }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Visi</label>
          <textarea v-model="form.visi" rows="3" class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" placeholder="Tuliskan visi paslon..."></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Misi</label>
          <textarea v-model="form.misi" rows="4" class="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm" placeholder="Tuliskan poin-poin misi..."></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Foto Paslon (JPG/PNG, Max 2MB)</label>
          <input @change="handleFileChange" type="file" accept="image/*" class="w-full text-xs text-[#52677d] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0b1f3a] file:text-white hover:file:bg-[#123a66] cursor-pointer" />
        </div>

        <div class="pt-4 flex justify-end space-x-3">
          <button type="button" @click="closeModal" class="px-4 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#e8eef6] text-[#334e68] text-xs font-bold cursor-pointer">Batal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white text-xs font-bold cursor-pointer">Simpan Paslon</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCandidateStore } from '@/stores/candidate';
import Modal from '@/components/Modal.vue';
import CandidateCard from '@/components/CandidateCard.vue';
import api from '@/services/api';

const authStore = useAuthStore();
const candidateStore = useCandidateStore();

const showCreateModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const students = ref([]);

const form = ref({
  nomor_urut: '',
  ketua_id: '',
  wakil_id: '',
  visi: '',
  misi: '',
  foto: null,
});

const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    form.value.foto = e.target.files[0];
  }
};

const editCandidate = (c) => {
  isEdit.value = true;
  editId.value = c.calon_id;
  form.value = {
    nomor_urut: c.nomor_urut,
    ketua_id: c.ketua_id,
    wakil_id: c.wakil_id,
    visi: c.visi,
    misi: c.misi,
    foto: null,
  };
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  isEdit.value = false;
  editId.value = null;
  form.value = { nomor_urut: '', ketua_id: '', wakil_id: '', visi: '', misi: '', foto: null };
};

const saveCandidate = async () => {
  const formData = new FormData();
  formData.append('nomor_urut', form.value.nomor_urut);
  formData.append('ketua_id', form.value.ketua_id);
  formData.append('wakil_id', form.value.wakil_id);
  formData.append('visi', form.value.visi);
  formData.append('misi', form.value.misi);
  if (form.value.foto) {
    formData.append('foto', form.value.foto);
  }

  try {
    if (isEdit.value) {
      await candidateStore.updateCandidate(editId.value, formData);
    } else {
      await candidateStore.createCandidate(formData);
    }
    closeModal();
  } catch (err) {
    alert(err || 'Gagal menyimpan calon.');
  }
};

const deleteCandidate = async (id) => {
  if (confirm('Yakin ingin menghapus calon ini?')) {
    try {
      await candidateStore.deleteCandidate(id);
    } catch (err) {
      alert(err || 'Gagal menghapus calon.');
    }
  }
};

onMounted(async () => {
  await candidateStore.fetchCandidates();
  if (authStore.isAdmin) {
    const res = await api.get('/students');
    students.value = res.data;
  }
});
</script>
