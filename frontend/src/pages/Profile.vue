<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <div>
      <h2 class="text-2xl font-black text-[#0b1f3a]">Profil Pengguna</h2>
      <p class="text-xs text-[#52677d] mt-1">Informasi identitas dan pengaturan akun Anda</p>
    </div>

    <!-- User Info Card -->
    <div class="bg-white border border-[#d8e2ee] rounded-3xl p-6 shadow-sm space-y-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 rounded-2xl bg-[#0b1f3a]/20 text-[#164574] border border-[#b7cbe2] flex items-center justify-center text-2xl font-black">
          {{ userProfile?.nama?.charAt(0) || 'U' }}
        </div>
        <div>
          <h3 class="text-xl font-bold text-[#0b1f3a]">{{ userProfile?.nama }}</h3>
          <p class="text-xs text-[#52677d]">@{{ userProfile?.username }}</p>
          <span class="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-[#123a66]/10 text-[#164574] border border-[#c8d8ea] mt-1">
            {{ userProfile?.role }}
          </span>
        </div>
      </div>

      <div v-if="userProfile?.siswa" class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#d8e2ee] text-xs">
        <div>
          <span class="text-[#6b7f95] font-bold block">NIS</span>
          <span class="text-[#0b1f3a] font-mono font-bold">{{ userProfile.siswa.nis }}</span>
        </div>
        <div>
          <span class="text-[#6b7f95] font-bold block">Kelas</span>
          <span class="text-[#0b1f3a] font-bold">{{ userProfile.siswa.kelas }}</span>
        </div>
        <div>
          <span class="text-[#6b7f95] font-bold block">Rombel</span>
          <span class="text-[#0b1f3a] font-bold">{{ userProfile.siswa.rombel }}</span>
        </div>
      </div>
    </div>

    <!-- Calon Profile Update Section (Only for Calon Ketua / Wakil) -->
    <div v-if="authStore.isCalonKetua || candidateProfile" class="bg-white border border-[#d8e2ee] rounded-3xl p-6 shadow-sm space-y-4">
      <h3 class="text-lg font-bold text-[#0b1f3a]">Kelola Visi, Misi & Foto Paslon</h3>
      <p class="text-xs text-[#52677d]">Pembaruan ini akan ditampilkan secara publik pada halaman Pemungutan Suara.</p>

      <form @submit.prevent="updateCandidateProfile" class="space-y-4 pt-2">
        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Visi Paslon</label>
          <textarea
            v-model="candidateForm.visi"
            rows="3"
            class="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm focus:outline-none focus:border-[#123a66]"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Misi Paslon</label>
          <textarea
            v-model="candidateForm.misi"
            rows="4"
            class="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm focus:outline-none focus:border-[#123a66]"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#334e68] uppercase mb-1">Upload Foto Paslon (Max 2MB)</label>
          <input
            @change="handleFileChange"
            type="file"
            accept="image/*"
            class="w-full text-xs text-[#52677d] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0b1f3a] file:text-white cursor-pointer"
          />
        </div>

        <button
          type="submit"
          :disabled="saving"
          class="px-5 py-2.5 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          <span v-if="saving">Memproses...</span>
          <span v-else>Simpan Pembaruan Profil Paslon</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const userProfile = ref(null);
const candidateProfile = ref(null);
const saving = ref(false);

const candidateForm = ref({
  visi: '',
  misi: '',
  foto: null,
});

const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    candidateForm.value.foto = e.target.files[0];
  }
};

const loadProfile = async () => {
  try {
    const res = await api.get('/auth/me');
    userProfile.value = res.data.user;

    try {
      const candRes = await api.get('/candidate/profile');
      candidateProfile.value = candRes.data;
      candidateForm.value.visi = candRes.data.visi || '';
      candidateForm.value.misi = candRes.data.misi || '';
    } catch (e) {
      // User is not a candidate
    }
  } catch (err) {
    console.error(err);
  }
};

const updateCandidateProfile = async () => {
  saving.value = true;
  const formData = new FormData();
  formData.append('visi', candidateForm.value.visi);
  formData.append('misi', candidateForm.value.misi);
  if (candidateForm.value.foto) {
    formData.append('foto', candidateForm.value.foto);
  }

  try {
    await api.put('/candidate/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Profil paslon berhasil diperbarui!');
    await loadProfile();
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal memperbarui profil.');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>
