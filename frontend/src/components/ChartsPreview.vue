<template>
  <div class="mx-auto flex w-full flex-col items-center gap-4">
    <div class="relative h-72 sm:h-80 w-full overflow-hidden">
      <Line
        v-if="hasData"
        :data="lineChartData"
        :options="lineChartOptions"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]"
      >
        Belum ada data suara, menunggu pembaruan realtime&hellip;
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import api from '@/services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  candidates: {
    type: Array,
    default: () => [],
  },
});

const POLL_INTERVAL_MS = 10000;
const MAX_POINTS = 30;

const PALETTE = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const history = ref([]);
const names = ref({});
const lastUpdated = ref('');
let pollTimer = null;

const realtimeEnabled = computed(() => props.candidates && props.candidates.length > 0);
const hasData = computed(() => history.value.length > 0);

function pushSnapshot(source) {
  const now = new Date();
  const votes = {};
  source.forEach((c, index) => {
    const id = c.calon_id ?? c.id ?? `idx_${index}`;
    votes[id] = c.total_suara ?? c.suara ?? 0;
    names.value[id] = c.nama_paslon || `Paslon ${c.nomor_urut ?? index + 1}`;
  });
  history.value.push({ time: now.toLocaleTimeString('id-ID'), votes });
  if (history.value.length > MAX_POINTS) {
    history.value.shift();
  }
  lastUpdated.value = now.toLocaleTimeString('id-ID');
}

async function fetchSnapshot() {
  try {
    const res = await api.get('/statistics');
    const cands = res.data.candidates || [];
    if (cands.length) {
      pushSnapshot(cands);
    }
  } catch (err) {
    console.error(err);
  }
}

watch(
  () => props.candidates,
  (val) => {
    if (val && val.length) {
      pushSnapshot(val);
    }
  },
  { deep: true }
);

onMounted(async () => {
  if (realtimeEnabled.value) {
    pushSnapshot(props.candidates);
  } else {
    await fetchSnapshot();
    pollTimer = setInterval(fetchSnapshot, POLL_INTERVAL_MS);
  }
});

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
});

const lineChartData = computed(() => {
  if (!history.value.length) {
    return { labels: [], datasets: [] };
  }

  const labels = history.value.map((h) => h.time);

  const candidateIds = [];
  history.value.forEach((h) => {
    Object.keys(h.votes).forEach((id) => {
      if (!candidateIds.includes(id)) {
        candidateIds.push(id);
      }
    });
  });

  const datasets = candidateIds.map((id, i) => ({
    label: names.value[id] || `Paslon ${i + 1}`,
    data: history.value.map((h) => h.votes[id] ?? 0),
    borderColor: PALETTE[i % PALETTE.length],
    backgroundColor: PALETTE[i % PALETTE.length] + '26',
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 4,
    pointHitRadius: 8,
    tension: 0.3,
    fill: true,
  }));

  return { labels, datasets };
});

const lineChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 500, easing: 'ease-out' },
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: 'var(--color-text-muted)',
        font: { size: 11 },
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: 'var(--color-surface)',
      titleColor: 'var(--color-text)',
      bodyColor: 'var(--color-text-muted)',
      borderColor: 'var(--color-border)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: 'var(--color-text-muted)',
        font: { size: 10 },
        maxTicksLimit: 6,
        maxRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'var(--color-border)' },
      ticks: {
        color: 'var(--color-text-muted)',
        precision: 0,
      },
    },
  },
}));
</script>
