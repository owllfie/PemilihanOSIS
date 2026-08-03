<template>
  <div class="space-y-6">
    <!-- Header Welcome Banner -->
    <div class="bg-white border-l-4 border-l-[#0b1f3a] border-y border-r border-[#c8d8ea] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
      <div class="relative z-10">
        <span class="inline-block text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-[#123a66]/20 text-[#123a66] border border-[#b7cbe2] mb-3">
          Dashboard {{ formatRole(authStore.role) }}
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-[#0b1f3a]">Selamat Datang, {{ authStore.nama }}!</h2>
        <p class="text-sm text-[#334e68] mt-1 max-w-2xl">
          Sistem Informasi Pemilihan Ketua & Anggota OSIS Periode {{ activePeriod ? activePeriod.nama_periode : '2026/2027' }}.
        </p>
      </div>
    </div>

    <!-- Active Period Status Banner (For Admin Control) -->
    <div v-if="authStore.isAdmin" class="bg-white border border-[#d8e2ee] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h4 class="text-sm font-bold text-[#0b1f3a]">Status Periode Pemilihan:</h4>
        <div class="flex items-center space-x-2 mt-1">
          <span
            class="w-2.5 h-2.5 rounded-full"
            :class="activePeriod ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"
          ></span>
          <span class="text-sm font-bold" :class="activePeriod ? 'text-emerald-400' : 'text-rose-400'">
            {{ activePeriod ? activePeriod.nama_periode + ' (BERJALAN)' : 'TIDAK ADA PERIODE AKTIF' }}
          </span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <button
          v-if="!activePeriod"
          @click="openPeriodModal"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 cursor-pointer"
        >
          + Buka Periode Pemilihan Baru
        </button>
        <button
          v-else
          @click="closeActivePeriod"
          class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 cursor-pointer"
        >
          🔒 Tutup Periode Pemilihan
        </button>
      </div>
    </div>

    <!-- Admin / Kepsek Summary Stat Cards -->
    <div v-if="authStore.isAdmin || authStore.isKepalaSekolah" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Jumlah Siswa" :value="stats.total_siswa" subtitle="Siswa terdaftar">
        <template #icon>👨‍🎓</template>
      </StatCard>

      <StatCard title="Pemilih Voted" :value="stats.total_pemilih" :subtitle="stats.partisipasi_persen + '% Partisipasi'">
        <template #icon>🗳️</template>
      </StatCard>

      <StatCard title="Belum Memilih" :value="stats.belum_memilih" subtitle="Hak suara belum digunakan">
        <template #icon>⏳</template>
      </StatCard>

      <StatCard title="Pasangan Calon" :value="stats.total_kandidat" subtitle="Paslon Ketua OSIS">
        <template #icon>🏆</template>
      </StatCard>
    </div>

    <!-- Siswa Specific Status Card -->
    <div v-if="authStore.isSiswa" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border border-[#d8e2ee] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-[#0b1f3a] mb-2">Status Pemungutan Suara Anda</h3>
          <div v-if="voteStatus.voted" class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <div class="flex items-center space-x-2 font-bold text-base">
              <span>✅</span>
              <span>Anda Sudah Memilih!</span>
            </div>
            <p class="text-xs text-[#334e68] mt-2">
              Pilihan Anda: <strong class="text-[#0b1f3a]">{{ voteStatus.vote_details?.calon?.nama_paslon }}</strong>
            </p>
            <p class="text-[11px] text-[#52677d] mt-1">
              Waktu Vote: {{ new Date(voteStatus.vote_details?.waktu_vote).toLocaleString('id-ID') }}
            </p>
          </div>
          <div v-else class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <div class="flex items-center space-x-2 font-bold text-base">
              <span>⚠️</span>
              <span>Anda Belum Memilih</span>
            </div>
            <p class="text-xs text-[#334e68] mt-2">
              Gunakan hak pilih Anda secara bijak pada menu Pemungutan Suara.
            </p>
            <router-link
              to="/vote"
              class="inline-block mt-3 px-4 py-2 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Ke Halaman Voting &rarr;
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Announcement for Siswa -->
      <div class="bg-white border border-[#d8e2ee] rounded-2xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-[#0b1f3a] mb-3">Pengumuman Terbaru</h3>
        <div v-if="announcements.length > 0" class="space-y-3">
          <div v-for="item in announcements.slice(0, 3)" :key="item.pengumuman_id" class="p-3 rounded-xl bg-[#f8fafc] border border-[#d8e2ee]">
            <h4 class="text-xs font-bold text-[#164574]">{{ item.judul }}</h4>
            <p class="text-xs text-[#334e68] mt-1 line-clamp-2">{{ item.isi }}</p>
            <span class="text-[10px] text-[#6b7f95] mt-1 block">{{ new Date(item.tanggal).toLocaleDateString('id-ID') }}</span>
          </div>
        </div>
        <p v-else class="text-xs text-[#6b7f95]">Belum ada pengumuman.</p>
      </div>
    </div>

    <!-- Quick Paslon Preview -->
    <div class="bg-white border border-[#d8e2ee] rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-[#0b1f3a]">Pasangan Calon Ketua OSIS</h3>
        <router-link to="/candidate" class="text-xs text-[#164574] hover:underline font-semibold">Lihat Semua &rarr;</router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CandidateCard
          v-for="c in candidates"
          :key="c.calon_id"
          :candidate="c"
          :can-vote="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import StatCard from '@/components/StatCard.vue';
import CandidateCard from '@/components/CandidateCard.vue';
import api from '@/services/api';

const authStore = useAuthStore();
const activePeriod = ref(null);
const candidates = ref([]);
const announcements = ref([]);
const voteStatus = ref({ voted: false });
const stats = ref({
  total_siswa: 0,
  total_pemilih: 0,
  belum_memilih: 0,
  partisipasi_persen: 0,
  total_kandidat: 0,
});

const formatRole = (role) => {
  const map = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    siswa: 'Siswa',
    calon_ketua: 'Calon Ketua',
    pembina: 'Pembina',
    kepala_sekolah: 'Kepala Sekolah',
  };
  return map[role] || role;
};

const loadDashboardData = async () => {
  try {
    const statsRes = await api.get('/statistics');
    stats.value = statsRes.data.summary;
    activePeriod.value = statsRes.data.periode_aktif;
    
    const candRes = await api.get('/candidate');
    candidates.value = candRes.data;

    const annRes = await api.get('/announcement');
    announcements.value = annRes.data;

    if (authStore.isSiswa) {
      const voteRes = await api.get('/vote/status');
      voteStatus.value = voteRes.data;
    }
  } catch (err) {
    console.error(err);
  }
};

const closeActivePeriod = async () => {
  if (!activePeriod.value) return;
  if (confirm('Yakin ingin menutup periode pemilihan ini? Siswa tidak akan dapat memilih lagi.')) {
    try {
      await api.put(`/period/${activePeriod.value.periode_id}/status`, { status: 'selesai' });
      await loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengubah status');
    }
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>
