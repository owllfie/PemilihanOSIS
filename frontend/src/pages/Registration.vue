<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-[#0b1f3a]">Pendaftaran Calon Anggota OSIS</h2>
      <p class="text-xs text-[#52677d] mt-1">Formulir pendaftaran dan status seleksi pendaftaran anggota OSIS</p>
    </div>

    <!-- Siswa View: Registration Form / Status -->
    <div v-if="authStore.isSiswa" class="max-w-2xl mx-auto space-y-6">
      <div v-if="myRegistration" class="bg-white border border-[#d8e2ee] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-[#0b1f3a]">Status Pendaftaran Anda</h3>
        
        <div
          class="p-4 rounded-2xl border flex items-center justify-between"
          :class="{
            'bg-amber-500/10 border-amber-500/30 text-amber-300': myRegistration.status === 'Menunggu',
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-400': myRegistration.status === 'Lulus',
            'bg-rose-500/10 border-rose-500/30 text-rose-400': myRegistration.status === 'Tidak Lulus' || myRegistration.status === 'Tidak_Lulus'
          }"
        >
          <div>
            <span class="text-xs uppercase font-extrabold tracking-wider block text-[#52677d]">Status Seleksi Pembina:</span>
            <span class="text-xl font-black mt-1 block">{{ formatStatus(myRegistration.status) }}</span>
          </div>
          <span class="text-3xl">
            {{ myRegistration.status === 'Lulus' ? '🎉' : myRegistration.status === 'Menunggu' ? '⏳' : '❌' }}
          </span>
        </div>

        <div class="bg-[#f8fafc] p-4 rounded-2xl border border-[#d8e2ee] space-y-1 text-xs">
          <span class="font-bold text-[#52677d]">Alasan / Motivasi Mendaftar:</span>
          <p class="text-[#102a44] whitespace-pre-line mt-1">{{ myRegistration.alasan }}</p>
          <span class="text-[10px] text-[#6b7f95] block pt-2">Tanggal Daftar: {{ new Date(myRegistration.tanggal_daftar).toLocaleDateString('id-ID') }}</span>
        </div>
      </div>

      <div v-else class="bg-white border border-[#d8e2ee] rounded-3xl p-8 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-[#0b1f3a]">Formulir Pendaftaran Anggota OSIS</h3>
        <p class="text-xs text-[#52677d]">Isi motivasi dan alasan Anda ingin bergabung menjadi pengurus/anggota OSIS.</p>

        <form @submit.prevent="submitRegistration" class="space-y-4 pt-2">
          <div>
            <label class="block text-xs font-bold text-[#334e68] uppercase mb-1.5">Alasan & Motivasi Mendaftar</label>
            <textarea
              v-model="alasan"
              rows="5"
              required
              placeholder="Tuliskan alasan, pengalaman, atau program kerja yang ingin Anda jalankan di OSIS..."
              class="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-[#d8e2ee] text-[#0b1f3a] text-sm focus:outline-none focus:border-[#123a66]"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#0b1f3a] hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            <span v-if="submitting">Mengirimkan Pendaftaran...</span>
            <span v-else>Kirimkan Pendaftaran Sekarang</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Pembina / Admin View: Review Applicants Table -->
    <div v-else class="bg-white border border-[#d8e2ee] rounded-3xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-[#d8e2ee] flex items-center justify-between">
        <h3 class="text-lg font-bold text-[#0b1f3a]">Daftar Pendaftar Anggota OSIS</h3>
        <span class="text-xs text-[#52677d]">Total Pendaftar: {{ registrations.length }}</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-[#334e68]">
          <thead class="bg-white text-[#52677d] uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th class="px-6 py-4">Pendaftar</th>
              <th class="px-6 py-4">NIS / Kelas</th>
              <th class="px-6 py-4">Alasan / Motivasi</th>
              <th class="px-6 py-4">Tgl Daftar</th>
              <th class="px-6 py-4">Status Seleksi</th>
              <th class="px-6 py-4 text-right">Aksi Pembina</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#d8e2ee]">
            <tr v-for="r in registrations" :key="r.pendaftaran_id" class="hover:bg-[#f1f5f9] transition-colors">
              <td class="px-6 py-4 font-bold text-[#0b1f3a]">{{ r.siswa?.user?.nama || 'Unknown' }}</td>
              <td class="px-6 py-4">{{ r.siswa?.nis }} ({{ r.siswa?.kelas }})</td>
              <td class="px-6 py-4 max-w-xs truncate">{{ r.alasan }}</td>
              <td class="px-6 py-4">{{ new Date(r.tanggal_daftar).toLocaleDateString('id-ID') }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20': r.status === 'Menunggu',
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': r.status === 'Lulus',
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20': r.status === 'Tidak Lulus' || r.status === 'Tidak_Lulus'
                  }"
                >
                  {{ formatStatus(r.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button
                  @click="updateStatus(r.pendaftaran_id, 'Lulus')"
                  class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                >
                  Luluskan
                </button>
                <button
                  @click="updateStatus(r.pendaftaran_id, 'Tidak Lulus')"
                  class="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                >
                  Tolak
                </button>
              </td>
            </tr>
            <tr v-if="registrations.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-[#6b7f95]">Belum ada pendaftaran anggota OSIS.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const myRegistration = ref(null);
const registrations = ref([]);
const alasan = ref('');
const submitting = ref(false);

const formatStatus = (s) => {
  if (s === 'Tidak_Lulus') return 'Tidak Lulus';
  return s;
};

const loadRegistrationData = async () => {
  try {
    if (authStore.isSiswa) {
      const res = await api.get('/registration/status');
      myRegistration.value = res.data.registration;
    } else {
      const res = await api.get('/registration');
      registrations.value = res.data;
    }
  } catch (err) {
    console.error(err);
  }
};

const submitRegistration = async () => {
  submitting.value = true;
  try {
    await api.post('/registration', { alasan: alasan.value });
    await loadRegistrationData();
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal mendaftar.');
  } finally {
    submitting.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await api.put(`/registration/${id}`, { status });
    await loadRegistrationData();
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal mengubah status.');
  }
};

onMounted(() => {
  loadRegistrationData();
});
</script>
