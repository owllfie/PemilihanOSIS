<template>
  <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] p-6 md:p-8 w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 rounded-2xl shadow-sm transition-colors duration-300">
    <h2 class="text-xl font-semibold text-center tracking-tight text-[#0b1f3a] dark:text-white">
      Objection Breakdown
    </h2>

    <div class="relative flex items-center justify-center">
      <DonutChart
        :data="financialData"
        :size="250"
        :stroke-width="30"
        :animation-duration="1.2"
        :animation-delay-per-segment="0.05"
        :highlight-on-hover="true"
        @segment-hover="onSegmentHover"
      >
        <template #center>
          <transition name="center-fade" mode="out-in">
            <div :key="displayLabel" class="flex flex-col items-center justify-center text-center">
              <p class="text-[var(--color-text-muted)] text-sm font-medium truncate max-w-[150px]">
                {{ displayLabel }}
              </p>
              <p class="text-4xl font-bold text-[var(--color-text)]">
                {{ displayValue }}
              </p>
              <p
                v-if="activeSegment"
                class="text-lg font-medium text-[var(--color-text-muted)]"
              >
                [{{ displayPercentage.toFixed(0) }}%]
              </p>
            </div>
          </transition>
        </template>
      </DonutChart>
    </div>

    <div class="flex flex-col space-y-2 w-full pt-4 border-t border-[var(--color-border)]">
      <div
        v-for="(segment, index) in financialData"
        :key="segment.label"
        class="flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer"
        :class="hoveredSegment === segment.label ? 'bg-[var(--color-surface-2)]' : ''"
        :style="{ animationDelay: (1.2 + index * 0.1) + 's' }"
        @mouseenter="legendHover(segment.label)"
        @mouseleave="legendHover(null)"
      >
        <div class="flex items-center space-x-3">
          <span
            class="h-3 w-3 rounded-full shrink-0"
            :style="{ backgroundColor: segment.color }"
          />
          <span class="text-sm font-medium text-[var(--color-text)]">
            {{ segment.label }}
          </span>
        </div>
        <span class="text-sm font-semibold text-[var(--color-text-muted)]">
          {{ segment.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DonutChart from '@/components/DonutChart.vue';

const financialData = [
  { value: 184, color: '#3b82f6', label: 'Financial Objections' },
  { value: 50, color: '#10b981', label: 'Product Features' },
  { value: 30, color: '#f59e0b', label: 'Timing Issues' },
  { value: 20, color: '#a1a1aa', label: 'Competitor Offers' },
  { value: 10, color: '#8b5cf6', label: 'Other Reasons' },
];

const totalFinancialValue = financialData.reduce((sum, d) => sum + d.value, 0);

const hoveredSegment = ref(null);
const activeSegmentLabel = ref(null);

const activeSegment = computed(() =>
  financialData.find((s) => s.label === activeSegmentLabel.value)
);

const displayValue = computed(() => activeSegment.value?.value ?? totalFinancialValue);
const displayLabel = computed(() => activeSegment.value?.label ?? 'Total Objections');
const displayPercentage = computed(() =>
  activeSegment.value
    ? (activeSegment.value.value / totalFinancialValue) * 100
    : 100
);

function onSegmentHover(segment) {
  activeSegmentLabel.value = segment?.label ?? null;
}

function legendHover(label) {
  hoveredSegment.value = label;
}
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
