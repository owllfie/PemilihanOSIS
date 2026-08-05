<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-[#0b1f3a]">Hasil & Rekapitulasi E-Voting</h2>
        <p class="text-xs text-[#52677d] mt-1">Perolehan suara langsung Pemilihan Ketua & Wakil OSIS</p>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Total Pemilih Voted" :value="stats.total_pemilih" subtitle="Suara sah masuk">
        <template #icon></template>
      </StatCard>
      <StatCard title="Total DPT (Siswa)" :value="stats.total_siswa" subtitle="Pemilih terdaftar">
        <template #icon></template>
      </StatCard>
      <StatCard title="Tingkat Partisipasi" :value="stats.partisipasi_persen + '%'" subtitle="Persentase pemilih">
        <template #icon></template>
      </StatCard>
    </div>

    <!-- Perolehan Suara Progress Bars -->
    <div class="bg-white border border-[#d8e2ee] rounded-3xl p-6 shadow-sm space-y-6">
      <h3 class="text-lg font-bold text-[#0b1f3a] border-b border-[#d8e2ee] pb-3">Detail Perolehan Suara per Paslon</h3>

      <div v-for="c in candidates" :key="c.calon_id" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="font-bold text-[#0b1f3a]">{{ c.nama_paslon }}</span>
          <span class="font-extrabold text-[#164574]">{{ c.total_suara }} Suara ({{ c.persentase }}%)</span>
        </div>
        <div class="w-full bg-[#f8fafc] h-4 rounded-full overflow-hidden p-0.5 border border-[#d8e2ee]">
          <div
            class="h-full rounded-full transition-all duration-1000 shadow-sm"
            :style="{ width: c.persentase + '%', backgroundColor: c.color }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Printable Report View (Visible when printing) -->
    <div id="printable-report" class="hidden print:block text-black p-8 bg-white font-serif space-y-4">
      <div class="text-center border-b-2 border-black pb-4">
        <h1 class="text-xl font-bold uppercase">LAPORAN REKAPITULASI HASIL PEMILIHAN KETUA OSIS</h1>
        <p class="text-sm font-semibold mt-1">PERIODE PEMILIHAN 2026/2027</p>
        <p class="text-xs text-gray-600 mt-0.5">SISTEM INFORMASI E-VOTING OSIS</p>
      </div>

      <div class="text-xs space-y-1">
        <p><strong>Tanggal Cetak:</strong> {{ new Date().toLocaleString('id-ID') }}</p>
        <p><strong>Total Siswa Terdaftar (DPT):</strong> {{ stats.total_siswa }}</p>
        <p><strong>Total Suara Masuk:</strong> {{ stats.total_pemilih }}</p>
        <p><strong>Persentase Partisipasi:</strong> {{ stats.partisipasi_persen }}%</p>
      </div>

      <table class="w-full border-collapse border border-black text-xs mt-4">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-black p-2">No. Urut</th>
            <th class="border border-black p-2 text-left">Nama Pasangan Calon</th>
            <th class="border border-black p-2">Jumlah Suara</th>
            <th class="border border-black p-2">Persentase</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in candidates" :key="c.calon_id">
            <td class="border border-black p-2 text-center">{{ c.nomor_urut }}</td>
            <td class="border border-black p-2">{{ c.nama_paslon }}</td>
            <td class="border border-black p-2 text-center">{{ c.total_suara }}</td>
            <td class="border border-black p-2 text-center">{{ c.persentase }}%</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-12 flex justify-between text-xs pt-8">
        <div class="text-center">
          <p>Mengetahui,</p>
          <p class="font-bold mt-12">Pembina OSIS</p>
        </div>
        <div class="text-center">
          <p>Disahkan oleh,</p>
          <p class="font-bold mt-12">Kepala Sekolah</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatCard from '@/components/StatCard.vue';
import api from '@/services/api';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const candidates = ref([]);
const stats = ref({
  total_siswa: 0,
  total_pemilih: 0,
  partisipasi_persen: 0,
});

const loadData = async () => {
  try {
    const res = await api.get('/statistics');
    stats.value = res.data.summary;
    candidates.value = (res.data.candidates || []).map((c, i) => ({ ...c, color: PALETTE[i % PALETTE.length] }));
  } catch (err) {
    console.error(err);
  }
};

const printReport = () => {
  window.print();
};

onMounted(() => {
  loadData();
});
</script>
