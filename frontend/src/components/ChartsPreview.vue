<template>
  <div class="mx-auto flex w-full max-w-2xl flex-col items-center gap-5">
    <div class="relative w-full overflow-hidden">
      <transition name="chart-slide" mode="out-in">
        <div :key="activeSlide.id" class="w-full">
          <div class="mx-auto w-full max-w-lg">
            <Bar
              v-if="activeSlide.id === 'bar'"
              :data="barChartData"
              :options="barChartOptions"
            />
            <Line
              v-else
              :data="lineChartData"
              :options="lineChartOptions"
            />
          </div>
        </div>
      </transition>
    </div>

    <div class="flex w-full items-center justify-between gap-3">
      <button
        type="button"
        aria-label="Previous chart"
        class="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
        @click="goToSlide(slideIndex - 1)"
      >
        <ChevronLeft class="size-4" />
      </button>
      <div
        class="flex items-center gap-2"
        role="tablist"
        aria-label="Chart examples"
      >
        <button
          v-for="(slide, index) in chartSlides"
          :key="slide.id"
          type="button"
          role="tab"
          :aria-label="slide.label"
          :aria-selected="index === slideIndex"
          class="rounded-full transition-all duration-300"
          :class="index === slideIndex
            ? 'h-2 w-6 bg-[var(--color-text)]'
            : 'size-2 bg-[var(--color-text-muted)] opacity-35'"
          @click="goToSlide(index)"
        />
      </div>
      <button
        type="button"
        aria-label="Next chart"
        class="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
        @click="goToSlide(slideIndex + 1)"
      >
        <ChevronRight class="size-4" />
      </button>
    </div>
    <p class="text-center text-xs text-[var(--color-text-muted)]">
      {{ activeSlide.label }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartSlides = [
  { id: 'bar', label: 'Bar chart' },
  { id: 'line', label: 'Line chart' },
];

const slideIndex = ref(0);

const activeSlide = computed(() => chartSlides[slideIndex.value]);

function goToSlide(nextIndex) {
  slideIndex.value = (nextIndex + chartSlides.length) % chartSlides.length;
}

const barChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sessions',
      data: [1240, 1580, 1420, 1890, 1760, 2100],
      backgroundColor: '#2563eb',
      borderRadius: 4,
    },
    {
      label: 'Conversions',
      data: [420, 510, 480, 620, 590, 710],
      backgroundColor: '#7dd3fc',
      borderRadius: 4,
    },
  ],
}));

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 480, easing: 'ease-out' },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: 'var(--color-text-muted)',
        font: { size: 12 },
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
      ticks: { color: 'var(--color-text-muted)' },
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

const lineChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sessions',
      data: [520, 470, 560, 495, 545, 485],
      borderColor: '#2563eb',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
    },
    {
      label: 'Conversions',
      data: [480, 540, 505, 565, 490, 530],
      borderColor: '#7dd3fc',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
    },
  ],
}));

const lineChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 480, easing: 'ease-out' },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: 'var(--color-text-muted)',
        font: { size: 12 },
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
      ticks: { color: 'var(--color-text-muted)' },
    },
    y: {
      min: 400,
      max: 600,
      grid: { color: 'var(--color-border)' },
      ticks: { color: 'var(--color-text-muted)' },
    },
  },
}));
</script>

<style scoped>
.chart-slide-enter-active,
.chart-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.chart-slide-enter-from {
  opacity: 0;
}
.chart-slide-leave-to {
  opacity: 0;
}
</style>
