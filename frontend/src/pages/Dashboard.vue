<template>
  <div class="space-y-6">
    <!-- Admin / Kepsek Summary Stat Cards -->
    <div v-if="authStore.isAdmin || authStore.isKepalaSekolah" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Jumlah Siswa" :value="stats.total_siswa" subtitle="Siswa terdaftar" />
      <StatCard title="Pemilih Voted" :value="stats.total_pemilih" :subtitle="stats.partisipasi_persen + '% Partisipasi'" />
      <StatCard title="Belum Memilih" :value="stats.belum_memilih" subtitle="Hak suara belum digunakan" />
      <StatCard title="Pasangan Calon" :value="stats.total_kandidat" subtitle="Paslon Ketua OSIS" />
    </div>

    <!-- Siswa Specific Status Card -->
    <div v-if="authStore.isSiswa" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
        <div>
          <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-white mb-2">Status Pemungutan Suara Anda</h3>
          <div v-if="voteStatus.voted" class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <div class="flex items-center space-x-2 font-bold text-base">
              <span>✅</span>
              <span>Anda Sudah Memilih!</span>
            </div>
            <p class="text-xs text-[#334e68] dark:text-gray-300 mt-2">
              Pilihan Anda: <strong class="text-[#0b1f3a] dark:text-white">{{ voteStatus.vote_details?.calon?.nama_paslon }}</strong>
            </p>
            <p class="text-[11px] text-[#52677d] dark:text-gray-400 mt-1">
              Waktu Vote: {{ new Date(voteStatus.vote_details?.waktu_vote).toLocaleString('id-ID') }}
            </p>
          </div>
          <div v-else class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <div class="flex items-center space-x-2 font-bold text-base">
              <span>⚠️</span>
              <span>Anda Belum Memilih</span>
            </div>
            <p class="text-xs text-[#334e68] dark:text-gray-300 mt-2">
              Gunakan hak pilih Anda secara bijak pada menu Pemungutan Suara.
            </p>
            <router-link
              to="/vote"
              class="inline-block mt-3 px-4 py-2 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] dark:bg-white dark:text-[#0b1f3a] dark:hover:bg-gray-100 font-bold text-xs cursor-pointer shadow-sm"
            >
              Ke Halaman Voting &rarr;
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Announcement for Siswa -->
      <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-white mb-3">Pengumuman Terbaru</h3>
        <div v-if="announcements.length > 0" class="space-y-3">
          <div v-for="item in announcements.slice(0, 3)" :key="item.pengumuman_id" class="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#102a44] border border-[#d8e2ee] dark:border-[#1a365d]">
            <h4 class="text-xs font-bold text-[#164574] dark:text-blue-300">{{ item.judul }}</h4>
            <p class="text-xs text-[#334e68] dark:text-gray-300 mt-1 line-clamp-2">{{ item.isi }}</p>
            <span class="text-[10px] text-[#6b7f95] dark:text-gray-400 mt-1 block">{{ new Date(item.tanggal).toLocaleDateString('id-ID') }}</span>
          </div>
        </div>
        <p v-else class="text-xs text-[#6b7f95]">Belum ada pengumuman.</p>
      </div>
    </div>

    <!-- Statistik Perolehan Suara (2 Kolom: Kiri ChartsPreview, Kanan DonutChart) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Kolom Kiri: ChartsPreview (Line Chart dengan Data Real-time) -->
      <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-white">Statistik Grafik Suara</h3>
          </div>
        </div>
        
        <div class="w-full">
          <ChartsPreview :candidates="candidates" />
        </div>
      </div>

      <!-- Kolom Kanan: Donut Chart (Pie Chart dengan Data Real-time) -->
      <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-white">Persentase Suara Paslon</h3>
          </div>
        </div>

        <div class="w-full h-72 sm:h-80 flex items-center justify-center">
          <div v-if="donutData.length > 0" class="flex flex-col items-center gap-4">
            <DonutChart
              :data="donutData"
              :size="220"
              :stroke-width="28"
              :animation-duration="1"
              :animation-delay-per-segment="0.08"
              :highlight-on-hover="true"
              @segment-hover="onDonutHover"
            >
              <template #center>
                <transition name="center-fade" mode="out-in">
                  <div :key="donutCenterLabel" class="flex flex-col items-center justify-center text-center">
                    <p class="text-[var(--color-text-muted)] text-xs font-medium truncate max-w-[120px]">
                      {{ donutCenterLabel }}
                    </p>
                    <p class="text-3xl font-black text-[var(--color-text)]">
                      {{ donutCenterValue }}
                    </p>
                    <p v-if="donutActiveSegment" class="text-sm font-semibold text-[var(--color-text-muted)]">
                      {{ donutCenterPct }}%
                    </p>
                  </div>
                </transition>
              </template>
            </DonutChart>

            <!-- Legend -->
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <div
                v-for="seg in donutData"
                :key="seg.label"
                class="flex items-center gap-1.5 text-xs"
              >
                <span class="h-2.5 w-2.5 rounded-full shrink-0" :style="{ backgroundColor: seg.color }"></span>
                <span class="text-[var(--color-text-muted)]">{{ seg.label }}</span>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-gray-400">Memuat data grafik...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import StatCard from '@/components/StatCard.vue';
import DonutChart from '@/components/DonutChart.vue';
import ChartsPreview from '@/components/ChartsPreview.vue';
import api from '@/services/api';

const POLL_INTERVAL_MS = 10000;

const authStore = useAuthStore();
const activePeriod = ref(null);
const announcements = ref([]);
const voteStatus = ref({ voted: false });
const stats = ref({
  total_siswa: 0,
  total_pemilih: 0,
  belum_memilih: 0,
  partisipasi_persen: 0,
  total_kandidat: 0,
});

const candidates = ref([]);
const isPolling = ref(false);
let pollTimer = null;

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// ── Donut Chart Data (Real-time) ───────────────────────────────
const donutData = computed(() =>
  candidates.value.map((c, i) => ({
    value: c.total_suara ?? c.suara ?? 0,
    color: PALETTE[i % PALETTE.length],
    label: c.nama_paslon || `Paslon ${c.nomor_urut}`,
  }))
);

const donutActiveSegment = ref(null);

const donutCenterLabel = computed(() => donutActiveSegment.value?.label ?? 'Total Suara');
const donutCenterValue = computed(() => {
  if (donutActiveSegment.value) return donutActiveSegment.value.value;
  return candidates.value.reduce((sum, c) => sum + (c.total_suara ?? c.suara ?? 0), 0);
});
const donutCenterPct = computed(() => {
  if (!donutActiveSegment.value) return 0;
  const total = candidates.value.reduce((sum, c) => sum + (c.total_suara ?? c.suara ?? 0), 0);
  return total === 0 ? 0 : ((donutActiveSegment.value.value / total) * 100).toFixed(1);
});

function onDonutHover(segment) {
  donutActiveSegment.value = segment;
}

// ── Data fetching + polling (Real-time update) ─────────────────
async function loadDashboardData() {
  try {
    const statsRes = await api.get('/statistics');
    stats.value = statsRes.data.summary;
    activePeriod.value = statsRes.data.periode_aktif;
    candidates.value = statsRes.data.candidates || [];

    if (candidates.value.length === 0) {
      const candRes = await api.get('/candidate');
      candidates.value = candRes.data;
    }

    const annRes = await api.get('/announcement');
    announcements.value = annRes.data;

    if (authStore.isSiswa) {
      const voteRes = await api.get('/vote/status');
      voteStatus.value = voteRes.data;
    }

    isPolling.value = true;
  } catch (err) {
    console.error(err);
  }
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(() => {
    loadDashboardData();
  }, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

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

onMounted(async () => {
  await loadDashboardData();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped>
.center-fade-enter-active,
.center-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.center-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.center-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>